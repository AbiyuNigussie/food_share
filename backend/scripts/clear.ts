// scripts/clearDb.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    // Order matters if you have foreign key relationships
    await prisma.adminResponse.deleteMany();
    await prisma.contactMessage.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.deliveryTimeline.deleteMany();
    await prisma.delivery.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.recipientNeed.deleteMany();
    await prisma.location.deleteMany();
    await prisma.recipient.deleteMany();
    await prisma.donor.deleteMany();
    await prisma.logisticsStaff.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.user.deleteMany();

    console.log("Database cleared.");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase();
