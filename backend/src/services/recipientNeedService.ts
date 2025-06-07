import { PrismaClient, RecipientNeed, Donation, Location } from "@prisma/client";
import { scoreAndSort } from "../utils/match";

const prisma = new PrismaClient();

interface Address {
  label: string;
  latitude: number;
  longitude: number;
}
type DonationWithLabel = Donation & { locationLabel: string };

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

  const dropLoc = await prisma.location.create({
    data: {
      label: data.dropoffLocation.label,
      latitude: data.dropoffLocation.latitude,
      longitude: data.dropoffLocation.longitude,
    },
  });

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

  const donationWithLabels: DonationWithLabel[] = donationCandidates.map((don) => ({
    ...don,
    locationLabel: don.location.label,
  }));

  const newNeedWithLocation = {
    ...newNeed,
    dropoffLabel: dropLoc.label,
  };

  const topMatches = scoreAndSort(
    newNeedWithLocation as any,
    donationWithLabels
  ) as DonationWithLabel[];

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

  for (const matchedDonation of topMatches) {
    await prisma.notification.create({
      data: {
        userId: matchedDonation.donorId!,
        message: `Your donation (${matchedDonation.quantity} ${matchedDonation.foodType}) was matched to a recipient need.`,
        meta: {
          needId: newNeed.id,
          donationId: matchedDonation.id,
        },
      },
    });
  }

  return newNeed;
}

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
      dropoffLocation: true,
    },
  });
}

export async function getNeedsCount(recipientId: string) {
  return prisma.recipientNeed.count({
    where: { recipientId, status: "pending" },
  });
}

export async function deleteNeedById(
  recipientId: string,
  needId: string
) {
  return prisma.recipientNeed.deleteMany({
    where: { id: needId, recipientId },
  });
}

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

export async function findMatchesForNeed(needId: string) {
  const need = await prisma.recipientNeed.findUnique({
    where: { id: needId },
    select: {
      id: true,
      foodType: true,
      quantity: true,
      dropoffLocation: true,
    },
  });
  if (!need) throw new Error("Need not found");

  const needWithLabel = {
    ...need,
    dropoffLabel: need.dropoffLocation.label,
  };

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

  const donationWithLabels: DonationWithLabel[] = donationCandidates.map((don) => ({
    ...don,
    locationLabel: don.location.label,
  }));

  return scoreAndSort(needWithLabel as any, donationWithLabels) as DonationWithLabel[];
}

export async function claimMatch(
  needId: string,
  donationId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1) Load the need
    const need = await tx.recipientNeed.findUnique({
      where: { id: needId },
      select: {
        dropoffLocationId: true,
        contactPhone:      true,
        recipientId:       true,
      },
    });
    if (!need) throw new Error("Need not found");

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

    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: {
        status:        "matched",
        matchedNeedId: needId,
      },
      select: {
        id:         true,
        donorId:    true,
        locationId: true,
        quantity:   true,
        foodType:   true,
      },
    });

    const delivery = await tx.delivery.create({
      data: {
        donationId:           donationId,
        recipientPhone:       updatedNeed.contactPhone,
        deliveryStatus:       "PENDING",
        pickupLocationId:     updatedDonation.locationId,
        dropoffLocationId:    updatedNeed.dropoffLocationId,
        deliveryInstructions: null,
      },
    });

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

    await tx.notification.create({
      data: {
        userId:  updatedDonation.donorId!,
        message: `Your donation of ${updatedDonation.quantity} ${updatedDonation.foodType} has been reserved by a recipient.`,
        meta: {
          needId,
          donationId: updatedDonation.id,
        },
      },
    });

    const allStaff = await tx.logisticsStaff.findMany({ select: { userId: true } });
    await Promise.all(
      allStaff.map(s =>
        tx.notification.create({
          data: {
            userId: s.userId,
            message: `New delivery scheduled for ${updatedDonation.foodType} (${updatedDonation.quantity}).`,
            meta: { donationId: updatedDonation.id, deliveryId: delivery.id },
          },
        })
      )
    );

    return { updatedNeed, updatedDonation };
  });
}
