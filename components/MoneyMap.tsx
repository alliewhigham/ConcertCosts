"use client";

import { MapPinned, Mic2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatMoney,
  formatNumber,
  type ConcertWithMetrics,
  type ValueGrade,
} from "@/lib/calculations";
import {
  formatGroupLine,
  groupByArtist,
  groupByVenue,
  sortBySpend,
  sortByValue,
  toChartRows,
  type GroupStat,
} from "@/lib/moneyMap";

const GRADE_STYLES: Record<ValueGrade, string> = {
  A: "badge-success",
  B: "badge-info",
  C: "badge-warning",
  D: "badge-warning",
  F: "badge-error",
};

type MoneyMapProps = {
  concerts: ConcertWithMetrics[];
};

export function MoneyMap({ concerts }: MoneyMapProps) {
  const artists = groupByArtist(concerts);
  const venues = groupByVenue(concerts);

  const artistsBySpend = sortBySpend(artists);
  const artistsByValue = sortByValue(artists).filter(
    (g) => g.avgFunPointsPer100 != null
  );
  const venuesBySpend = sortBySpend(venues);
  const venuesByValue = sortByValue(venues).filter(
    (g) => g.avgFunPointsPer100 != null
  );

  const artistSpendChart = toChartRows(artistsBySpend);
  const artistValueChart = toChartRows(artistsByValue);
  const venueSpendChart = toChartRows(venuesBySpend);
  const venueValueChart = toChartRows(venuesByValue);

  return (
    <section className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-6">
        <div>
          <h3 className="card-title text-lg gap-2">
            <MapPinned className="h-5 w-5 text-primary" aria-hidden />
            Artist & Venue Money Map
          </h3>
          <p className="text-sm opacity-70 mt-1 max-w-3xl">
            See which artists and venues cost you the most — and which ones give
            you the best value for your money.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <GroupColumn
            title="Artists"
            icon={<Mic2 className="h-4 w-4" aria-hidden />}
            spendList={artistsBySpend}
            valueList={artistsByValue}
            spendChart={artistSpendChart}
            valueChart={artistValueChart}
            spendChartTitle="Spending by artist"
            valueChartTitle="Value by artist (Fun Points / $100)"
            emptySpend="Add concerts with artists to see spending."
            emptyValue="Add concerts with costs to see artist value."
          />

          <GroupColumn
            title="Venues"
            icon={<MapPinned className="h-4 w-4" aria-hidden />}
            spendList={venuesBySpend}
            valueList={venuesByValue}
            spendChart={venueSpendChart}
            valueChart={venueValueChart}
            spendChartTitle="Spending by venue"
            valueChartTitle="Value by venue (Fun Points / $100)"
            emptySpend="Add concerts with venues to see spending."
            emptyValue="Add concerts with costs to see venue value."
          />
        </div>
      </div>
    </section>
  );
}

function GroupColumn({
  title,
  icon,
  spendList,
  valueList,
  spendChart,
  valueChart,
  spendChartTitle,
  valueChartTitle,
  emptySpend,
  emptyValue,
}: {
  title: string;
  icon: React.ReactNode;
  spendList: GroupStat[];
  valueList: GroupStat[];
  spendChart: ReturnType<typeof toChartRows>;
  valueChart: ReturnType<typeof toChartRows>;
  spendChartTitle: string;
  valueChartTitle: string;
  emptySpend: string;
  emptyValue: string;
}) {
  return (
    <div className="space-y-4 rounded-box border border-base-300 bg-base-200/30 p-4">
      <h4 className="font-semibold text-base flex items-center gap-2">
        {icon}
        {title}
      </h4>

      <MiniChart
        title={spendChartTitle}
        data={spendChart}
        dataKey="spent"
        color="#c026d3"
        empty={emptySpend}
        formatTooltip={(v) => formatMoney(v)}
      />

      <RankList
        title={`Highest spending ${title.toLowerCase()}`}
        groups={spendList.slice(0, 5)}
        empty={emptySpend}
        mode="spend"
      />

      <MiniChart
        title={valueChartTitle}
        data={valueChart}
        dataKey="value"
        color="#06b6d4"
        empty={emptyValue}
        formatTooltip={(v) => formatNumber(v, 2)}
      />

      <RankList
        title={`Best value ${title.toLowerCase()}`}
        groups={valueList.slice(0, 5)}
        empty={emptyValue}
        mode="value"
      />
    </div>
  );
}

function MiniChart({
  title,
  data,
  dataKey,
  color,
  empty,
  formatTooltip,
}: {
  title: string;
  data: ReturnType<typeof toChartRows>;
  dataKey: "spent" | "value";
  color: string;
  empty: string;
  formatTooltip: (value: number) => string;
}) {
  return (
    <div className="rounded-box border border-base-300 bg-base-100 p-3">
      <p className="text-sm font-medium mb-2">{title}</p>
      {data.length === 0 ? (
        <p className="text-sm opacity-60 py-8 text-center">{empty}</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 36 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={50} />
            <YAxis
              tickFormatter={(v) =>
                dataKey === "spent" ? `$${v}` : String(v)
              }
              width={48}
            />
            <Tooltip
              formatter={(value) => formatTooltip(Number(value ?? 0))}
              labelFormatter={(_, payload) =>
                String(payload?.[0]?.payload?.fullName ?? "")
              }
            />
            <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

function RankList({
  title,
  groups,
  empty,
  mode,
}: {
  title: string;
  groups: GroupStat[];
  empty: string;
  mode: "spend" | "value";
}) {
  return (
    <div>
      <p className="text-sm font-medium mb-2 opacity-80">{title}</p>
      {groups.length === 0 ? (
        <p className="text-sm opacity-60">{empty}</p>
      ) : (
        <ol className="space-y-2">
          {groups.map((group, index) => (
            <li
              key={group.key}
              className="flex items-start gap-3 rounded-box border border-base-300 bg-base-100 p-3"
            >
              <span className="badge badge-ghost badge-sm mt-0.5 tabular-nums">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold truncate">{group.name}</p>
                  {mode === "value" && group.valueScore && (
                    <span
                      className={`badge badge-sm ${GRADE_STYLES[group.valueScore.grade]}`}
                    >
                      {group.valueScore.grade}
                    </span>
                  )}
                </div>
                {group.subtitle && (
                  <p className="text-xs opacity-60">{group.subtitle}</p>
                )}
                <p className="text-xs opacity-70 mt-1">
                  {formatGroupLine(group)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-sm">
                  {mode === "spend"
                    ? formatMoney(group.totalSpent)
                    : group.avgFunPointsPer100 == null
                      ? "—"
                      : formatNumber(group.avgFunPointsPer100, 2)}
                </p>
                <p className="text-[10px] opacity-50 uppercase tracking-wide">
                  {mode === "spend" ? "Spent" : "Value"}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
