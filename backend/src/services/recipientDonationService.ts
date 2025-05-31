// src/services/user/recipientDonationService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 1) Matched Donations (accepted via notification):
 *    A donation that has matchedNeedId pointing at a need
 *    whose recipientId = this user, AND that need’s status = "matched".
 */
export async function getMatchedDonationsForRecipient(
  recipientId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.donation.findMany({
    where: {
      matchedNeed: {
        recipientId: recipientId,
      },
      status: "matched",
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    include: {
      donor: {
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      matchedNeed: {
        select: { id: true, foodType: true, quantity: true },
      },
    },
  });
}

/**
 * 2) Claimed Donations:
 *    A donation whose recipientId = this recipient’s userId,
 *    and status = "claimed".
 *
 *    (Originally you attempted to filter on `claimedById`, but the schema
 *     actually uses `recipientId` for “who claimed” a donation.)
 */
export async function getClaimedDonationsForRecipient(
  recipientId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.donation.findMany({
    where: {
      recipientId: recipientId,    // ← use recipientId, not claimedById
      status: "claimed",
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    include: {
      donor: {
        include: {
          user: {
            select: { firstName: true, lastName: true },
          },
        },
      },
      delivery: true,  // include the delivery record if you need its status
    },
  });
}
