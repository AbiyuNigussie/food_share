// src/utils/match.ts
import { Donation, RecipientNeed } from "@prisma/client";

/**
 * Score and pick the top 5 candidate donations for a given need,
 * using a simple “fuzzy” algorithm on type, quantity, location, and expiry.
 */
export function scoreAndSort(
  need: RecipientNeed,
  donations: Donation[]
): Donation[] {
  type Scored = { donation: Donation; score: number };

  const scored: Scored[] = donations.map((d) => {
    let score = 0;

    // 1) Exact foodType match
    if (d.foodType === need.foodType) score += 10;

    // 2) Quantity: full or near match
    const dQty = parseFloat(d.quantity);
    const nQty = parseFloat(need.quantity);
    if (dQty >= nQty) {
      score += 5;
    } else if (Math.abs(dQty - nQty) / nQty < 0.1) {
      score += 2;
    }

    // 3) Simple “same city” location check (assumes pickupAddress includes city)
    const needCity = need.DropOffAddress.split(",")[1]?.trim().toLowerCase();
    if (needCity && d.location.toLowerCase().includes(needCity)) {
      score += 3;
    }

    // 4) Sooner expiry gets a higher boost
    const daysToExpiry =
      (new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    // if it expires in under 5 days, boost proportionally
    if (daysToExpiry > 0) {
      score += Math.max(0, 5 - daysToExpiry);
    }

    return { donation: d, score };
  });

  // Sort descending by score, take top 5, then return just the Donation objects
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.donation);
}

/**
 * Score and pick top 5 candidate needs for a given donation.
 */
export function scoreAndSortNeeds(
  donation: Donation,
  needs: RecipientNeed[]
): RecipientNeed[] {
  type Scored = { need: RecipientNeed; score: number };

  const scored: Scored[] = needs.map((n) => {
    let score = 0;

    // 1) foodType match
    if (donation.foodType === n.foodType) score += 10;

    // 2) Quantity: donation.quantity >= need.quantity
    const dQty = parseFloat(donation.quantity);
    const nQty = parseFloat(n.quantity);
    if (dQty >= nQty) score += 5;
    else if (Math.abs(dQty - nQty) / nQty < 0.1) score += 2;

    // 3) Location match (donation.location vs dropOffAddress)
    const needCity = n.DropOffAddress.split(",")[1]?.trim().toLowerCase();
    if (needCity && donation.location.toLowerCase().includes(needCity)) {
      score += 3;
    }

    // 4) Soonest expiry bonus
    const daysToExpiry =
      (new Date(donation.expiryDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24);
    if (daysToExpiry > 0) {
      score += Math.max(0, 5 - daysToExpiry);
    }

    return { need: n, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.need);
}
