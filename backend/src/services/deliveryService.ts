import { PrismaClient } from "@prisma/client";
import { DeliveryFilters } from "../types";
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
      deliveryStatus: "ASSIGNED",
    },
  });
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: "IN_PROGRESS" | "DELIVERED" | "FAILED" | "CANCELLED"
) => {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      deliveryStatus: status,
      deliveredAt: status === "DELIVERED" ? new Date() : undefined,
    },
  });
};

export const getAllDeliveries = async (
  filter: DeliveryFilters,
  page: number,
  rowsPerPage: number,
  logisticsStaffId: string
) => {
  const skip = (page - 1) * rowsPerPage;
  const take = rowsPerPage;

  let whereClause: any = {};

  if (filter.status === "PENDING") {
    whereClause.deliveryStatus = "PENDING";
  } else if (filter.status === "INP_POGRESS" || filter.status === "DELIVERED") {
    whereClause = {
      deliveryStatus: filter.status,
      logisticsStaffId,
    };
  } else {
    whereClause = {
      OR: [
        { deliveryStatus: "PENDING" },
        {
          deliveryStatus: { in: ["IN_PROGRESS", "DELIVERED"] },
          logisticsStaffId,
        },
      ],
    };
  }

  const [deliveries, total] = await Promise.all([
    prisma.delivery.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        pickupLocation: true,
        dropoffLocation: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.delivery.count({
      where: whereClause,
    }),
  ]);

  return {
    data: deliveries,
    total,
    page,
    rowsPerPage,
  };
};

export const getDeliveryById = async (deliveryId: string) => {
  return prisma.delivery.findUnique({
    where: { id: deliveryId },
    include: {
      donation: {
        include: {
          donor: {
            include: { user: true },
          },
          recipient: {
            include: { user: true },
          },
        },
      },
      logisticsStaff: {
        include: { user: true },
      },
      pickupLocation: true,
      dropoffLocation: true,
    },
  });
};
