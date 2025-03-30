import express from 'express'
import { login, register,verifyEmail } from "../../controllers/donor/authController";

const router = express.Router();


router.post('/register', register);
router.get('/verify-email',  verifyEmail)
router.post('/login', login)


export const donorAuthRoutes = router;