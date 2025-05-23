import { PrismaClient } from "@prisma/client";

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

export const deleteDonationById = async (donationId: string) => {
  return await prisma.donation.delete({
    where: { id: donationId },
  });
};

export const getDonationsCount = async () => {
  const result = await prisma.donation.count();
  return result;
};
