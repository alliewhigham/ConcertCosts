import {
  formatMoney,
  formatNumber,
  withMetrics,
  type ConcertWithMetrics,
} from "./calculations";
import type { Concert } from "./types";
import { groupByArtist, sortBySpend, sortByValue } from "./moneyMap";

export type YearSummary = {
  year: number;
  concertCount: number;
  totalSpent: number;
  avgFun: number;
  avgCost: number;
  bestValue: ConcertWithMetrics | null;
  highestFun: ConcertWithMetrics | null;
  mostExpensive: ConcertWithMetrics | null;
  topArtistBySpend: string | null;
  topArtistByValue: string | null;
  concerts: ConcertWithMetrics[];
};

export function getCurrentConcertYear(now = new Date()): number {
  return now.getFullYear();
}

export function filterConcertsByYear(
  concerts: Concert[],
  year: number
): ConcertWithMetrics[] {
  return concerts
    .map(withMetrics)
    .filter((c) => {
      const date = new Date(c.concert_date + "T12:00:00");
      return date.getFullYear() === year;
    });
}

export function buildYearSummary(
  concerts: Concert[],
  year = getCurrentConcertYear()
): YearSummary {
  const yearConcerts = filterConcertsByYear(concerts, year);
  const totalSpent = yearConcerts.reduce((sum, c) => sum + c.totalCost, 0);
  const avgFun =
    yearConcerts.length === 0
      ? 0
      : yearConcerts.reduce((sum, c) => sum + Number(c.fun_rating), 0) /
        yearConcerts.length;
  const avgCost = yearConcerts.length === 0 ? 0 : totalSpent / yearConcerts.length;

  const withValue = yearConcerts.filter((c) => c.funPointsPer100 != null);
  const bestValue =
    withValue.length === 0
      ? null
      : withValue.reduce((best, c) =>
          (c.funPointsPer100 ?? 0) > (best.funPointsPer100 ?? 0) ? c : best
        );

  const highestFun =
    yearConcerts.length === 0
      ? null
      : yearConcerts.reduce((best, c) =>
          c.fun_rating > best.fun_rating ? c : best
        );

  const mostExpensive =
    yearConcerts.length === 0
      ? null
      : yearConcerts.reduce((best, c) =>
          c.totalCost > best.totalCost ? c : best
        );

  const artists = groupByArtist(yearConcerts);
  const topSpend = sortBySpend(artists)[0] ?? null;
  const topValue = sortByValue(artists).find((a) => a.avgFunPointsPer100 != null) ?? null;

  return {
    year,
    concertCount: yearConcerts.length,
    totalSpent,
    avgFun,
    avgCost,
    bestValue,
    highestFun,
    mostExpensive,
    topArtistBySpend: topSpend?.name ?? null,
    topArtistByValue: topValue?.name ?? null,
    concerts: yearConcerts,
  };
}

export function formatYearStatMoney(amount: number) {
  return formatMoney(amount);
}

export function formatYearStatNumber(value: number, digits = 1) {
  return formatNumber(value, digits);
}
