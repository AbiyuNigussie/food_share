import express from "express";
import {
  handleCreateDonation,
  handleGetAllDonations,
  handleDeleteDonation,
  handleGetFilteredDonations,
  handleClaimDonation,
  handleGetMyDonations,
} from "../controllers/donationController";
import { authenticateDonor } from "../middlewares/authenticateDonor";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";
import { authenticateUser } from "../middlewares/authenticateAnyUser";

const router = express.Router();

router.get("/donations", handleGetAllDonations);
router.post("/donations", authenticateDonor, handleCreateDonation);
router.delete("/donations/:id", authenticateDonor, handleDeleteDonation);
router.get("/donations/filtered", authenticateUser, handleGetFilteredDonations);
router.post("/donations/:id/claim", authenticateRecipient, handleClaimDonation);
router.get("/donations/my", authenticateDonor, handleGetMyDonations);
export default router;
