import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export const createNeed = async (
  recipientId: string,
  data: {
    foodType: string;
    quantity: string;
    pickupAddress: string;
    notes?: string;
  }
) => {
  return prisma.recipientNeed.create({
    data: {
      recipientId,
      foodType: data.foodType,
      quantity: data.quantity,
      pickupAddress: data.pickupAddress,
      notes: data.notes,
    },
  });
};


export const getAllNeeds = async (
  recipientId: string,
  page: number,
  rowsPerPage: number
) => {
  return prisma.recipientNeed.findMany({
    where: { recipientId },
    orderBy: { requestedAt: "desc" },
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  });
};


export const getNeedsCount = async (recipientId: string) => {
  return prisma.recipientNeed.count({
    where: { recipientId },
  });
};

export const deleteNeedById = async (
  recipientId: string,
  needId: string
) => {
  return prisma.recipientNeed.deleteMany({
    where: { id: needId, recipientId },
  });
};

export const updateNeed = async (
  recipientId: string,
  needId: string,
  data: {
    foodType?: string;
    quantity?: string;
    pickupAddress?: string;
    notes?: string;
  }
) => {
  return prisma.recipientNeed.updateMany({
    where: { id: needId, recipientId },
    data, // now contains only fields Prisma expects
  });
};

