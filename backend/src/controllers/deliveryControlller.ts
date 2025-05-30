import { Request, Response } from "express";
import {
  assignDeliveryStaff,
  getAllDeliveries,
  getDeliveryById,
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

export const handleGetAllDeliveries = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { status, page = "1", rowsPerPage = "10" } = req.query;

    const logisticsStaffId = req.logisticsStaffId;
    if (!logisticsStaffId) {
      res.status(401).json({ message: "Unauthorized: missing user ID" });
      return;
    }

    const deliveries = await getAllDeliveries(
      { status: status as "PENDING" | "IN_PROGRESS" | "DELIVERED" },
      parseInt(page as string, 10),
      parseInt(rowsPerPage as string, 10),
      logisticsStaffId
    );

    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    res.status(500).json({ message: "Failed to get deliveries" });
  }
};

export const handleGetDeliveryById = async (req: Request, res: Response) => {
  try {
    const { deliveryId } = req.params;

    const delivery = await getDeliveryById(deliveryId);

    if (!delivery) {
      res.status(404).json({ message: "Delivery not found" });
      return;
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Error fetching delivery by ID:", error);
    res.status(500).json({ message: "Failed to get delivery details" });
  }
};
