import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const assignDeliveryStaff = async (
  donationId: string,
  logisticsStaffId: string,
  scheduledDate: string
) => {
  return prisma.delivery.update({
    where: { donationId },
    data: {
      logisticsStaffId,
      scheduledDate: new Date(scheduledDate),
      deliveryStatus: "SCHEDULED",
    },
  });
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: "IN_TRANSIT" | "DELIVERED" | "FAILED" | "CANCELLED"
) => {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      deliveryStatus: status,
      deliveredAt: status === "DELIVERED" ? new Date() : undefined,
    },
  });
};

export const getAllDeliveries = async () => {
  return prisma.delivery.findMany({
    include: {
      donation: true,
      logisticsStaff: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};
