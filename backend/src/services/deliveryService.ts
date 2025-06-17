import { PrismaClient } from "@prisma/client";
import { DeliveryFilters } from "../types";
const prisma = new PrismaClient();

export const assignDeliveryStaff = async (
  deliveryId: string,
  logisticsStaffId: string
) => {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      logisticsStaffId,
      deliveryStatus: "ASSIGNED",
    },
  });
};

export const updateDeliveryStatus = async (
  deliveryId: string,
  status: string
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
  } else if (
    filter.status === "ASSIGNED" ||
    filter.status === "PICKUP_SCHEDULED"
  ) {
    whereClause = {
      deliveryStatus: filter.status,
      logisticsStaffId,
    };
  } else {
    whereClause = {
      OR: [
        { deliveryStatus: "PENDING" },
        {
          deliveryStatus: {
            in: [
              "ASSIGNED",
              "PICKUP_SCHEDULED",
              "PICKED_UP",
              "DROPOFF_SCHEDULED",
              "DROPPED_OFF",
            ],
          },
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
      timeline: true,
    },
  });
};

export const setDeliverySchedule = async (
  deliveryId: string,
  scheduledPickup: string | null,
  scheduledDropoff: string | null
) => {
  return prisma.delivery.update({
    where: { id: deliveryId },
    data: {
      ...(scheduledPickup && {
        scheduledPickup: new Date(scheduledPickup),
        deliveryStatus: "PICKUP_SCHEDULED",
      }),
      ...(scheduledDropoff && {
        scheduledDropoff: new Date(scheduledDropoff),
        deliveryStatus: "DROPOFF_SCHEDULED",
      }),
    },
  });
};

export const addDeliveryTimelineEvent = async (
  deliveryId: string,
  status: string,
  note?: string
) => {
  return prisma.deliveryTimeline.create({
    data: {
      deliveryId,
      status,
      note,
    },
  });
};
