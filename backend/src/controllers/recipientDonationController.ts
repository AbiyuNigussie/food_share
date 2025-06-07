import { Request, Response } from "express";
import {
  getMatchedDonationsForRecipient,
  getClaimedDonationsForRecipient,
} from "../services/recipientDonationService";
import { AuthenticatedRequest } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleGetMatchedDonations = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const recipientId = req.recipientId!;
    const page = parseInt((req.query.page as string) || "1", 10);
    const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

    // 1) Fetch the paginated data
    const data = await getMatchedDonationsForRecipient(recipientId, page, rowsPerPage);

    // 2) Count total matching records
    const total = await prisma.donation.count({
      where: {
        matchedNeed: {
          recipientId: recipientId,
        },
        status: "matched",
      },
    });

    res.status(200).json({
      data,
      total,
      page,
      rowsPerPage,
    });
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

    // 1) Fetch the paginated data
    const data = await getClaimedDonationsForRecipient(recipientId, page, rowsPerPage);

    // 2) Count total matching records
    const total = await prisma.donation.count({
      where: {
        recipientId: recipientId,
        status: "claimed",
      },
    });

    res.status(200).json({
      data,
      total,
      page,
      rowsPerPage,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch claimed donations" });
  }
};
