import { Request, Response } from "express";
import { getDonationReports } from "../../services/admin/reportService";

export const getDonationReportController = async (
  req: Request,
  res: Response
) => {
  try {
    const reports = await getDonationReports();
    res.status(200).json({
      success: true,
      message: "Donation reports retrieved successfully",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching donation reports:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch donation reports",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
