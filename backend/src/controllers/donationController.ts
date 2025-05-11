import { Request, Response } from "express";
import { createDonation, getAllDonations } from "../services/donationService";
import { AuthenticatedRequest } from "../types";

export const handleCreateDonation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const donorId = req.donorId;

    if (!donorId) {
      res.status(401).json({ message: "Unauthorized" });
    } else {
      const donation = await createDonation(donorId, req.body);
      res.status(201).json(donation);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create donation" });
  }
};

export const handleGetAllDonations = async (req: Request, res: Response) => {
  try {
    const { page = 1, rowsPerPage = 5 } = req.query;
    const donations = await getAllDonations(Number(page), Number(rowsPerPage));
    res.status(200).json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};
