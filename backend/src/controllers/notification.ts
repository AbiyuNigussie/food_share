// src/controllers/notificationController.ts
import { Request, Response } from "express";
import {
  getNotificationsForUser,
  markNotificationRead,
} from "../services/notificationService";
import { AuthenticatedRequest } from "../types";

/**
 * GET /api/notifications
 * Fetch all notifications for the logged-in user.
 */
export async function handleGetNotifications(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    // Use whichever ID is set (donor or recipient)
    const userId = req.recipientId ?? req.donorId!;
    const data = await getNotificationsForUser(userId);
    res.status(200).json({ data });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
}

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read.
 */
export async function handleMarkNotificationRead(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const updated = await markNotificationRead(req.params.id);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("Error marking notification read:", err);
    res.status(500).json({ message: "Failed to mark notification read" });
  }
}
