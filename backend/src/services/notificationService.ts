// src/services/notificationService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Fetch all notifications for the given user, most recent first.
 */
export async function getNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Mark a single notification as read.
 */
export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readStatus: true },
  });
}
