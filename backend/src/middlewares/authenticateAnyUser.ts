// src/middlewares/authenticateUser.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthenticatedRequest extends Request {
  donorId?: string;
  recipientId?: string;
  logisticsStaffId?: string;
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;       // <— just `return;`, no value
  }

  const token = authHeader.slice(7);
  let payload: { id: string; role: string };
  try {
    payload = jwt.verify(token, JWT_SECRET) as any;
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  switch (payload.role) {
    case "DONOR":
      req.donorId = payload.id;
      break;
    case "RECIPIENT":
      req.recipientId = payload.id;
      break;
    case "LOGISTIC_PROVIDER":
      req.logisticsStaffId = payload.id;
      break;
    default:
      res.status(403).json({ message: "Access denied" });
      return;
  }

  next();
};
