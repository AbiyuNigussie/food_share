import express from "express";
import {
  handleInitialize,
  handlePaymentSuccess,
} from "../controllers/paymentController";

const router = express.Router();

router.post("/initialize", handleInitialize);

router.get("/payment-success", handlePaymentSuccess);

export default router;
