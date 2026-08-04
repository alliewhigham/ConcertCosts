import {
  formatMoney,
  formatNumber,
  getValueScore,
  type ConcertWithMetrics,
  type ValueGrade,
  type ValueScore,
} from "./calculations";

export type GroupStat = {
  key: string;
  name: string;
  subtitle?: string;
  concertCount: number;
  totalSpent: number;
  avgFun: number;
  avgFunPointsPer100: number | null;
  valueScore: ValueScore | null;
};

function aggregate(
  concerts: ConcertWithMetrics[],
  getKey: (c: ConcertWithMetrics) => string,
  getName: (c: ConcertWithMetrics) => string,
  getSubtitle?: (c: ConcertWithMetrics) => string | undefined
): GroupStat[] {
  const map = new Map<
    string,
    {
      name: string;
      subtitle?: string;
      count: number;
      totalSpent: number;
      funSum: number;
      funPointsSum: number;
      funPointsCount: number;
    }
  >();

  for (const concert of concerts) {
    const key = getKey(concert);
    const existing = map.get(key);
    const funPoints = concert.funPointsPer100;

    if (existing) {
      existing.count += 1;
      existing.totalSpent += concert.totalCost;
      existing.funSum += Number(concert.fun_rating);
      if (funPoints != null) {
        existing.funPointsSum += funPoints;
        existing.funPointsCount += 1;
      }
    } else {
      map.set(key, {
        name: getName(concert),
        subtitle: getSubtitle?.(concert),
        count: 1,
        totalSpent: concert.totalCost,
        funSum: Number(concert.fun_rating),
        funPointsSum: funPoints ?? 0,
        funPointsCount: funPoints != null ? 1 : 0,
      });
    }
  }

  return Array.from(map.entries()).map(([key, row]) => {
    const avgFunPointsPer100 =
      row.funPointsCount > 0 ? row.funPointsSum / row.funPointsCount : null;

    return {
      key,
      name: row.name,
      subtitle: row.subtitle,
      concertCount: row.count,
      totalSpent: row.totalSpent,
      avgFun: row.funSum / row.count,
      avgFunPointsPer100,
      valueScore: getValueScore(avgFunPointsPer100),
    };
  });
}

export function groupByArtist(concerts: ConcertWithMetrics[]): GroupStat[] {
  return aggregate(
    concerts,
    (c) => c.artist.trim().toLowerCase(),
    (c) => c.artist.trim()
  );
}

export function groupByVenue(concerts: ConcertWithMetrics[]): GroupStat[] {
  return aggregate(
    concerts,
    (c) =>
      `${c.venue.trim().toLowerCase()}|${c.city.trim().toLowerCase()}|${c.state.trim().toLowerCase()}`,
    (c) => c.venue.trim(),
    (c) => `${c.city.trim()}, ${c.state.trim()}`
  );
}

export function sortBySpend(groups: GroupStat[]): GroupStat[] {
  return groups.slice().sort((a, b) => b.totalSpent - a.totalSpent);
}

export function sortByValue(groups: GroupStat[]): GroupStat[] {
  return groups.slice().sort((a, b) => {
    const aVal = a.avgFunPointsPer100 ?? -1;
    const bVal = b.avgFunPointsPer100 ?? -1;
    return bVal - aVal;
  });
}

export function toChartRows(groups: GroupStat[], limit = 6) {
  return groups.slice(0, limit).map((g) => ({
    name: truncate(g.name, 14),
    fullName: g.subtitle ? `${g.name} (${g.subtitle})` : g.name,
    spent: Number(g.totalSpent.toFixed(2)),
    value:
      g.avgFunPointsPer100 == null
        ? 0
        : Number(g.avgFunPointsPer100.toFixed(2)),
    grade: g.valueScore?.grade ?? "—",
  }));
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function formatGroupLine(group: GroupStat): string {
  const valuePart =
    group.avgFunPointsPer100 == null
      ? "No value score"
      : `${formatNumber(group.avgFunPointsPer100, 2)} Fun Points / $100`;
  return `${formatMoney(group.totalSpent)} · ${group.concertCount} show${
    group.concertCount === 1 ? "" : "s"
  } · avg fun ${formatNumber(group.avgFun, 1)}/10 · ${valuePart}`;
}

export type { ValueGrade };
