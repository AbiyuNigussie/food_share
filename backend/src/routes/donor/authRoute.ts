import express from 'express'
import { register } from "../../controllers/donor/authController";

const router = express.Router();


router.post('/register', register);



export const donorAuthRoutes = router;