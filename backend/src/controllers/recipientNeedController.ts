// src/controllers/user/recipientNeedController.ts
import { Response } from "express";
import {
  createNeed,
  getAllNeeds,
  getNeedsCount,
  deleteNeedById,
  updateNeed,
  findMatchesForNeed,
  claimMatch,
} from "../services/recipientNeedService";
import { AuthenticatedRequest } from "../types"; // your custom interface

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
    const need = await createNeed(recipientId, req.body);
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
    const rowsPerPage = parseInt(
      (req.query.rowsPerPage as string) || "5",
      10
    );

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
    const result = await updateNeed(recipientId, id, req.body);
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
 * Claims the given donation for the given need.
 */
export async function handleClaimMatch(
  req: AuthenticatedRequest,
  res: Response
) {
  try {
    const { needId, donationId } = req.body;
    const result = await claimMatch(needId, donationId);
    res.json({ data: result });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
