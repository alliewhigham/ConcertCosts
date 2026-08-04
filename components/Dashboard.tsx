"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatMoney,
  formatNumber,
  withMetrics,
  type ConcertWithMetrics,
} from "@/lib/calculations";
import { COST_CATEGORIES, type Concert } from "@/lib/types";
import { EmptyState } from "./EmptyState";
import { MoneyMap } from "./MoneyMap";
import { ValueVerdicts } from "./ValueVerdicts";
import { YearInConcertsCard } from "./YearInConcertsCard";

const CHART_COLORS = [
  "#c026d3",
  "#8b5cf6",
  "#06b6d4",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
];
type DashboardProps = {
  concerts: Concert[];
};

export function Dashboard({ concerts }: DashboardProps) {
  if (concerts.length === 0) {
    return <EmptyState />;
  }

  const items = concerts.map(withMetrics);
  const totalSpent = items.reduce((sum, c) => sum + c.totalCost, 0);
  const avgCost = totalSpent / items.length;
  const avgFun =
    items.reduce((sum, c) => sum + Number(c.fun_rating), 0) / items.length;

  const withHour = items.filter((c) => c.costPerHour != null) as Array<
    ConcertWithMetrics & { costPerHour: number }
  >;
  const avgCostPerHour =
    withHour.length > 0
      ? withHour.reduce((sum, c) => sum + c.costPerHour, 0) / withHour.length
      : null;

  const withValue = items.filter((c) => c.funPointsPer100 != null) as Array<
    ConcertWithMetrics & { funPointsPer100: number }
  >;
  const bestValue =
    withValue.length > 0
      ? withValue.reduce((best, c) =>
          c.funPointsPer100 > best.funPointsPer100 ? c : best
        )
      : null;

  const mostExpensive = items.reduce((best, c) =>
    c.totalCost > best.totalCost ? c : best
  );
  const highestFun = items.reduce((best, c) =>
    c.fun_rating > best.fun_rating ? c : best
  );

  const categorySpend = COST_CATEGORIES.map((cat, index) => ({
    name: cat.label,
    value: items.reduce((sum, c) => sum + Number(c[cat.key] || 0), 0),
    fill: CHART_COLORS[index % CHART_COLORS.length],
  })).filter((row) => row.value > 0);

  const byConcert = items
    .slice()
    .sort(
      (a, b) =>
        new Date(a.concert_date).getTime() - new Date(b.concert_date).getTime()
    )
    .map((c) => ({
      name: truncate(c.concert_name, 16),
      fullName: c.concert_name,
      totalCost: Number(c.totalCost.toFixed(2)),
      fun: Number(c.fun_rating),
      funPer100:
        c.funPointsPer100 == null
          ? 0
          : Number(c.funPointsPer100.toFixed(2)),
    }));

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total concerts" value={String(items.length)} />
        <StatCard title="Total amount spent" value={formatMoney(totalSpent)} />
        <StatCard title="Average cost per concert" value={formatMoney(avgCost)} />
        <StatCard title="Average fun rating" value={`${formatNumber(avgFun, 1)} / 10`} />
        <StatCard
          title="Average cost per hour"
          value={avgCostPerHour == null ? "—" : formatMoney(avgCostPerHour)}
        />
        <StatCard
          title="Best value concert"
          value={bestValue ? bestValue.concert_name : "—"}
          subtitle={
            bestValue
              ? `${formatNumber(bestValue.funPointsPer100, 2)} Fun Points per $100`
              : undefined
          }
        />
        <StatCard
          title="Most expensive concert"
          value={mostExpensive.concert_name}
          subtitle={formatMoney(mostExpensive.totalCost)}
        />
        <StatCard
          title="Highest fun rating"
          value={highestFun.concert_name}
          subtitle={`${highestFun.fun_rating} / 10`}
        />
      </div>

      <ValueVerdicts concerts={items} />

      <MoneyMap concerts={items} />

      <YearInConcertsCard concerts={concerts} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spending by cost category">
          {categorySpend.length === 0 ? (
            <p className="text-sm opacity-70 py-10 text-center">No spending recorded yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categorySpend}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {categorySpend.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMoney(Number(value ?? 0))} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Total cost by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} />
              <YAxis tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(value) => formatMoney(Number(value ?? 0))}
                labelFormatter={(_, payload) =>
                  String(payload?.[0]?.payload?.fullName ?? "")
                }
              />
              <Bar dataKey="totalCost" name="Total cost" fill="#c026d3" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun rating by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} />
              <YAxis domain={[0, 10]} />
              <Tooltip
                labelFormatter={(_, payload) =>
                  String(payload?.[0]?.payload?.fullName ?? "")
                }
              />
              <Bar dataKey="fun" name="Fun rating" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Fun Points per $100 by concert">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byConcert} margin={{ top: 8, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} height={60} />
              <YAxis />
              <Tooltip
                formatter={(value) => formatNumber(Number(value ?? 0), 2)}
                labelFormatter={(_, payload) =>
                  String(payload?.[0]?.payload?.fullName ?? "")
                }
              />
              <Bar
                dataKey="funPer100"
                name="Fun Points per $100"
                fill="#06b6d4"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
      <div className="stat-title">{title}</div>
      <div className="stat-value text-xl sm:text-2xl text-primary break-words leading-tight">
        {value}
      </div>
      {subtitle && <div className="stat-desc text-sm opacity-80">{subtitle}</div>}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body">
        <h3 className="card-title text-base">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function truncate(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
