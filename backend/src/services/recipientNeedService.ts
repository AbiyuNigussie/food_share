// src/services/user/recipientNeedService.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Create a new need for a recipient.
 */
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

/**
 * Retrieve a paginated list of needs for a recipient.
 */
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

/**
 * Count total needs for pagination.
 */
export const getNeedsCount = async (recipientId: string) => {
  return prisma.recipientNeed.count({
    where: { recipientId },
  });
};

/**
 * Delete a need (only if it belongs to this recipient).
 */
export const deleteNeedById = async (
  recipientId: string,
  needId: string
) => {
  return prisma.recipientNeed.deleteMany({
    where: { id: needId, recipientId },
  });
};

/**
 * Update an existing need (only if it belongs to this recipient).
 */
// ── at bottom of src/services/user/recipientNeedService.ts ──
/**
 * Update an existing need (only if it belongs to this recipient).
 * We update *only* the text fields here, not status.
 */
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

