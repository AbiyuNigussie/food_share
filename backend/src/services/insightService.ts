// src/services/insightsService.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Returns:
 *   - total number of donations by this donor
 *   - an array of `{ month: "YYYY-MM", count: number }` for the last 12 months
 */
export async function getDonorInsights(donorId: string) {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  // 1) Total
  const total = await prisma.donation.count({
    where: { donorId }
  });

  // 2) Fetch all donations in the last 12 months with status
  const recent = await prisma.donation.findMany({
    where: {
      donorId,
      createdAt: { gte: oneYearAgo }
    },
    select: { createdAt: true, status: true }
  });

  // 3) Bucket by month and status in JS
  type Bucket = { matched: number; claimed: number };
  const buckets: Record<string, Bucket> = {};
  recent.forEach(({ createdAt, status }) => {
    const m = createdAt.toISOString().slice(0, 7); // "YYYY-MM"
    if (!buckets[m]) buckets[m] = { matched: 0, claimed: 0 };
    if (status === "matched") buckets[m].matched += 1;
    else if (status === "claimed") buckets[m].claimed += 1;
  });

  // 4) Build an array for Jan–Dec of the current year
  const now = new Date();
  const year = now.getFullYear();
  const monthly: { month: string; matched: number; claimed: number }[] = [];
  for (let month = 0; month < 12; month++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}`; // "2025-01", etc.
    const bucket = buckets[key] || { matched: 0, claimed: 0 };
    monthly.push({ month: key, matched: bucket.matched, claimed: bucket.claimed });
  }

  return { total, monthly };
}

/**
 * Same shape, but for recipient “needs served” instead of donations.
 * Counts how many deliveries (i.e. needs matched) this recipient has had,
 * and buckets them by the month they were matched.
 */
export async function getRecipientInsights(recipientId: string, year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year + 1, 0, 1);

  const recent = await prisma.delivery.findMany({
    where: {
      donation: { recipientId },
      createdAt: { gte: start, lt: end }
    },
    select: { createdAt: true }
  });

  // Bucket by month for the selected year
  const buckets: Record<string, number> = {};
  recent.forEach(({ createdAt }) => {
    const m = createdAt.toISOString().slice(0, 7);
    buckets[m] = (buckets[m] || 0) + 1;
  });

  const monthly: { month: string; volume: number }[] = [];
  for (let month = 0; month < 12; month++) {
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    monthly.push({ month: key, volume: buckets[key] || 0 });
  }

  return { monthly };
}
