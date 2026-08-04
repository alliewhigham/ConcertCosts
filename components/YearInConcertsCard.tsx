"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
import {
  formatMoney,
  formatNumber,
  type ConcertWithMetrics,
} from "@/lib/calculations";
import { buildYearSummary } from "@/lib/yearSummary";
import type { Concert } from "@/lib/types";

type YearInConcertsCardProps = {
  concerts: Concert[];
};

export function YearInConcertsCard({ concerts }: YearInConcertsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summary = buildYearSummary(concerts);
  const year = summary.year;

  async function handleDownload() {
    if (!cardRef.current) return;
    setDownloading(true);
    setError(null);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#1a1033",
      });

      const link = document.createElement("a");
      link.download = `year-in-concerts-${year}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      setError("Could not create the image. Try again, or take a screenshot of the card.");
    } finally {
      setDownloading(false);
    }
  }

  if (summary.concertCount === 0) {
    return (
      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-2">
          <h3 className="card-title text-lg gap-2">
            <Share2 className="h-5 w-5 text-primary" aria-hidden />
            Year in Concerts
          </h3>
          <p className="text-sm opacity-70">
            No concerts logged for {year} yet. Add a show from this year to
            unlock your shareable recap card.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="card bg-base-100 border border-base-300 shadow-sm">
      <div className="card-body gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="card-title text-lg gap-2">
              <Share2 className="h-5 w-5 text-primary" aria-hidden />
              Year in Concerts
            </h3>
            <p className="text-sm opacity-70 mt-1">
              A shareable recap of your {year} shows. Download it as an image.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-primary gap-2"
            onClick={handleDownload}
            disabled={downloading}
          >
            <Download className="h-4 w-4" aria-hidden />
            {downloading ? "Creating image..." : "Download image"}
          </button>
        </div>

        {error && (
          <div role="alert" className="alert alert-warning text-sm py-2">
            <span>{error}</span>
          </div>
        )}

        <div className="mx-auto w-full max-w-xl">
          <div
            ref={cardRef}
            className="overflow-hidden rounded-2xl shadow-lg"
            style={{
              background:
                "linear-gradient(160deg, #2b1654 0%, #1a1033 45%, #0f172a 100%)",
              color: "#f8fafc",
              fontFamily:
                'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
            }}
          >
            <div style={{ padding: "28px 28px 24px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "#c4b5fd",
                  fontWeight: 600,
                }}
              >
                Concert Cost Tracker
              </p>
              <h4
                style={{
                  margin: "10px 0 0",
                  fontSize: 28,
                  lineHeight: 1.15,
                  fontWeight: 800,
                }}
              >
                My Year in Concerts
              </h4>
              <p style={{ margin: "6px 0 0", color: "#e9d5ff", fontSize: 16 }}>
                {year}
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginTop: 22,
                }}
              >
                <Stat
                  label="Shows"
                  value={String(summary.concertCount)}
                />
                <Stat
                  label="Total spent"
                  value={formatMoney(summary.totalSpent)}
                />
                <Stat
                  label="Avg fun"
                  value={`${formatNumber(summary.avgFun, 1)} / 10`}
                />
                <Stat
                  label="Avg cost"
                  value={formatMoney(summary.avgCost)}
                />
              </div>

              <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
                <Highlight
                  label="Best value"
                  value={highlightName(summary.bestValue)}
                  detail={
                    summary.bestValue?.valueScore
                      ? `Grade ${summary.bestValue.valueScore.grade} · ${formatNumber(summary.bestValue.funPointsPer100 ?? 0, 2)} Fun Points / $100`
                      : undefined
                  }
                />
                <Highlight
                  label="Highest fun"
                  value={highlightName(summary.highestFun)}
                  detail={
                    summary.highestFun
                      ? `${summary.highestFun.fun_rating} / 10`
                      : undefined
                  }
                />
                <Highlight
                  label="Most expensive"
                  value={highlightName(summary.mostExpensive)}
                  detail={
                    summary.mostExpensive
                      ? formatMoney(summary.mostExpensive.totalCost)
                      : undefined
                  }
                />
                <Highlight
                  label="Top artist by spend"
                  value={summary.topArtistBySpend ?? "—"}
                />
                <Highlight
                  label="Best value artist"
                  value={summary.topArtistByValue ?? "—"}
                />
              </div>

              <p
                style={{
                  margin: "22px 0 0",
                  fontSize: 11,
                  color: "#a5b4fc",
                  letterSpacing: "0.04em",
                }}
              >
                Fun for the money · Tracked with Concert Cost Tracker
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(196,181,253,0.25)",
        padding: "12px 14px",
      }}
    >
      <p style={{ margin: 0, fontSize: 11, color: "#c4b5fd" }}>{label}</p>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 18,
          fontWeight: 700,
          lineHeight: 1.2,
          wordBreak: "break-word",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function Highlight({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: "rgba(15, 23, 42, 0.45)",
        border: "1px solid rgba(196,181,253,0.2)",
        padding: "12px 14px",
      }}
    >
      <p style={{ margin: 0, fontSize: 11, color: "#c4b5fd" }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700 }}>{value}</p>
      {detail && (
        <p style={{ margin: "4px 0 0", fontSize: 12, color: "#cbd5e1" }}>
          {detail}
        </p>
      )}
    </div>
  );
}

function highlightName(concert: ConcertWithMetrics | null) {
  if (!concert) return "—";
  return `${concert.concert_name} · ${concert.artist}`;
}
