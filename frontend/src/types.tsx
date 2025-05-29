export interface DonationCardProps {
  title: string;
  donor: string;
  quantity: string;
  location: string;
  expires?: string;
  distance?: string;
  status?: DonationStatus;
  onClaim?: () => void;
  onFeedback?: () => void;
}

export type DonationStatus = "in_transit" | "completed";

export interface User {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
}

export interface Donor {
  user: User;
  organizationName?: string;
}

export interface Donation {
  id: string;
  title: string;
  donor: Donor;
  foodType: string;
  quantity: string;
  location: string;
  expires: string;
  availableFrom: string;
  availableTo: string;
  status?: string;
  notes?: string;
}

export interface RecipientNeed {
  id: string;
  foodType: string;
  quantity: string;
  DropOffAddress: string;
  notes: string;
  status: "matched" | "pending" | "in-process";
}
export interface AppNotification {
  id: string;
  message: string;
  meta: any; // Adjust type as needed
  readStatus: boolean;
  createdAt: string;
}