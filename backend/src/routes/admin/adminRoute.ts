// /routes/admin/adminRoute.ts
import express from "express";
import userRoute from "./userRoute"; // import userRoute inside here
import { ro } from "@faker-js/faker/.";
import { getDonationReportController } from "../../controllers/admin/reportController";

const router = express.Router();

// mount other admin-related routes here
router.use("/users", userRoute); // now handled as /api/admin/users
router.get("/report/donations", getDonationReportController);
export default router;
