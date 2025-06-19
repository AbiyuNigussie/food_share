import { Request, Response } from "express";
import {
  getMatchedDonationsForDonor,
  getClaimedDonationsForDonor,
  countMatchedDonationsForDonor,
  countClaimedDonationsForDonor,
} from "../services/donorDonationService";
import { AuthenticatedRequest } from "../types";

export async function handleGetDonorMatched(
  req: AuthenticatedRequest,
  res: Response
) {
  const donorId = req.donorId!;
  const page = parseInt((req.query.page as string) || "1", 10);
  const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

  try {
    const [data, total] = await Promise.all([
      getMatchedDonationsForDonor(donorId, page, rowsPerPage),
      countMatchedDonationsForDonor(donorId),
    ]);
    res.json({ data, page, rowsPerPage, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load matched donations" });
  }
}

export async function handleGetDonorClaimed(
  req: AuthenticatedRequest,
  res: Response
) {
  const donorId = req.donorId!;
  const page = parseInt((req.query.page as string) || "1", 10);
  const rowsPerPage = parseInt((req.query.rowsPerPage as string) || "5", 10);

  try {
    const [data, total] = await Promise.all([
      getClaimedDonationsForDonor(donorId, page, rowsPerPage),
      countClaimedDonationsForDonor(donorId),
    ]);
    res.json({ data, page, rowsPerPage, total });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load claimed donations" });
  }
}
