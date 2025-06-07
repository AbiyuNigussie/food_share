import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/authenticateAnyUser";
import {
  getNotificationsForUser,
  markNotificationRead,
} from "../services/notificationService";

export async function handleGetNotifications(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const userId =
      req.recipientId ?? req.donorId ?? req.logisticsStaffId!;
    const data = await getNotificationsForUser(userId);
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

export async function handleMarkNotificationRead(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const updated = await markNotificationRead(req.params.id);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark notification read" });
  }
}
