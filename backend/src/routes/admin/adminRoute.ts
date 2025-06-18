// /routes/admin/adminRoute.ts
import express from 'express';
import userRoute from './userRoute'; // import userRoute inside here

const router = express.Router();

// mount other admin-related routes here
router.use('/users', userRoute); // now handled as /api/admin/users

export default router;
