// src/middlewares/authenticateRecipient.ts
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authenticateRecipient: RequestHandler = (
  req: AuthenticatedRequest,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;    // <-- just return void, don’t return the res object
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    if (payload.role !== "RECIPIENT") {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    req.recipientId = payload.id;
    req.userId      = payload.id;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
