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

export interface Donation {
  id: number;
  foodType: string;
  quantity: string;
  location: string;
  expiryDate: string;
  notes: string;
  status: "matched" | "pending" | "in-process";
}
