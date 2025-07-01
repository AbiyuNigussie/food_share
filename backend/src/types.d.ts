import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  role?: string;
  donorId?: string;
  recipientId?: string;
  logisticsStaffId?: string;
  adminId?: string;
}

interface DonationFilters {
  foodType?: string;
  status?: string;
}

interface DeliveryFilters {
  status?: string;
}

interface Address {
  label: string;
  lat: number;
  lon: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
