import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import { getDeliveredHistory } from "../services/myDeliveriesService";

export const handleGetDeliveredHistory = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const staffId = req.logisticsStaffId!;
    const page = parseInt((req.query.page as string) || "1", 10);
    const rows = parseInt((req.query.rowsPerPage as string) || "8", 10);

    const result = await getDeliveredHistory(staffId, page, rows);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch delivery history" });
  }
};
