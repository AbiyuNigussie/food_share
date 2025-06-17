// src/routes/insights.routes.ts
import express from "express";
import {
  handleGetDonorInsights,
  handleGetRecipientInsights,
} from "../controllers/insightController";
import { authenticateDonor } from "../middlewares/authenticateDonor";
import { authenticateRecipient } from "../middlewares/authenticateRecipient";

const Irouter = express.Router();

Irouter.get("/donor/insights", authenticateDonor, handleGetDonorInsights);
Irouter.get(
  "/recipient/insights",
  authenticateRecipient,
  handleGetRecipientInsights
);

export default Irouter;
