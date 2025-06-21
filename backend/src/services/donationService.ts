import { PrismaClient } from "@prisma/client";
import { DonationFilters } from "../types";
import { scoreAndSortNeeds } from "../utils/match";
import { createNotificationAndEmail } from "../services/notificationService";

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

  // 🔁 Include dropoffLocation for matching needs
  const pendingNeeds = await prisma.recipientNeed.findMany({
    where: {
      foodType: donation.foodType,
      status: "pending",
    },
    include: {
      dropoffLocation: true,
    },
  });

  const needsWithLocation = pendingNeeds.map((need) => ({
    ...need,
    dropoffLabel: need.dropoffLocation.label,
  }));

  const donationWithLocation = await prisma.donation.findUnique({
    where: { id: donation.id },
    include: {
      location: true,
    },
  });

  if (!donationWithLocation) throw new Error("Donation not found");

  const donationForMatching = {
    ...donationWithLocation,
    locationLabel: donationWithLocation.location.label,
  };

  const topNeeds = scoreAndSortNeeds(donationForMatching, needsWithLocation);

  // Send notifications (in-app + email)
  for (const need of topNeeds) {
    await createNotificationAndEmail(
      need.recipientId,
      `A new donation (${donation.quantity} ${donation.foodType}) matches your need.`,
      { needId: need.id, donationId: donation.id }
    );
  }

  return donation;
};

export const getAllDonations = async (
  page: number,
  rowsPerPage: number,
  donorId?: string
) => {
  return await prisma.donation.findMany({
    where: donorId ? { donorId } : {},
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

export const getDonationsCount = async (donorId?: string) => {
  return await prisma.donation.count({
    where: donorId ? { donorId } : {},
  });
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
  // Collect notifications to send after transaction
  const notificationsToSend: Array<{userId: string, message: string, meta?: any}> = [];

  const updatedDonation = await prisma.$transaction(async (tx) => {
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
    const delivery = await tx.delivery.create({
      data: {
        donationId,
        deliveryStatus: "PENDING",
        recipientPhone: deliveryDetails.recipientPhone,
        deliveryInstructions: deliveryDetails.deliveryNotes,
        pickupLocationId: donation.locationId,
        dropoffLocationId: dropoffLocation.id,
      },
    });

    // 6️⃣ Notify the donor (collect for after transaction)
    notificationsToSend.push({
      userId: donation.donorId,
      message: `Your donation (${donation.foodType}, ${donation.quantity}) has been claimed by a recipient.`,
      meta: { donationId, recipientId: recipient.userId },
    });

    // ⬅️ NEW: Notify all logistics‐staff users about the new delivery (collect for after transaction)
    const allStaff = await tx.logisticsStaff.findMany({
      select: { userId: true },
    });
    allStaff.forEach((s) => {
      notificationsToSend.push({
        userId: s.userId,
        message: `New delivery created for ${donation.foodType} (${donation.quantity}).`,
        meta: { donationId, deliveryId: delivery.id },
      });
    });

    return updatedDonation;
  });

  // After transaction, send notifications and emails
  await Promise.all(
    notificationsToSend.map(n =>
      createNotificationAndEmail(n.userId, n.message, n.meta)
    )
  );

  return updatedDonation;
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
