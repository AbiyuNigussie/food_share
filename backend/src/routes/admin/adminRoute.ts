// /routes/admin/adminRoute.ts
import express from "express";
import userRoute from "./userRoute"; // import userRoute inside here
import recipientRoute from "./recipientRoute"; // import recipientRoute for admin recipient approval endpoints
import { ro } from "@faker-js/faker/.";
import { getDonationReportController } from "../../controllers/admin/reportController";

const router = express.Router();

// mount other admin-related routes here
router.use("/users", userRoute); // now handled as /api/admin/users
router.use("/recipients", recipientRoute); // handled as /api/admin/recipients

router.get("/report/donations", getDonationReportController);
export default router;
