import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  donorId?: string;
}

interface DonationFilters {
  foodType?: string;
  status?: string;
}
