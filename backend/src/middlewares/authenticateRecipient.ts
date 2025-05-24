// src/middlewares/authenticateRecipient.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthenticatedRequest extends Request {
  recipientId?: string;
}

export const authenticateRecipient = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      email: string;
      role: string;
    };

    if (payload.role !== "RECIPIENT") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    req.recipientId = payload.id;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
