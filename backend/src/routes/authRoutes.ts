// src/routes/authRoutes.ts
import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authController';
import { userAuth } from '../middleware/userAuth';


const authRouter = express.Router();

// Authentication core routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);

// Email verification flow
authRouter.post('/send-verify-otp', userAuth, sendVerifyOtp);
authRouter.post('/verify-account', userAuth, verifyEmail);

// Authentication check
authRouter.post('/is-auth', userAuth, isAuthenticated);

// Password reset flow
authRouter.post('/send-reset-otp', sendResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;