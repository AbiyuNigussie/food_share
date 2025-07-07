import express from "express";
import uploadMemory from "../../middlewares/uploadMemory";
import {
  login,
  register,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../../controllers/user/authController";

const router = express.Router();

router.post(
  "/register",
  uploadMemory.fields([
    { name: "businessRegistrationDoc", maxCount: 1 },
    { name: "taxIdDoc", maxCount: 1 },
    { name: "proofOfAddressDoc", maxCount: 1 },
  ]),
  register
);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export const UserAuthRoutes = router;
