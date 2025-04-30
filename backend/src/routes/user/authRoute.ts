import express from 'express'
import {login, register, verifyEmail, forgotPassword, resetPassword } from "../../controllers/user/authController";

const router = express.Router();


router.post('/register', register);
router.post('/verify-email',  verifyEmail)
router.post('/login', login)
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export const UserAuthRoutes = router;