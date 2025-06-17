import { Request, Response } from "express";
import {
  assignDeliveryStaff,
  getAllDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  setDeliverySchedule,
  addDeliveryTimelineEvent,
} from "../services/deliveryService";
import { AuthenticatedRequest } from "../types";

export const handleAssignDeliveryStaff = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.body;
    const logisticsStaffId = req.logisticsStaffId;

    if (!logisticsStaffId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    } else {
      const delivery = await assignDeliveryStaff(deliveryId, logisticsStaffId);
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
      { status: status as "PENDING" | "ASSIGNED" | "PICKUP_SCHEDULED" },
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

export const handleSetDeliverySchedule = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId, scheduledPickup, scheduledDropoff } = req.body;
    const delivery = await setDeliverySchedule(
      deliveryId,
      scheduledPickup,
      scheduledDropoff
    );
    // Optionally add a timeline event
    await addDeliveryTimelineEvent(
      deliveryId,
      "SCHEDULED",
      "Pickup and dropoff scheduled"
    );
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to set schedule" });
  }
};

export const handleAddTimelineEvent = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId, status, note } = req.body;
    const event = await addDeliveryTimelineEvent(deliveryId, status, note);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Failed to add timeline event" });
  }
};

export const handleSchedulePickup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const { datetime } = req.body;
    const delivery = await setDeliverySchedule(deliveryId, datetime, null);
    await addDeliveryTimelineEvent(
      deliveryId,
      "PICKUP_SCHEDULED",
      "Pickup scheduled"
    );
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule pickup" });
  }
};

export const handleCompletePickup = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await updateDeliveryStatus(deliveryId, "PICKED_UP");
    await addDeliveryTimelineEvent(deliveryId, "PICKED_UP", "Pickup completed");
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to complete pickup" });
  }
};

export const handleScheduleDropoff = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const { datetime } = req.body;
    const delivery = await setDeliverySchedule(deliveryId, null, datetime);
    await addDeliveryTimelineEvent(
      deliveryId,
      "DROPOFF_SCHEDULED",
      "Dropoff scheduled"
    );
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to schedule dropoff" });
  }
};

export const handleCompleteDropoff = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await updateDeliveryStatus(deliveryId, "DROPPED_OFF");
    await addDeliveryTimelineEvent(
      deliveryId,
      "DROPPED_OFF",
      "Dropoff completed"
    );
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to complete dropoff" });
  }
};

export const handleCompleteDelivery = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { deliveryId } = req.params;
    const delivery = await updateDeliveryStatus(deliveryId, "DELIVERED");
    await addDeliveryTimelineEvent(
      deliveryId,
      "DELIVERED",
      "Delivery completed"
    );
    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: "Failed to complete delivery" });
  }
};
