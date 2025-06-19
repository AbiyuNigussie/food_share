import express from "express";
import {
  handleGetDonorMatched,
  handleGetDonorClaimed,
} from "../controllers/donorDonationController";
import { authenticateDonor } from "../middlewares/authenticateDonor";

const Drouter = express.Router();

Drouter.get(
  "/donations/matched",
  authenticateDonor,
  handleGetDonorMatched
);
Drouter.get(
  "/donations/claimed",
  authenticateDonor,
  handleGetDonorClaimed
);

export default Drouter;
