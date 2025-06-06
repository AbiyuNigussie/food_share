import express from "express";
import {
  handleAssignDeliveryStaff,
  handleUpdateDeliveryStatus,
  handleGetAllDeliveries,
  handleGetDeliveryById,
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

export default router;
