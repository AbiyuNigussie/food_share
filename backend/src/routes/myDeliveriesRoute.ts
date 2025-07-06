// src/routes/myDeliveries.routes.ts
import express from "express";
import { handleGetDeliveredHistory } from "../controllers/myDeliveriesController";
import { authenticateLogisticsStaff } from "../middlewares/authenticateLogisticsStaff";

const MDrouter = express.Router();

// GET /api/my/deliveries?status=PENDING&status=IN_PROGRESS&page=1&rowsPerPage=8
MDrouter.get(
  "/deliveries",
  authenticateLogisticsStaff,
  handleGetDeliveredHistory
);

export default MDrouter;
