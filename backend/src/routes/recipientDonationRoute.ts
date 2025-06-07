// src/routes/recipientDonation.routes.ts
import express from "express";
import {
  handleGetMatchedDonations,
  handleGetClaimedDonations,
} from "../controllers/recipientDonationController";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const DRrouter = express.Router();

// GET /api/recipient/donations/matched?page=1&rowsPerPage=5
DRrouter.get("/recipient/donations/matched", authenticateRecipient, handleGetMatchedDonations);

// GET /api/recipient/donations/claimed?page=1&rowsPerPage=5
DRrouter.get("/recipient/donations/claimed", authenticateRecipient, handleGetClaimedDonations);

export default DRrouter;
