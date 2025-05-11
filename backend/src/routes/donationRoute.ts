import express from "express";
import {
  handleCreateDonation,
  handleGetAllDonations,
} from "../controllers/donationController";
import { authenticateDonor } from "../middlewares/authenticateDonor";

const router = express.Router();

router.get("/donations", handleGetAllDonations);
router.post("/donations", authenticateDonor, handleCreateDonation);

export default router;
