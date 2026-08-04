import type { Concert, ConcertCosts } from "./types";

export function getTotalCost(costs: ConcertCosts): number {
  return (
    Number(costs.ticket_cost || 0) +
    Number(costs.ticket_fees || 0) +
    Number(costs.parking_cost || 0) +
    Number(costs.food_drink_cost || 0) +
    Number(costs.merchandise_cost || 0) +
    Number(costs.lodging_cost || 0) +
    Number(costs.travel_cost || 0) +
    Number(costs.other_cost || 0)
  );
}

export function getCostPerHour(totalCost: number, hoursAtEvent: number): number | null {
  const hours = Number(hoursAtEvent);
  if (!hours || hours <= 0) return null;
  return totalCost / hours;
}

/** Fun Points per $100 = (fun rating / total cost) * 100 */
export function getFunPointsPer100(funRating: number, totalCost: number): number | null {
  if (!totalCost || totalCost <= 0) return null;
  return (Number(funRating) / totalCost) * 100;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number, digits = 1): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  }).format(value);
}

export type ValueGrade = "A" | "B" | "C" | "D" | "F";

export type ValueScore = {
  grade: ValueGrade;
  label: string;
  verdict: string;
  funPointsPer100: number;
};

/**
 * Letter grade from Fun Points per $100.
 * Higher = more fun for each dollar spent.
 */
export function getValueScore(funPointsPer100: number | null): ValueScore | null {
  if (funPointsPer100 == null) return null;

  const score = funPointsPer100;
  let grade: ValueGrade;
  let label: string;
  let verdict: string;

  if (score >= 8) {
    grade = "A";
    label = "Excellent value";
    verdict = "Strong value for the fun you had.";
  } else if (score >= 5) {
    grade = "B";
    label = "Good value";
    verdict = "A solid balance of cost and fun.";
  } else if (score >= 3) {
    grade = "C";
    label = "Fair value";
    verdict = "A decent experience, but not a bargain.";
  } else if (score >= 1.5) {
    grade = "D";
    label = "Low value";
    verdict = "The fun was limited relative to what you spent.";
  } else {
    grade = "F";
    label = "Poor value";
    verdict = "High cost for the fun level of this show.";
  }

  return { grade, label, verdict, funPointsPer100: score };
}

export function withMetrics(concert: Concert) {
  const totalCost = getTotalCost(concert);
  const costPerHour = getCostPerHour(totalCost, concert.hours_at_event);
  const funPointsPer100 = getFunPointsPer100(concert.fun_rating, totalCost);
  const valueScore = getValueScore(funPointsPer100);

  return {
    ...concert,
    totalCost,
    costPerHour,
    funPointsPer100,
    valueScore,
  };
}

export type ConcertWithMetrics = ReturnType<typeof withMetrics>;
