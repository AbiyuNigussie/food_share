import { Request, Response } from "express";
import { updateUserProfile, changeUserPassword } from "../services/settingService";
import { AuthenticatedRequest } from "../types";

export async function handleUpdateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.recipientId ?? req.donorId ?? req.logisticsStaffId!;
    const { firstName, lastName, email, phoneNumber } = req.body;
    const updated = await updateUserProfile(userId, { firstName, lastName, email, phoneNumber });
    res.status(200).json({ data: updated });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
}

export async function handleChangePassword(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  try {
    const userId =
      req.recipientId ?? req.donorId ?? req.logisticsStaffId!;
    const { currentPassword, newPassword } = req.body;

    await changeUserPassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password changed" });
  } catch (err: any) {
    console.error(err);
    if (err.code === "INCORRECT_PASSWORD") {
      res.status(400).json({ message: "Current password is incorrect" });
      return;             // <-- just return void here, not the res
    }
    res.status(500).json({ message: "Failed to change password" });
  }
}
