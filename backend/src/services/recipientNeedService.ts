// src/services/user/recipientNeedService.ts
import { PrismaClient } from "@prisma/client";
import { scoreAndSort } from "../utils/match";

const prisma = new PrismaClient();

/**
 * Create a new need.
 */
export async function createNeed(
  recipientId: string,
  data: { foodType: string; quantity: string; DropOffAddress: string; notes?: string }
) {
  // 1) Create the need
  const newNeed = await prisma.recipientNeed.create({
    data: {
      recipientId,
      foodType: data.foodType,
      quantity: data.quantity,
      DropOffAddress: data.DropOffAddress,
      notes: data.notes,
    },
  });

  // 2) Run the fuzzy matching algorithm
  const matches = await findMatchesForNeed(newNeed.id);

  // 3) Notify the recipient about each match
  //    (you can choose to notify only the top 1, or all 5)
  for (const donation of matches) {
  await prisma.notification.create({
  data: {
    userId: recipientId,
    message: `We found a matching donation of ${donation.quantity} ${donation.foodType} for your need.`,
    meta: {
      needId: newNeed.id,
      donationId: donation.id,
    },
  },
});
  }


  // 4) Return the freshly created need
  return newNeed;
}

/**
 * Get paginated needs.
 */
export async function getAllNeeds(
  recipientId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.recipientNeed.findMany({
    where: { recipientId },
    orderBy: { requestedAt: "desc" },
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  });
}

/**
 * Count total needs for pagination.
 */
export async function getNeedsCount(recipientId: string) {
  return prisma.recipientNeed.count({
    where: { recipientId },
  });
}

/**
 * Delete a need (must belong to this recipient).
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
 * Update an existing need.
 * Only updates provided fields.
 */
export async function updateNeed(
  recipientId: string,
  needId: string,
  data: {
    foodType?: string;
    quantity?: string;
    dropOffAddress?: string;
    notes?: string;
  }
) {
  return prisma.recipientNeed.updateMany({
    where: { id: needId, recipientId },
    data,
  });
}

/**
 * Returns the top fuzzy-matched donations for a given need.
 */
export async function findMatchesForNeed(needId: string) {
  const need = await prisma.recipientNeed.findUnique({
    where: { id: needId },
  });
  if (!need) {
    throw new Error("Need not found");
  }

  // Fetch all available candidates
  const candidates = await prisma.donation.findMany({
    where: {
      foodType: need.foodType,
      status: "pending",
      expiryDate: { gt: new Date() },
    },
  });

  // Return top 5 by your fuzzy-scoring algorithm
  return scoreAndSort(need, candidates);
}

/**
 * Claim a donation for a need:
 * 1. Mark RecipientNeed.status = "matched" and link via matchedDonation
 * 2. Mark Donation.status = "matched" and set matchedNeedId
 * 3. Create a Notification for the recipient
 */
export async function claimMatch(
  needId: string,
  donationId: string
) {
  return prisma.$transaction(async (tx) => {
    // 1) Update the need
    const updatedNeed = await tx.recipientNeed.update({
      where: { id: needId },
      data: {
        status: "matched",
        matchedDonation: { connect: { id: donationId } }, 
      },
    });

    // 2) Update the donation
    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: {
        status: "matched",
        matchedNeedId: needId, 
      },
    });

await tx.notification.create({
  data: {
    userId: updatedNeed.recipientId,
    message: `A donation of ${updatedDonation.quantity} ${updatedDonation.foodType} has been reserved for your need.`,
    meta: {
      needId,
      donationId,
    },
  },
});


    return { updatedNeed, updatedDonation };
  });
}
