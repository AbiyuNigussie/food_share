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
): Promise<void> => {
  try {
    const donorId = req.donorId;
    if (!donorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const {
      availableFrom,
      availableTo,
      expiryDate,
      foodType,
      quantity,
      location,
      notes,
    } = req.body;

    if (
      !availableFrom ||
      !availableTo ||
      !expiryDate ||
      !foodType ||
      !quantity ||
      !location
    ) {
      res.status(400).json({ message: "Missing required donation fields" });
      return;
    }

    const donation = await createDonation(donorId, {
      availableFrom,
      availableTo,
      expiryDate,
      foodType,
      quantity,
      location,
      notes,
    });
    res.status(201).json(donation);
  } catch (error) {
    console.error("Error creating donation:", error);
    res.status(500).json({ message: "Failed to create donation" });
  }
};

export const handleGetAllDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const rowsPerPage = Number(req.query.rowsPerPage) || 10;

    const donations = await getAllDonations(page, rowsPerPage);
    const total = await getDonationsCount();

    res.status(200).json({
      data: donations,
      total,
      page,
      rowsPerPage,
    });
  } catch (error) {
    console.error("Error fetching all donations:", error);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
};

export const handleGetFilteredDonations = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const rowsPerPage = Number(req.query.rowsPerPage) || 10;
    const foodType = req.query.foodType?.toString();
    const status = req.query.status?.toString();

    const filters = {
      foodType,
      status,
    };

    const donations = await getFilteredDonations(page, rowsPerPage, filters);
    const total = await getFilteredDonationsCount(filters);

    res.status(200).json({
      data: donations,
      total,
      page,
      rowsPerPage,
    });
  } catch (error) {
    console.error("Error fetching filtered donations:", error);
    res.status(500).json({ error: "Failed to fetch filtered donations" });
  }
};

export const handleGetMyDonations = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const donorId = req.donorId;
    if (!donorId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const page = Number(req.query.page) || 1;
    const rowsPerPage = Number(req.query.rowsPerPage) || 10;

    const donations = await getAllDonations(page, rowsPerPage, donorId);
    const total = await getDonationsCount(donorId);

    res.status(200).json({
      data: donations,
      total,
      page,
      rowsPerPage,
    });
  } catch (error) {
    console.error("Error fetching my donations:", error);
    res.status(500).json({ error: "Failed to fetch my donations" });
  }
};

export const handleDeleteDonation = async (
  req: Request,
  res: Response
): Promise<void> => {
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
): Promise<void> => {
  try {
    const donationId = req.params.id;
    const recipientId = req.recipientId;

    if (!recipientId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!donationId || typeof donationId !== "string") {
      res.status(400).json({ message: "Invalid donation ID" });
      return;
    }

    const { dropoffLocation, recipientPhone, deliveryNotes } = req.body;

    if (
      !dropoffLocation ||
      !dropoffLocation.label ||
      typeof dropoffLocation.latitude !== "number" ||
      typeof dropoffLocation.longitude !== "number" ||
      !recipientPhone
    ) {
      res.status(400).json({
        message:
          "Missing or invalid delivery information: dropoffLocation with label, lat, lon and recipientPhone are required",
      });
      return;
    }

    const updatedDonation = await claimDonationById(donationId, recipientId, {
      dropoffLocation: {
        label: dropoffLocation.label,
        latitude: dropoffLocation.latitude,
        longitude: dropoffLocation.longitude,
      },
      recipientPhone,
      deliveryNotes,
    });

    res.status(200).json(updatedDonation);
  } catch (error) {
    console.error("Error claiming donation:", error);
    res.status(500).json({ message: "Failed to claim donation" });
  }
};
