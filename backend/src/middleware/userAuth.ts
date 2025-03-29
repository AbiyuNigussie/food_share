// src/middleware/userAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';

// Extend Express Request type with user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        // Add other user properties as needed
      };
    }
  }
}

interface JwtPayload {
  id: string;
}

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized - please login',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Verify user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true } // Only fetch necessary fields
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found - please login',
      });
    }

    // Attach user to request object
    req.user = { id: user.id };
    next();
  } catch (error: any) {
    // Handle different error types
    const message = error instanceof jwt.JsonWebTokenError 
      ? 'Invalid token' 
      : error.message;

    res.status(401).json({
      success: false,
      message: `Authentication failed: ${message}`,
    });
  }
};