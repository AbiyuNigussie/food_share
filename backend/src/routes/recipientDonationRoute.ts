import express from "express";
import {
  handleGetMatchedDonations,
  handleGetClaimedDonations,
} from "../controllers/recipientDonationController";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";
import { requireApprovedAndSubscribedRecipient } from "../middlewares/requireApprovedAndSubscribedRecipient";

const DRrouter = express.Router();

DRrouter.get(
  "/recipient/donations/matched",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleGetMatchedDonations
);

DRrouter.get(
  "/recipient/donations/claimed",
  authenticateRecipient,
  requireApprovedAndSubscribedRecipient,
  handleGetClaimedDonations
);

export default DRrouter;
