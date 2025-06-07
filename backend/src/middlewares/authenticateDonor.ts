import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest as DonorRequest } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const authenticateDonor: RequestHandler = (
  req: DonorRequest,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Missing or invalid token" });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      role: string;
    };
    if (payload.role !== "DONOR") {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    req.donorId = payload.id;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
