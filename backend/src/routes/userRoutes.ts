// src/routes/userRoutes.ts
import express from 'express';
import { userAuth } from '../middleware/userAuth';
import { getUserData } from '../controllers/userController';

const userRouter = express.Router();

// Get authenticated user data
userRouter.get('/data', userAuth, getUserData);

export default userRouter;