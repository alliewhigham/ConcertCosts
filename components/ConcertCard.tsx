import { MapPin, Star } from "lucide-react";
import {
  formatMoney,
  formatNumber,
  withMetrics,
  type ConcertWithMetrics,
} from "@/lib/calculations";
import { COST_CATEGORIES, type Concert } from "@/lib/types";

type ConcertCardProps = {
  concert: Concert;
};

export function ConcertCard({ concert }: ConcertCardProps) {
  const item: ConcertWithMetrics = withMetrics(concert);
  const dateLabel = new Date(concert.concert_date + "T12:00:00").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" }
  );

  const mainCosts = COST_CATEGORIES.map((cat) => ({
    ...cat,
    amount: Number(concert[cat.key] || 0),
  })).filter((c) => c.amount > 0);

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h3 className="card-title text-xl">{concert.concert_name}</h3>
            <p className="opacity-80">{concert.artist}</p>
            <p className="mt-1 flex items-center gap-1.5 text-sm opacity-70">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
              {concert.venue} · {concert.city}, {concert.state}
            </p>
            <p className="text-sm opacity-60 mt-1">{dateLabel}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="stat bg-base-200 rounded-box py-2 px-4 min-w-[7rem]">
              <div className="stat-title text-xs">Total cost</div>
              <div className="stat-value text-lg text-primary">{formatMoney(item.totalCost)}</div>
            </div>
            <div className="stat bg-base-200 rounded-box py-2 px-4 min-w-[7rem]">
              <div className="stat-title text-xs flex items-center gap-1">
                <Star className="h-3 w-3" /> Fun
              </div>
              <div className="stat-value text-lg">{item.fun_rating}/10</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Metric
            label="Cost per hour"
            value={
              item.costPerHour == null ? "—" : formatMoney(item.costPerHour)
            }
          />
          <Metric
            label="Fun Points per $100"
            value={
              item.funPointsPer100 == null
                ? "—"
                : formatNumber(item.funPointsPer100, 2)
            }
          />
          <Metric
            label="Hours at event"
            value={formatNumber(Number(concert.hours_at_event), 1)}
          />
          <Metric
            label="Miles from home"
            value={formatNumber(Number(concert.distance_from_home), 1)}
          />
        </div>

        {mainCosts.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2 opacity-80">Main cost categories</p>
            <div className="flex flex-wrap gap-2">
              {mainCosts.map((c) => (
                <span key={c.key} className="badge badge-outline badge-lg gap-1">
                  {c.label}: {formatMoney(c.amount)}
                </span>
              ))}
            </div>
          </div>
        )}

        {concert.notes && (
          <div className="rounded-box bg-base-200/70 p-3 text-sm">
            <p className="font-medium mb-1 opacity-70">Notes</p>
            <p className="whitespace-pre-wrap">{concert.notes}</p>
          </div>
        )}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-box border border-base-300 px-3 py-2">
      <p className="text-xs opacity-60">{label}</p>
      <p className="font-semibold text-sm sm:text-base">{value}</p>
    </div>
  );
}
