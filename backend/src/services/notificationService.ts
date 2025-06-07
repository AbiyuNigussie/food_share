import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId, readStatus: false,},
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readStatus: true },
  });
}
