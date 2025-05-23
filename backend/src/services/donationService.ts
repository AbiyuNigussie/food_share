import { PrismaClient } from "@prisma/client";
import { DonationFilters } from "../types";

const prisma = new PrismaClient();

export const createDonation = async (
  donorId: string,
  data: {
    availableFrom: string;
    availableTo: string;
    expiryDate: string;
    foodType: string;
    quantity: string;
    location: string;
    notes?: string;
  }
) => {
  return await prisma.donation.create({
    data: {
      status: "pending",
      availableFrom: new Date(data.availableFrom),
      availableTo: new Date(data.availableTo),
      expiryDate: new Date(data.expiryDate),
      foodType: data.foodType,
      quantity: data.quantity,
      location: data.location,
      notes: data.notes,
      donor: { connect: { userId: donorId } },
    },
  });
};

export const getAllDonations = async (page: number, rowsPerPage: number) => {
  return await prisma.donation.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
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
