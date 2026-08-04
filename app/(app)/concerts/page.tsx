import { ConcertCard } from "@/components/ConcertCard";
import { EmptyState } from "@/components/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { Concert } from "@/lib/types";

export default async function ConcertsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concerts")
    .select("*")
    .order("concert_date", { ascending: false });

  if (error) {
    return (
      <div role="alert" className="alert alert-error">
        <span>Could not load concerts: {error.message}</span>
      </div>
    );
  }

  const concerts = (data ?? []) as Concert[];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">My Concerts</h2>
        <p className="text-sm opacity-70">
          Every show you have logged — costs, fun, and value at a glance.
        </p>
      </div>

      {concerts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {concerts.map((concert) => (
            <ConcertCard key={concert.id} concert={concert} />
          ))}
        </div>
      )}
    </div>
  );
}
