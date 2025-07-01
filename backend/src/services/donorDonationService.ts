// src/services/donorDonationService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getMatchedDonationsForDonor(
  donorId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.donation.findMany({
    where: { donorId, status: "matched" },
    orderBy: { createdAt: "desc" },
    skip:  (page - 1) * rowsPerPage,
    take:  rowsPerPage,
    include: {
      recipient: {
        select: {
          user: {
            select: { firstName: true, lastName: true }
          },
          organization: true        // ← pull in your organization scalar here
        }
      },
      delivery: {
        include: {
          pickupLocation: true,
          dropoffLocation: true
        }
      }
    },
  });
}

export async function getClaimedDonationsForDonor(
  donorId: string,
  page: number,
  rowsPerPage: number
) {
  return prisma.donation.findMany({
    where: { donorId, status: "claimed" },
    orderBy: { createdAt: "desc" },
    skip:  (page - 1) * rowsPerPage,
    take:  rowsPerPage,
    include: {
      recipient: {
        select: {
          user: {
            select: { firstName: true, lastName: true }
          },
          organization: true        // ← organization here too
        }
      },
      delivery: {
        include: {
          pickupLocation: true,
          dropoffLocation: true
        }
      }
    },
  });
}


export async function countMatchedDonationsForDonor(donorId: string) {
  return prisma.donation.count({ where: { donorId, status: "matched" } });
}

export async function countClaimedDonationsForDonor(donorId: string) {
  return prisma.donation.count({ where: { donorId, status: "claimed" } });
}
