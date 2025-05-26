import express from "express";
import {
  handleCreateDonation,
  handleGetAllDonations,
  handleDeleteDonation,
  handleGetFilteredDonations,
  handleClaimDonation,
} from "../controllers/donationController";
import { authenticateDonor } from "../middlewares/authenticateDonor";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const router = express.Router();

router.get("/donations", handleGetAllDonations);
router.post("/donations", authenticateDonor, handleCreateDonation);
router.delete("/donations/:id", authenticateDonor, handleDeleteDonation);
router.get("/donations/filtered", handleGetFilteredDonations);
router.post("/donations/:id/claim", authenticateRecipient, handleClaimDonation);
export default router;
