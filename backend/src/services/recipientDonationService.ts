import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMatchedDonationsForRecipient(
  recipientId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.donation.findMany({
    where: {
      matchedNeed: { recipientId },
      status: "matched",
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    include: {
      donor: {
        include: { user: { select: { firstName: true, lastName: true } } },
      },
      matchedNeed: {
        select: { id: true, foodType: true, quantity: true },
      },
      // ↓ add this block ↓
      delivery: {
        include: {
          pickupLocation: true,
          dropoffLocation: true,
        },
      },
    },
  });
}

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
