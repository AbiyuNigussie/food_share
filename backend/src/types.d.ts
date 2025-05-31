import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  donorId?: string;
  recipientId?: string;
  logisticsStaffId?: string;
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
