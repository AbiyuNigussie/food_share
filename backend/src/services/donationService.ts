import { PrismaClient } from "@prisma/client";
import { DonationFilters } from "../types";
import { scoreAndSortNeeds } from "../utils/match";

const prisma = new PrismaClient();

interface Address {
  label: string;
  latitude: number;
  longitude: number;
}

export const createDonation = async (
  donorId: string,
  data: {
    availableFrom: string;
    availableTo: string;
    expiryDate: string;
    foodType: string;
    quantity: string;
    location: Address;
    notes?: string;
  }
) => {
  const pickupLocation = await prisma.location.create({
    data: {
      label: data.location.label,
      latitude: data.location.latitude,
      longitude: data.location.longitude,
    },
  });

  const donation = await prisma.donation.create({
    data: {
      status: "pending",
      availableFrom: new Date(data.availableFrom),
      availableTo: new Date(data.availableTo),
      expiryDate: new Date(data.expiryDate),
      foodType: data.foodType,
      quantity: data.quantity,
      locationId: pickupLocation.id,
      notes: data.notes,
      donorId: donorId,
    },
  });

  // 3) Find all pending needs for this same foodType
  const pendingNeeds = await prisma.recipientNeed.findMany({
    where: {
      foodType: donation.foodType,
      status: "pending",
    },
  });

  const donationWithLocation = await prisma.donation.findUnique({
    where: { id: donation.id },
    include: {
      location: true,
    },
  });

  if (!donationWithLocation) throw new Error("Donation not found");

  // Prepare the object in the expected shape
  const donationForMatching = {
    ...donationWithLocation,
    locationLabel: donationWithLocation.location.label,
  };

  // 4) Use fuzzy‐matching to pick the top 5 needs
  const topNeeds = scoreAndSortNeeds(donationForMatching, pendingNeeds);

  // 5) Notify each recipient about the matching donation
  for (const need of topNeeds) {
    await prisma.notification.create({
      data: {
        userId: need.recipientId,
        message: `A new donation (${donation.quantity} ${donation.foodType}) matches your need.`,
        meta: {
          needId: need.id,
          donationId: donation.id,
        },
      },
    });
  }

  return donation;
};

export const getAllDonations = async (page: number, rowsPerPage: number) => {
  return await prisma.donation.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    include: {
      location: true, // include location details
      donor: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getFilteredDonations = async (
  page: number,
  rowsPerPage: number,
  filters: DonationFilters
) => {
  const whereClause: any = {};

  if (filters.foodType) {
    whereClause.foodType = filters.foodType;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  return await prisma.donation.findMany({
    where: whereClause,
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
    include: {
      location: true,
      donor: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteDonationById = async (donationId: string) => {
  return await prisma.donation.delete({
    where: { id: donationId },
  });
};

export const getDonationsCount = async () => {
  const result = await prisma.donation.count();
  return result;
};

export const getFilteredDonationsCount = async (filters: DonationFilters) => {
  const whereClause: any = {};

  if (filters.foodType) {
    whereClause.foodType = filters.foodType;
  }

  if (filters.status) {
    whereClause.status = filters.status;
  }

  return await prisma.donation.count({
    where: whereClause,
  });
};

export const getDonationById = async (donationId: string) => {
  return await prisma.donation.findUnique({
    where: { id: donationId },
    include: {
      location: true,
      donor: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
      recipient: {
        include: {
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });
};

export const claimDonationById = async (
  donationId: string,
  recipientUserId: string,
  deliveryDetails: {
    recipientPhone: string;
    dropoffLocation: Address;
    deliveryNotes?: string;
  }
) => {
  return await prisma.$transaction(async (tx) => {
    // 1️⃣ Verify donation exists & is claimable (include location info)
    const donation = await tx.donation.findUnique({
      where: { id: donationId },
      include: {
        location: true,
      },
    });

    if (!donation) {
      throw new Error("Donation not found.");
    }

    if (donation.status !== "pending") {
      throw new Error("Donation is not available to claim.");
    }

    // 2️⃣ Ensure the recipient exists
    const recipient = await tx.recipient.findUnique({
      where: { userId: recipientUserId },
    });

    if (!recipient) {
      throw new Error("Recipient not found.");
    }

    // 3️⃣ Update donation → claimed
    const updatedDonation = await tx.donation.update({
      where: { id: donationId },
      data: {
        status: "claimed",
        recipientId: recipient.userId,
      },
    });

    // 4️⃣ Create dropoff location record
    const dropoffLocation = await tx.location.create({
      data: {
        label: deliveryDetails.dropoffLocation.label,
        latitude: deliveryDetails.dropoffLocation.latitude,
        longitude: deliveryDetails.dropoffLocation.longitude,
      },
    });

    // 5️⃣ Create delivery record with pickupLocationId from donation.locationId
    await tx.delivery.create({
      data: {
        donationId,
        deliveryStatus: "PENDING",
        recipientPhone: deliveryDetails.recipientPhone,
        deliveryInstructions: deliveryDetails.deliveryNotes,
        pickupLocationId: donation.locationId,
        dropoffLocationId: dropoffLocation.id,
      },
    });

    return updatedDonation;
  });
};

export const updateDonationStatus = async (
  donationId: string,
  status: string
) => {
  return await prisma.donation.update({
    where: { id: donationId },
    data: { status },
  });
};
