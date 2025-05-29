// src/routes/notification.routes.ts
import express from "express";
import {
  handleGetNotifications,
  handleMarkNotificationRead,
} from "../controllers/notification";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const Notrouter = express.Router();

// GET  /api/notifications
Notrouter.get(
  "/notifications",
  authenticateRecipient,
  handleGetNotifications
);

// PUT  /api/notifications/:id/read
Notrouter.put(
  "/notifications/:id/read",
  authenticateRecipient,
  handleMarkNotificationRead
);

export default Notrouter;
