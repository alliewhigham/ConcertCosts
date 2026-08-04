import { Award } from "lucide-react";
import {
  formatMoney,
  formatNumber,
  type ConcertWithMetrics,
  type ValueGrade,
} from "@/lib/calculations";

const GRADE_STYLES: Record<ValueGrade, string> = {
  A: "bg-success text-success-content",
  B: "bg-info text-info-content",
  C: "bg-warning text-warning-content",
  D: "bg-orange-500 text-white",
  F: "bg-error text-error-content",
};

type ValueVerdictsProps = {
  concerts: ConcertWithMetrics[];
};

export function ValueVerdicts({ concerts }: ValueVerdictsProps) {
  const ranked = concerts
    .filter((c) => c.valueScore != null)
    .slice()
    .sort(
      (a, b) =>
        (b.valueScore?.funPointsPer100 ?? 0) -
        (a.valueScore?.funPointsPer100 ?? 0)
    );

  const unscored = concerts.filter((c) => c.valueScore == null);

  if (ranked.length === 0) {
    return (
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-2">
          <h3 className="card-title text-lg gap-2">
            <Award className="h-5 w-5 text-primary" aria-hidden />
            Show Value Scores
          </h3>
          <p className="text-sm opacity-70">
            Add a concert with a cost greater than $0 to see letter grades and
            “Was it worth it?” verdicts.
          </p>
        </div>
      </section>
    );
  }

  const top = ranked[0];
  const gradeCounts = ranked.reduce(
    (acc, c) => {
      const g = c.valueScore!.grade;
      acc[g] = (acc[g] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<ValueGrade, number>>
  );

  return (
    <section className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="card-title text-lg gap-2">
              <Award className="h-5 w-5 text-primary" aria-hidden />
              Show Value Scores
            </h3>
            <p className="text-sm opacity-70 mt-1 max-w-2xl">
              Each show gets a letter grade from Fun Points per $100 — a higher
              grade means more fun for the money.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["A", "B", "C", "D", "F"] as ValueGrade[]).map((grade) => (
              <span
                key={grade}
                className={`badge badge-lg ${GRADE_STYLES[grade]}`}
              >
                {grade}: {gradeCounts[grade] ?? 0}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-box border border-primary/30 bg-primary/10 p-4">
          <p className="text-xs uppercase tracking-wide opacity-70 mb-1">
            Was it worth it? — Best value so far
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span
              className={`inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-box text-2xl font-bold ${GRADE_STYLES[top.valueScore!.grade]}`}
            >
              {top.valueScore!.grade}
            </span>
            <div>
              <p className="font-semibold text-lg leading-tight">
                {top.concert_name}
              </p>
              <p className="text-sm opacity-80">{top.artist}</p>
              <p className="text-sm mt-1">
                <span className="font-medium">{top.valueScore!.label}.</span>{" "}
                {top.valueScore!.verdict}
              </p>
              <p className="text-xs opacity-60 mt-1">
                {formatNumber(top.valueScore!.funPointsPer100, 2)} Fun Points per
                $100 · {formatMoney(top.totalCost)} total · {top.fun_rating}/10
                fun
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium opacity-80">All concerts by value</p>
          <ul className="space-y-3">
            {ranked.map((concert) => {
              const score = concert.valueScore!;
              return (
                <li
                  key={concert.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-box border border-base-300 bg-base-200/40 p-3"
                >
                  <span
                    className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-box text-xl font-bold ${GRADE_STYLES[score.grade]}`}
                    aria-label={`Grade ${score.grade}`}
                  >
                    {score.grade}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold truncate">{concert.concert_name}</p>
                    <p className="text-sm opacity-70 truncate">
                      {concert.artist} · {formatMoney(concert.totalCost)} ·{" "}
                      {concert.fun_rating}/10 fun
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-medium">{score.label}.</span>{" "}
                      {score.verdict}
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <p className="text-xs opacity-60">Fun Points / $100</p>
                    <p className="font-semibold">
                      {formatNumber(score.funPointsPer100, 2)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {unscored.length > 0 && (
          <p className="text-xs opacity-60">
            {unscored.length} concert
            {unscored.length === 1 ? "" : "s"} could not be graded because total
            cost was $0.
          </p>
        )}

        <details className="text-xs opacity-60">
          <summary className="cursor-pointer font-medium">How grades work</summary>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>A — 8+ Fun Points per $100 · Excellent value</li>
            <li>B — 5 to 7.9 · Good value</li>
            <li>C — 3 to 4.9 · Fair value</li>
            <li>D — 1.5 to 2.9 · Low value</li>
            <li>F — under 1.5 · Poor value</li>
          </ul>
        </details>
      </div>
    </section>
  );
}
