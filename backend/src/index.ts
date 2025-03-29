// src/server.ts
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB, prisma } from './config/db';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';

const app: Application = express();
const port = process.env.PORT || 4000;

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// API Endpoints
app.get('/', (req: Request, res: Response) => {
  res.send("API working");
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

// Graceful shutdown
const shutdown = async () => {
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});