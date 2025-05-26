import { Request, Response } from "express";
import {
  createDonation,
  getAllDonations,
  deleteDonationById,
  getDonationsCount,
  getFilteredDonations,
  getFilteredDonationsCount,
  claimDonationById,
} from "../services/donationService";
import { AuthenticatedRequest } from "../types";

export const handleCreateDonation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const donorId = req.donorId;

    if (!donorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
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
    const { page, rowsPerPage } = req.query;
    const donations = await getAllDonations(Number(page), Number(rowsPerPage));
    const total = await getDonationsCount();

    res.status(200).json({
      data: donations,
      total,
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const handleGetFilteredDonations = async (
  req: Request,
  res: Response
) => {
  try {
    const { page = "0", rowsPerPage = "10", foodType, status } = req.query;

    const filters = {
      foodType: foodType?.toString(),
      status: status?.toString(),
    };

    const donations = await getFilteredDonations(
      Number(page),
      Number(rowsPerPage),
      filters
    );

    const total = await getFilteredDonationsCount(filters);

    res.status(200).json({
      data: donations,
      total,
      page: Number(page),
      rowsPerPage: Number(rowsPerPage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch filtered donations" });
  }
};

export const handleDeleteDonation = async (req: Request, res: Response) => {
  try {
    const donationId = req.params.id;

    if (!donationId || typeof donationId !== "string") {
      res.status(400).json({ message: "Invalid donation ID" });
      return;
    }

    await deleteDonationById(donationId);
    res.status(200).json({ message: "Donation deleted successfully" });
  } catch (error) {
    console.error("Error deleting donation:", error);
    res.status(500).json({ message: "Failed to delete donation" });
  }
};

export const handleClaimDonation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const donationId = req.params.id;
    const recipientId = req.recipientId;

    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { dropoffLocation, recipientPhone, deliveryNotes } = req.body;

    if (!dropoffLocation || !recipientPhone) {
      res.status(400).json({
        message: "Missing required delivery information",
      });
      return;
    }

    const updatedDonation = await claimDonationById(donationId, recipientId, {
      dropoffLocation,
      recipientPhone,
      deliveryNotes,
    });

    res.status(200).json(updatedDonation);
  } catch (error) {
    console.error("Error claiming donation:", error);
    res.status(500).json({ message: "Failed to claim donation" });
  }
};
