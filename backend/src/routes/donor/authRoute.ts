import express from 'express'
import { register,verifyEmail } from "../../controllers/donor/authController";

const router = express.Router();


router.post('/register', register);
router.get('/verify-email',  verifyEmail)



export const donorAuthRoutes = router;