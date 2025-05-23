import express from "express";
import {
  handleCreateDonation,
  handleGetAllDonations,
  handleDeleteDonation,
  handleGetFilteredDonations,
} from "../controllers/donationController";
import { authenticateDonor } from "../middlewares/authenticateDonor";

const router = express.Router();

router.get("/donations", handleGetAllDonations);
router.post("/donations", authenticateDonor, handleCreateDonation);
router.delete("/donations/:id", authenticateDonor, handleDeleteDonation);
router.get("/donations/filtered", handleGetFilteredDonations);

export default router;
