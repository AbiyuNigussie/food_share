import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret";

<<<<<<< HEAD
export const authenticateAdmin = (
=======
export const authenticateAdmin = async (
>>>>>>> 0ac8c76fecf75f52e95ed134e2f18cbb9c46bff2
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, JWT_SECRET, async (err: any, decoded: any) => {
    if (err) {
      res.status(401).json({ message: "Invalid or expired token" });
      return;
    }
    // Support both { id } and { userId } in token payload
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user || user.role !== "ADMIN") {
      res.status(403).json({ message: "Forbidden: Admins only" });
      return;
    }
    req.user = user;
    next();
<<<<<<< HEAD
  });
=======
  } catch (err) {
    console.log("Authentication error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
>>>>>>> 0ac8c76fecf75f52e95ed134e2f18cbb9c46bff2
};
