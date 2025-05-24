import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  donorId?: string;
  recipientId?: string;
}

interface DonationFilters {
  foodType?: string;
  status?: string;
}
