import express from "express";
import {
  handleAssignDeliveryStaff,
  handleUpdateDeliveryStatus,
  handleGetAllDeliveries,
  handleGetDeliveryById,
  handleSetDeliverySchedule,
  handleAddTimelineEvent,
  handleSchedulePickup,
  handleCompletePickup,
  handleScheduleDropoff,
  handleCompleteDropoff,
  handleCompleteDelivery,
} from "../controllers/deliveryControlller";
import { authenticateUser } from "../middlewares/authenticateAnyUser";

const router = express.Router();

router.get("/deliveries", authenticateUser, handleGetAllDeliveries);

router.get(
  "/deliveries/:deliveryId",
  authenticateUser,
  handleGetDeliveryById
);

router.post(
  "/deliveries/assign",
  authenticateUser,
  handleAssignDeliveryStaff
);

router.patch(
  "/deliveries/:deliveryId/status",
  authenticateUser,
  handleUpdateDeliveryStatus
);

router.post(
  "/deliveries/schedule",
  authenticateUser,
  handleSetDeliverySchedule
);

router.post(
  "/deliveries/timeline",
  authenticateUser,
  handleAddTimelineEvent
);

router.post(
  "/deliveries/:deliveryId/schedule-pickup",
  authenticateUser,
  handleSchedulePickup
);

router.post(
  "/deliveries/:deliveryId/complete-pickup",
  authenticateUser,
  handleCompletePickup
);

router.post(
  "/deliveries/:deliveryId/schedule-dropoff",
  authenticateUser,
  handleScheduleDropoff
);

router.post(
  "/deliveries/:deliveryId/complete-dropoff",
  authenticateUser,
  handleCompleteDropoff
);

router.post(
  "/deliveries/:deliveryId/complete-delivery",
  authenticateUser,
  handleCompleteDelivery
);

export default router;
