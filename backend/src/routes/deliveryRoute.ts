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
import { authenticateLogisticsStaff } from "../middlewares/authenticateLogisticsStaff";

const router = express.Router();

router.get("/deliveries", authenticateLogisticsStaff, handleGetAllDeliveries);

router.get(
  "/deliveries/:deliveryId",
  authenticateLogisticsStaff,
  handleGetDeliveryById
);

router.post(
  "/deliveries/assign",
  authenticateLogisticsStaff,
  handleAssignDeliveryStaff
);

router.patch(
  "/deliveries/:deliveryId/status",
  authenticateLogisticsStaff,
  handleUpdateDeliveryStatus
);

router.post(
  "/deliveries/schedule",
  authenticateLogisticsStaff,
  handleSetDeliverySchedule
);

router.post(
  "/deliveries/timeline",
  authenticateLogisticsStaff,
  handleAddTimelineEvent
);

router.post(
  "/deliveries/:deliveryId/schedule-pickup",
  authenticateLogisticsStaff,
  handleSchedulePickup
);

router.post(
  "/deliveries/:deliveryId/complete-pickup",
  authenticateLogisticsStaff,
  handleCompletePickup
);

router.post(
  "/deliveries/:deliveryId/schedule-dropoff",
  authenticateLogisticsStaff,
  handleScheduleDropoff
);

router.post(
  "/deliveries/:deliveryId/complete-dropoff",
  authenticateLogisticsStaff,
  handleCompleteDropoff
);

router.post(
  "/deliveries/:deliveryId/complete-delivery",
  authenticateLogisticsStaff,
  handleCompleteDelivery
);

export default router;
