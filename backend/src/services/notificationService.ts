import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/email"; // Adjust the path if needed

const prisma = new PrismaClient();

export async function getNotificationsForUser(userId: string) {
  return prisma.notification.findMany({
    where: { userId, readStatus: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function markNotificationRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { readStatus: true },
  });
}

// Create notification and send email (with optional meta)
export async function createNotificationAndEmail(
  userId: string,
  message: string,
  meta?: any
) {
  // Create notification in DB
  const notification = await prisma.notification.create({
    data: {
      userId,
      message,
      readStatus: false,
      ...(meta && { meta }),
    },
  });

  // Fetch user email and send email notification
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.email) {
      await sendEmail({
        to: user.email,
        subject: "New Notification from Food Share",
        html: `<p>${message}</p>`,
      });
    }
  } catch (err) {
    // Log error but don't block notification creation
    console.error("Failed to send notification email:", err);
  }

  return notification;
}
