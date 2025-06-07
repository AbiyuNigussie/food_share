// src/controllers/recipientNeedController.ts

import { Request, Response } from "express";
import {
  createNeed,
  getAllNeeds,
  getNeedsCount,
  deleteNeedById,
  updateNeed,
  findMatchesForNeed,
  claimMatch,
} from "../services/recipientNeedService";
import { AuthenticatedRequest } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleCreateNeed = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const recipientId = req.recipientId;
    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { foodType, quantity, dropoffLocation, contactPhone, notes } = req.body;

    // Validate everything is present:
    if (
      !foodType ||
      !quantity ||
      !dropoffLocation ||
      typeof dropoffLocation.label !== "string" ||
      typeof dropoffLocation.latitude !== "number" ||
      typeof dropoffLocation.longitude !== "number" ||
      !contactPhone
    ) {
      res.status(400).json({
        message:
          "Missing or invalid fields. Required: foodType, quantity, dropoffLocation {label, latitude, longitude}, contactPhone.",
      });
      return;
    }

    const need = await createNeed(recipientId, {
      foodType,
      quantity,
      dropoffLocation: {
        label: dropoffLocation.label,
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      },
      contactPhone,
      notes,
    });
    res.status(201).json(need);
  } catch (error) {
    console.error("Error creating need:", error);
    res.status(500).json({ message: "Failed to create need" });
  }
};

export const handleGetAllNeeds = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const recipientId = req.recipientId;
    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const page = parseInt((req.query.page as string) || "1", 10);
    const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

    const data = await getAllNeeds(recipientId, page, rowsPerPage);
    const total = await getNeedsCount(recipientId);

    res.status(200).json({ data, total, page, rowsPerPage });
  } catch (error) {
    console.error("Error fetching needs:", error);
    res.status(500).json({ message: "Failed to fetch needs" });
  }
};

export const handleDeleteNeed = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const recipientId = req.recipientId;
    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;
    await deleteNeedById(recipientId, id);
    res.status(200).json({ message: "Need deleted successfully" });
  } catch (error) {
    console.error("Error deleting need:", error);
    res.status(500).json({ message: "Failed to delete need" });
  }
};

export const handleUpdateNeed = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const recipientId = req.recipientId;
    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id } = req.params;

    // Only allow updating of known fields
    const updateData: any = {};
    if (req.body.foodType !== undefined) updateData.foodType = req.body.foodType;
    if (req.body.quantity  !== undefined) updateData.quantity  = req.body.quantity;
    if (req.body.notes     !== undefined) updateData.notes     = req.body.notes;
    if (req.body.contactPhone !== undefined) updateData.contactPhone = req.body.contactPhone;
    if (req.body.dropoffLocation) {
      const dl = req.body.dropoffLocation;
      if (
        typeof dl.label === "string" &&
        typeof dl.latitude === "number" &&
        typeof dl.longitude === "number"
      ) {
        // Create a new Location row for the updated dropoff address
        const newLoc = await prisma.location.create({
          data: {
            label: dl.label,
            latitude: dl.latitude,
            longitude: dl.longitude,
          },
        });
        updateData.dropoffLocationId = newLoc.id;
      } else {
        res.status(400).json({ message: "Invalid dropoffLocation data" });
        return;
      }
    }

    const result = await updateNeed(recipientId, id, updateData);
    if (result.count === 0) {
      res.status(404).json({ message: "Need not found or not yours" });
      return;
    }
    res.status(200).json({ message: "Need updated successfully" });
  } catch (error) {
    console.error("Error updating need:", error);
    res.status(500).json({ message: "Failed to update need" });
  }
};

export async function handleFindMatchesForNeed(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const needId = req.params.needId;
    const matches = await findMatchesForNeed(needId);
    res.json({ data: matches });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

/**
 * POST /api/matches
 * Body: { needId, donationId }
 * Once a recipient clicks “Accept” on a matching notification,
 * this endpoint reserves the donation, creates a Delivery, etc.
 */
export async function handleClaimMatch(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { needId, donationId } = req.body;
    if (!needId || !donationId) {
      res.status(400).json({ error: "needId and donationId are required" });
      return;
    }
    const result = await claimMatch(needId, donationId, );
    res.json({ data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
