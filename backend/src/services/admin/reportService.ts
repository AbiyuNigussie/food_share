import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDonationReports = async () => {
  return await prisma.donation.findMany({
    include: {
      donor: {
        include: { user: true },
      },
      recipient: {
        include: { user: true },
      },
      delivery: {
        include: {
          logisticsStaff: { include: { user: true } },
          pickupLocation: true,
          dropoffLocation: true,
          timeline: true,
        },
      },
      location: true,
      matchedNeed: {
        include: {
          dropoffLocation: true,
          recipient: { include: { user: true } },
        },
      },
    },
  });
};
