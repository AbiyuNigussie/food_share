import { NextFunction, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../types";

const prisma = new PrismaClient();

// Middleware to ensure recipient is approved and subscribed
export const requireApprovedAndSubscribedRecipient = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const check = async () => {
    try {
      const recipientId = req.recipientId;
      if (!recipientId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const recipient = await prisma.recipient.findUnique({
        where: { userId: recipientId },
        select: { isApproved: true, subscriptionStatus: true },
      });
      if (!recipient) {
        res.status(404).json({ message: "Recipient not found" });
        return;
      }
      if (!recipient.isApproved) {
        res
          .status(403)
          .json({ message: "Your registration is pending admin approval." });
        return;
      }
      if (recipient.subscriptionStatus !== "active") {
        res.status(403).json({
          message:
            "You must have an active subscription to access this resource.",
        });
        return;
      }
      next();
    } catch (err) {
      console.error("Recipient access check error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  check();
};
