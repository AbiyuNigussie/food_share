// src/routes/notification.routes.ts
import express from "express";
import {
  handleGetNotifications,
  handleMarkNotificationRead,
} from "../controllers/notification";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";
import { authenticateUser } from "../middlewares/authenticateAnyUser";

const Notrouter = express.Router();

// GET  /api/notifications
Notrouter.get(
  "/notifications",
  authenticateUser,
  handleGetNotifications
);

// PUT  /api/notifications/:id/read
Notrouter.put(
  "/notifications/:id/read",
  authenticateUser,
  handleMarkNotificationRead
);

export default Notrouter;
