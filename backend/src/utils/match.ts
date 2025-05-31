import { Donation, RecipientNeed } from "@prisma/client";

// Extended types with locationLabel/dropoffLabel
type DonationWithLocation = Donation & {
  locationLabel: string;
};

type NeedWithLocation = RecipientNeed & {
  dropoffLabel: string;
};

// Match donations for a given need
export function scoreAndSort(
  need: NeedWithLocation,
  donations: DonationWithLocation[]
): Donation[] {
  type Scored = { donation: DonationWithLocation; score: number };

  const scored: Scored[] = donations.map((d) => {
    let score = 0;

    if (d.foodType === need.foodType) score += 10;

    const dQty = parseFloat(d.quantity);
    const nQty = parseFloat(need.quantity);
    if (dQty >= nQty) score += 5;
    else if (Math.abs(dQty - nQty) / nQty < 0.1) score += 2;

    const needCity = need.dropoffLabel.split(",")[1]?.trim().toLowerCase();
    if (needCity && d.locationLabel.toLowerCase().includes(needCity)) {
      score += 3;
    }

    const daysToExpiry =
      (new Date(d.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    if (daysToExpiry > 0) {
      score += Math.max(0, 5 - daysToExpiry);
    }

    return { donation: d, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((s) => s.donation);
}

// Match needs for a given donation
export function scoreAndSortNeeds(
  donation: DonationWithLocation,
  needs: NeedWithLocation[]
): RecipientNeed[] {
  type Scored = { need: NeedWithLocation; score: number };

  const scored: Scored[] = needs.map((n) => {
    let score = 0;

    if (donation.foodType === n.foodType) score += 10;

    const dQty = parseFloat(donation.quantity);
    const nQty = parseFloat(n.quantity);
    if (dQty >= nQty) score += 5;
    else if (Math.abs(dQty - nQty) / nQty < 0.1) score += 2;

    const needCity = n.dropoffLabel.split(",")[1]?.trim().toLowerCase();
    if (needCity && donation.locationLabel.toLowerCase().includes(needCity)) {
      score += 3;
    }

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
