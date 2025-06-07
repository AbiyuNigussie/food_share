import express from "express";
import {
  handleGetMatchedDonations,
  handleGetClaimedDonations,
} from "../controllers/recipientDonationController";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const DRrouter = express.Router();

DRrouter.get("/recipient/donations/matched", authenticateRecipient, handleGetMatchedDonations);

DRrouter.get("/recipient/donations/claimed", authenticateRecipient, handleGetClaimedDonations);

export default DRrouter;
