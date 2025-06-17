import { PrismaClient, Prisma, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const PASSWORD_SEED = 'password123';

async function main() {
  // Clean existing data
  const deleteOrder = [
    'Notification',
    'Delivery',
    'Donation',
    'RecipientNeed',
    'Location',
    'Admin',
    'LogisticsStaff',
    'Recipient',
    'Donor',
    'User',
  ];

  for (const model of deleteOrder) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${model}" CASCADE;`);
  }

  // Create main donor user
  const mainUser = await prisma.user.create({
    data: {
      email: "yonatangirmachew4@gmail.com",
      password: await bcrypt.hash(PASSWORD_SEED, 10),
      firstName: "Yonatan",
      lastName: "Girmachew",
      phoneNumber: faker.phone.number(),
      role: Role.DONOR,
      isVerified: true,
      verificationToken: null,
      createdAt: new Date(2025, 0, 1),
      donor: {
        create: {
          address: faker.location.streetAddress()
        }
      }
    },
    include: { donor: true }
  });

  // Create main recipient user
  const mainRecipientUser = await prisma.user.create({
    data: {
      email: "yonicode028@gmail.com",
      password: await bcrypt.hash(PASSWORD_SEED, 10),
      firstName: "Dagim",
      lastName: "Sisay",
      phoneNumber: faker.phone.number(),
      role: Role.RECIPIENT,
      isVerified: true,
      verificationToken: null,
      createdAt: new Date(2025, 0, 1),
      recipient: {
        create: {
          address: faker.location.streetAddress(),
          subscriptionStatus: "active", // or whatever default you want
          subscriptionDate: new Date(), // or a specific date
        }
      }
    },
    include: { recipient: true }
  });

  // Fetch the created recipient's ID
  const recipient = await prisma.recipient.findUnique({
    where: { userId: mainRecipientUser.id },
  });
  if (!recipient) throw new Error("Recipient not found");

  // Create locations
  const locations: Prisma.LocationCreateManyInput[] = [];
  for (let i = 0; i < 10; i++) {
    locations.push({
      label: faker.location.streetAddress(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
    });
  }

  await prisma.location.createMany({ data: locations });
  const locationIds = await prisma.location.findMany({ select: { id: true } });

  // Create donations across different months in 2025
  const donations: Prisma.DonationCreateManyInput[] = [];
  const year = 2025;

  // Define months with different donation counts
  const monthlyDonations = [
    { month: 0, count: 3 },   // January
    { month: 1, count: 2 },   // February
    { month: 2, count: 4 },   // March
    { month: 3, count: 3 },   // April
    { month: 4, count: 5 },   // May
    { month: 5, count: 4 },   // June
    { month: 6, count: 3 },   // July
    { month: 7, count: 6 },   // August
    { month: 8, count: 4 },   // September
    { month: 9, count: 3 },   // October
    { month: 10, count: 2 },  // November
    { month: 11, count: 5 },  // December
  ];

  // Store created donation IDs for linking deliveries
  const createdDonations: { id: string, createdAt: Date }[] = [];

  for (const { month, count } of monthlyDonations) {
    for (let i = 0; i < count; i++) {
      const day = faker.number.int({ min: 1, max: 28 });
      const availableFrom = new Date(year, month, day);
      const availableTo = new Date(year, month, day + faker.number.int({ min: 1, max: 7 }));

      const donation = await prisma.donation.create({
        data: {
          donorId: mainUser.id,
          status: faker.helpers.arrayElement(['matched', 'claimed', 'pending']),
          availableFrom,
          availableTo,
          expiryDate: faker.date.future({ years: 0.5, refDate: availableFrom }),
          foodType: faker.helpers.arrayElement(['Fresh Produce', 'Dairy', 'Canned Food', 'Baked Goods', 'Meat & Poultry']),
          quantity: `${faker.number.int({ min: 1, max: 20 })} kg`,
          notes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
          locationId: faker.helpers.arrayElement(locationIds).id,
          createdAt: availableFrom,
        }
      });
      createdDonations.push({ id: donation.id, createdAt: availableFrom });
    }
  }

  // For each donation, create a need and a delivery (1:1)
  for (const donation of createdDonations) {
    // Create a need for this delivery
    const need = await prisma.recipientNeed.create({
      data: {
        recipientId: recipient.userId,
        foodType: faker.helpers.arrayElement(['Fresh Produce', 'Dairy', 'Canned Food', 'Baked Goods', 'Meat & Poultry']),
        quantity: `${faker.number.int({ min: 1, max: 20 })} kg`,
        dropoffLocationId: faker.helpers.arrayElement(locationIds).id,
        contactPhone: faker.phone.number(),
      }
    });

    // Create a delivery for this donation and need
    await prisma.delivery.create({
      data: {
        donationId: donation.id,
        recipientPhone: need.contactPhone,
        deliveryStatus: "pending",
        dropoffLocationId: need.dropoffLocationId,
        pickupLocationId: faker.helpers.arrayElement(locationIds).id,
        createdAt: donation.createdAt,
      }
    });

    // *** THIS IS THE CRUCIAL STEP ***
    // Update the donation to set recipientId
    await prisma.donation.update({
      where: { id: donation.id },
      data: { recipientId: recipient.userId }
    });
  }

  // Generate donation report
  const donationCounts: Record<string, number> = {};
  createdDonations.forEach(donation => {
    if (donation.createdAt instanceof Date) {
      const month = donation.createdAt.toLocaleString('default', { month: 'long' });
      donationCounts[month] = (donationCounts[month] || 0) + 1;
    }
  });

  console.log(`Created ${createdDonations.length} donations in 2025 across months:`);
  Object.entries(donationCounts).forEach(([month, count]) => {
    console.log(`- ${month}: ${count} donations`);
  });

  console.log('Seeding complete!');
  console.log(`Created:
  - 1 main donor user
  - 1 main recipient user
  - ${locations.length} locations
  - ${createdDonations.length} donations
  - ${createdDonations.length} recipient needs
  - ${createdDonations.length} deliveries
  `);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });