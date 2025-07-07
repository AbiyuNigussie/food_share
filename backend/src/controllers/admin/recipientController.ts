import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../../utils/CustomError";

const prisma = new PrismaClient();

// List all pending recipients
import { RequestHandler } from "express";

export const listPendingRecipients: RequestHandler = async (req, res) => {
  try {
    const recipients = await prisma.recipient.findMany({
      where: { isApproved: false },
      include: { user: true },
    });
    res.status(200).json(recipients);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recipients" });
  }
};

// Approve a recipient
export const approveRecipient: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    const updated = await prisma.recipient.update({
      where: { userId },
      data: { isApproved: true },
    });
    res.status(200).json({ message: "Recipient approved", recipient: updated });
  } catch (error) {
    res.status(400).json({ message: "Failed to approve recipient" });
  }
};

// Reject (delete) a recipient
export const rejectRecipient: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    // Delete recipient and user
    await prisma.recipient.delete({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.status(200).json({ message: "Recipient rejected and deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to reject recipient" });
  }
};
