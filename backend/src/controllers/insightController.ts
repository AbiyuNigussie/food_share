// src/controllers/insightsController.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import {
  getDonorInsights,
  getRecipientInsights,
} from "../services/insightService";

export async function handleGetDonorInsights(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const donorId = req.donorId!;
    const data = await getDonorInsights(donorId);
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load donor insights" });
  }
}

export async function handleGetRecipientInsights(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const recipientId = req.recipientId!;
    const year = new Date().getFullYear();
    const data = await getRecipientInsights(recipientId, year);
    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load recipient insights" });
  }
}
