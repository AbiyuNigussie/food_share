// src/services/myDeliveriesService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface DeliveredHistoryRow {
  id: string;
  deliveredAt: Date;
  deliveryStatus: string;
  donation: {
    quantity: number;
    donor: {
      user: { firstName: string; lastName: string };
    };
    recipient: {
      user: { firstName: string; lastName: string };
    } | null;
  };
  pickupLocation: { label: string } | null;
  dropoffLocation: { label: string } | null;
}

export async function getDeliveredHistory(
  logisticsStaffId: string,
  page: number,
  rowsPerPage: number
): Promise<{ data: DeliveredHistoryRow[]; total: number }> {
  const skip = (page - 1) * rowsPerPage;

  // count total delivered
  const total = await prisma.delivery.count({
    where: {
      logisticsStaffId,
      deliveryStatus: "DELIVERED",
    },
  });

  // fetch page
  const data = await prisma.delivery.findMany({
    where: {
      logisticsStaffId,
      deliveryStatus: "DELIVERED",
    },
    orderBy: { updatedAt: "desc" },
    skip,
    take: rowsPerPage,
    select: {
      id: true,
      updatedAt: true,            // we'll use this as "Delivered At"
      deliveryStatus: true,
      pickupLocation: { select: { label: true } },
      dropoffLocation: { select: { label: true } },
      donation: {
        select: {
          quantity: true,
          donor: {
            select: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
          recipient: {
            select: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      },
    },
  });

  // rename updatedAt → deliveredAt
const rows: DeliveredHistoryRow[] = data.map((d) => ({
  id: d.id,
  deliveredAt: d.updatedAt,
  deliveryStatus: d.deliveryStatus,
  pickupLocation: d.pickupLocation,
  dropoffLocation: d.dropoffLocation,
  donation: {
    ...d.donation,
    // parse it into a number (or 0 if parse fails)
    quantity: Number(d.donation.quantity) || 0,
  },
}));

  return { data: rows, total };
}
