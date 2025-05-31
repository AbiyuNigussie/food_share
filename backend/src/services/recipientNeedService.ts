// src/services/user/recipientNeedService.ts

import { PrismaClient, RecipientNeed, Donation, Location } from "@prisma/client";
import { scoreAndSort } from "../utils/match";

const prisma = new PrismaClient();

/**
 * Exactly the same shape as DonationService’s Address:
 */
interface Address {
  label: string;
  latitude: number;
  longitude: number;
}

/**
 * We’ll pass around this type in our fuzzy‐matching.
 * It’s just “Donation + locationLabel” so scoreAndSort can read the city name, etc.
 */
type DonationWithLabel = Donation & { locationLabel: string };

/**
 * Create a new need. Steps:
 *   1) Create a Location record for the drop‐off address
 *   2) Create the RecipientNeed itself, pointing at that Location
 *   3) Fetch all “pending” donations of this foodType (including each Donation’s `Location`)
 *   4) Build a DonationWithLabel[] (Donation + “locationLabel” = location.label)
 *   5) Run scoreAndSort(need, DonationWithLabel[])
 *   6) Notify the recipient about each top‐match
 */
export async function createNeed(
  recipientId: string,
  data: {
    foodType: string;
    quantity: string;
    dropoffLocation: Address;
    contactPhone: string;
    notes?: string;
  }
) {
  // 1) Create a Location for the drop‐off address
  const dropLoc = await prisma.location.create({
    data: {
      label: data.dropoffLocation.label,
      latitude: data.dropoffLocation.latitude,
      longitude: data.dropoffLocation.longitude,
    },
  });

  // 2) Create the RecipientNeed row (status defaults to "pending")
  const newNeed = await prisma.recipientNeed.create({
    data: {
      recipientId:      recipientId,
      foodType:         data.foodType,
      quantity:         data.quantity,
      dropoffLocationId: dropLoc.id,
      contactPhone:     data.contactPhone,
      notes:            data.notes,
      status:           "pending",
    },
  });

  // 3) Fetch all pending donations of the same foodType, along with their Location
  const donationCandidates = await prisma.donation.findMany({
    where: {
      foodType: data.foodType,
      status:   "pending",
      expiryDate: { gt: new Date() },
    },
    include: {
      location: true,
    },
  });

  // 4) Build DonationWithLabel[] by copying Donation fields + location.label
  const donationWithLabels: DonationWithLabel[] = donationCandidates.map((don) => ({
    ...don,
    locationLabel: don.location.label,
  }));

  const newNeedWithLocation = {
  ...newNeed,
  dropoffLabel: dropLoc.label, // ✅ Add this field
};

  // 5) Run fuzzy‐matching.  scoreAndSort returns a plain Donation[],
  //    but we know it came from DonationWithLabel[], so cast back:
  const topMatches = scoreAndSort(newNeedWithLocation, donationWithLabels) as DonationWithLabel[];

  // 6) Send a notification to this new need’s owner for each top match
  for (const matchedDonation of topMatches) {
    await prisma.notification.create({
      data: {
        userId: newNeed.recipientId,
        message: `We found a matching donation (${matchedDonation.quantity} ${matchedDonation.foodType}) for your need.`,
        meta: {
          needId: newNeed.id,
          donationId: matchedDonation.id,
        },
      },
    });
  }

  return newNeed;
}

/**
 * Return all “pending” needs (for pagination).
 */
export async function getAllNeeds(
  recipientId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.recipientNeed.findMany({
    where: { recipientId, status: "pending" },
    orderBy: { requestedAt: "desc" },
    skip:  (page - 1) * rowsPerPage,
    take:  rowsPerPage,
    include: {
      dropoffLocation: true, // include the drop‐off Location row
    },
  });
}

/**
 * Count total “pending” needs (for the pagination footer).
 */
export async function getNeedsCount(recipientId: string) {
  return prisma.recipientNeed.count({
    where: { recipientId, status: "pending" },
  });
}

/**
 * Delete a need—only if it belongs to that recipient.
 */
export async function deleteNeedById(
  recipientId: string,
  needId: string
) {
  return prisma.recipientNeed.deleteMany({
    where: { id: needId, recipientId },
  });
}

/**
 * Update an existing need’s fields. You can update any subset.
 */
export async function updateNeed(
  recipientId: string,
  needId: string,
  data: {
    foodType?: string;
    quantity?: string;
    dropoffLocationId?: string;
    notes?: string;
    contactPhone?: string;
  }
) {
  return prisma.recipientNeed.updateMany({
    where: { id: needId, recipientId },
    data: {
      ...(data.foodType !== undefined && { foodType: data.foodType }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.dropoffLocationId !== undefined && { dropoffLocationId: data.dropoffLocationId }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
    },
  });
}

/**
 * Given a `needId`, return the top‐5 fuzzy‐matched donations.
 * Notice we include the Donation→Location to get a `location.label`.
 */
export async function findMatchesForNeed(needId: string) {
  const need = await prisma.recipientNeed.findUnique({
    where: { id: needId },
    select: {
      id: true,
      foodType: true,
      quantity: true,
      dropoffLocation: true,
      // We don’t actually need dropoffLocation here—scoreAndSort only
      // uses the need’s foodType / quantity / dropoffAddress. If you want
      // to fuzzy‐match by city, you could also fetch need.dropoffLocation.label.
    },
  });
  if (!need) throw new Error("Need not found");

  const needWithLabel = {
  ...need,
  dropoffLabel: need.dropoffLocation.label, // ✅ Fix here
};
  // Fetch all available candidate donations of that foodType
  const donationCandidates = await prisma.donation.findMany({
    where: {
      foodType: need.foodType,
      status:   "pending",
      expiryDate: { gt: new Date() },
    },
    include: {
      location: true,
    },
  });

  // Build DonationWithLabel[] from those candidates:
  const donationWithLabels: DonationWithLabel[] = donationCandidates.map((don) => ({
    ...don,
    locationLabel: don.location.label,
  }));

  // Return the top 5 by fuzzy‐scoring:
  return scoreAndSort(need as any /*RecipientNeed*/, donationWithLabels) as DonationWithLabel[];
}

/**
 * Claim a donation for a “need.” Steps (all in one transaction):
 *  1) Load the need → get dropoffLocationId & contactPhone & recipientId
 *  2) Update the need → set status="matched", connect matchedDonation
 *  3) Update the donation → set status="matched", set matchedNeedId
 *  4) Use that same dropoffLocationId (which already has valid lat/lng)
 *  5) Create a Delivery row using:
 *       • pickupLocationId = (donation.locationId)
 *       • dropoffLocationId = (need.dropoffLocationId)
 *       • recipientPhone = (need.contactPhone)
 *  6) Notify the recipient that the reservation is done
 */
export async function claimMatch(
  needId: string,
  donationId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1) Load the need → dropoffLocationId & contactPhone & recipientId
    const need = await tx.recipientNeed.findUnique({
      where: { id: needId },
      select: {
        dropoffLocationId: true,
        contactPhone:      true,
        recipientId:       true,
      },
    });
    if (!need) throw new Error("Need not found");

    // 2) Update the need → set status="matched" & link donation
    const updatedNeed = await tx.recipientNeed.update({
      where: { id: needId },
      data: {
        status: "matched",
        matchedDonation: { connect: { id: donationId } },
      },
      select: {
        recipientId: true,
        dropoffLocationId: true,
        contactPhone: true,
      },
    });

    // 3) Update the donation → set status="matched" & matchedNeedId
    //    Also capture locationId so we know pickup‐coords
    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: {
        status:       "matched",
        matchedNeedId: needId,
      },
      select: {
        id:         true,
        locationId: true,
        quantity:   true,
        foodType:   true,
      },
    });

    // 4) Create a Delivery record using the existing pickupLocation & dropoffLocation
    await tx.delivery.create({
      data: {
        donationId:        donationId,
        recipientPhone:    updatedNeed.contactPhone,
        deliveryStatus:    "PENDING",
        pickupLocationId:  updatedDonation.locationId,
        dropoffLocationId: updatedNeed.dropoffLocationId,
        deliveryInstructions: null,
      },
    });

    // 5) Finally, notify the recipient that their matched donation is reserved
    await tx.notification.create({
      data: {
        userId:  updatedNeed.recipientId!,
        message: `A donation of ${updatedDonation.quantity} ${updatedDonation.foodType} has been reserved for your need.`,
        meta: {
          needId,
          donationId: updatedDonation.id,
        },
      },
    });

    return { updatedNeed, updatedDonation };
  });
}
