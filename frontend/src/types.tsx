export interface DonationCardProps {
  title: string;
  donor: string;
  quantity: string;
  location: Location;
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

export interface Location {
  label: string;
  latitude: number;
  longitude: number;
}
export interface Donation {
  id: string;
  title: string;
  donor: Donor;
  foodType: string;
  quantity: string;
  location: Location;
  expiryDate: string;
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
  dropoffLocation: { label: string; latitude: number; longitude: number };
  notes: string;
  status: "matched" | "pending" | "in-process";
  contactPhone: string;
}
export interface AppNotification {
  id: string;
  message: string;
  meta: any; // Adjust type as needed
  readStatus: boolean;
  createdAt: string;
}

export interface MatchedDonation {
  id: string;
  foodType: string;
  quantity: string;
  createdAt: string;
  donor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  delivery?: {
    deliveryStatus: string;
    recipientPhone: string;
    deliveryInstructions?: string | null;
    scheduledDate?: string | null;
    deliveredAt?: string | null;
    // Now include pickupLocation and dropoffLocation sub‐objects:
    pickupLocation: {
      id: string;
      label: string;
      latitude: number;
      longitude: number;
    };
    dropoffLocation: {
      id: string;
      label: string;
      latitude: number;
      longitude: number;
    };
  };
}

// -------------
/**
 * A donation that the recipient “claimed” explicitly (via the “Claim Donation” flow).
 * Comes from `getClaimedDonationsForRecipient`.
 */
export interface ClaimedDonation {
  id: string;
  foodType: string;
  quantity: string;
  createdAt: string;
  donor: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  delivery?: {
    deliveryStatus: string;
    pickupLocation: string;
    dropoffLocation: string;
    recipientPhone: string;
    // (add any other fields you like from your Prisma Delivery model)
  };
}

export interface DeliveryTimelineEvent {
  id: string;
  status: string;
  note?: string;
  timestamp: string;
}

export interface Delivery {
  id: string;
  deliveryStatus: string;
  createdAt: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  updatedAt: string;
  scheduledPickup?: string;
  scheduledDropoff?: string;
  timeline?: DeliveryTimelineEvent[];
}
