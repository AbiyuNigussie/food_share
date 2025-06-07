// src/controllers/recipientDonationController.ts
import { Request, Response } from "express";
import {
  getMatchedDonationsForRecipient,
  getClaimedDonationsForRecipient,
} from "../services/recipientDonationService";
import { AuthenticatedRequest } from "../types";

export const handleGetMatchedDonations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const recipientId = req.recipientId!;
    const page = parseInt((req.query.page as string) || "1", 10);
    const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

    const data = await getMatchedDonationsForRecipient(recipientId, page, rowsPerPage);
    // (if you want total count as well, you can add a count function)
    res.status(200).json({ data, page, rowsPerPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch matched donations" });
  }
};

export const handleGetClaimedDonations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const recipientId = req.recipientId!;
    const page = parseInt((req.query.page as string) || "1", 10);
    const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

    const data = await getClaimedDonationsForRecipient(recipientId, page, rowsPerPage);
    res.status(200).json({ data, page, rowsPerPage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch claimed donations" });
  }
};
