import { Request, Response } from "express";
import {
  assignDeliveryStaff,
  getAllDeliveries,
  updateDeliveryStatus,
} from "../services/deliveryService";
import { AuthenticatedRequest } from "../types";

export const handleAssignDeliveryStaff = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { donationId, scheduledDate } = req.body;
    const logisticsStaffId = req.logisticsStaffId;

    if (!logisticsStaffId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    } else {
      const delivery = await assignDeliveryStaff(
        donationId,
        logisticsStaffId,
        scheduledDate
      );
      res.status(201).json(delivery);
    }
  } catch (error) {
    console.error("Error assigning delivery staff:", error);
    res.status(500).json({ message: "Failed to assign delivery staff" });
  }
};

export const handleUpdateDeliveryStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const { status } = req.body;

    const updatedDelivery = await updateDeliveryStatus(deliveryId, status);
    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Error updating delivery status:", error);
    res.status(500).json({ message: "Failed to update delivery status" });
  }
};

export const handleGetAllDeliveries = async (req: Request, res: Response) => {
  try {
    const deliveries = await getAllDeliveries();
    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Failed to get deliveries" });
  }
};
