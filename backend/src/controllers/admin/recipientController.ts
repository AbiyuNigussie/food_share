import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../../utils/CustomError";

const prisma = new PrismaClient();

// List all pending recipients
import { RequestHandler } from "express";
import sendEmail from "../../utils/email";

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
      include: { user: true }, // get user's email
    });

    await sendEmail({
      to: updated.user.email,
      subject: "Your Food Share Application Has Been Approved",
      html: `<p>Dear ${updated.user.firstName || "User"},</p>
             <p>We are happy to inform you that your application as a recipient on Food Share has been <strong>approved</strong>.</p>
             <p>You can now log in and start receiving donations.</p>
             <p>Best regards,<br/>Food Share Team</p>`,
    });

    res.status(200).json({ message: "Recipient approved", recipient: updated });
  } catch (error) {
    res.status(400).json({ message: "Failed to approve recipient" });
  }
};

export const rejectRecipient: RequestHandler = async (req, res) => {
  const { userId } = req.params;
  try {
    // Get user email before deletion
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new CustomError("User not found", 404);

    await prisma.recipient.delete({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

    await sendEmail({
      to: user.email,
      subject: "Your Food Share Application Has Been Rejected",
      html: `<p>Dear ${user.firstName || "User"},</p>
             <p>We regret to inform you that your application as a recipient on Food Share has been <strong>rejected</strong>.</p>
             <p>If you believe this was a mistake or would like more information, please contact our support team.</p>
             <p>Best regards,<br/>Food Share Team</p>`,
    });

    res.status(200).json({ message: "Recipient rejected and deleted" });
  } catch (error) {
    res.status(400).json({ message: "Failed to reject recipient" });
  }
};
