"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatMoney, getTotalCost } from "@/lib/calculations";

const EMPTY_FORM = {
  concert_name: "",
  artist: "",
  venue: "",
  city: "",
  state: "",
  concert_date: "",
  distance_from_home: "",
  hours_at_event: "",
  ticket_cost: "",
  ticket_fees: "",
  parking_cost: "",
  food_drink_cost: "",
  merchandise_cost: "",
  lodging_cost: "",
  travel_cost: "",
  other_cost: "",
  fun_rating: "7",
  notes: "",
};

function toNumber(value: string): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function ConcertForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalCost = useMemo(
    () =>
      getTotalCost({
        ticket_cost: toNumber(form.ticket_cost),
        ticket_fees: toNumber(form.ticket_fees),
        parking_cost: toNumber(form.parking_cost),
        food_drink_cost: toNumber(form.food_drink_cost),
        merchandise_cost: toNumber(form.merchandise_cost),
        lodging_cost: toNumber(form.lodging_cost),
        travel_cost: toNumber(form.travel_cost),
        other_cost: toNumber(form.other_cost),
      }),
    [form]
  );

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You need to be logged in to save a concert.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("concerts").insert({
      user_id: user.id,
      concert_name: form.concert_name.trim(),
      artist: form.artist.trim(),
      venue: form.venue.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      concert_date: form.concert_date,
      distance_from_home: toNumber(form.distance_from_home),
      hours_at_event: toNumber(form.hours_at_event),
      ticket_cost: toNumber(form.ticket_cost),
      ticket_fees: toNumber(form.ticket_fees),
      parking_cost: toNumber(form.parking_cost),
      food_drink_cost: toNumber(form.food_drink_cost),
      merchandise_cost: toNumber(form.merchandise_cost),
      lodging_cost: toNumber(form.lodging_cost),
      travel_cost: toNumber(form.travel_cost),
      other_cost: toNumber(form.other_cost),
      fun_rating: Number(form.fun_rating),
      notes: form.notes.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setForm(EMPTY_FORM);
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div role="alert" className="alert alert-success shadow-sm">
          <CheckCircle2 className="h-5 w-5" />
          <span>Concert saved! Add another anytime.</span>
        </div>
      )}
      {error && (
        <div role="alert" className="alert alert-error shadow-sm">
          <span>{error}</span>
        </div>
      )}

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title text-lg">Concert details</h2>
            <p className="text-sm opacity-70">Where you went and how long you stayed.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Concert name"
              required
              value={form.concert_name}
              onChange={(v) => update("concert_name", v)}
              placeholder="Summer Stadium Tour"
              help="A nickname you will recognize later."
            />
            <Field
              label="Artist or band"
              required
              value={form.artist}
              onChange={(v) => update("artist", v)}
              placeholder="The Midnight Keys"
            />
            <Field
              label="Venue"
              required
              value={form.venue}
              onChange={(v) => update("venue", v)}
              placeholder="Red Rocks Amphitheatre"
            />
            <Field
              label="City"
              required
              value={form.city}
              onChange={(v) => update("city", v)}
              placeholder="Morrison"
            />
            <Field
              label="State"
              required
              value={form.state}
              onChange={(v) => update("state", v)}
              placeholder="CO"
            />
            <Field
              label="Concert date"
              required
              type="date"
              value={form.concert_date}
              onChange={(v) => update("concert_date", v)}
            />
            <Field
              label="Distance from home (miles)"
              type="number"
              min="0"
              step="0.1"
              value={form.distance_from_home}
              onChange={(v) => update("distance_from_home", v)}
              placeholder="0"
              help="Round trip or one way — your call, just stay consistent."
            />
            <Field
              label="Hours at the event"
              type="number"
              min="0"
              step="0.1"
              required
              value={form.hours_at_event}
              onChange={(v) => update("hours_at_event", v)}
              placeholder="4"
              help="Used for cost-per-hour on your dashboard."
            />
          </div>

          <label className="form-control w-full">
            <span className="label-text font-medium mb-1">Notes</span>
            <textarea
              className="textarea textarea-bordered min-h-24"
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              placeholder="Opening act was amazing, rain during encore..."
            />
          </label>
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
            <div>
              <h2 className="card-title text-lg">Costs</h2>
              <p className="text-sm opacity-70">Enter dollars for each category. Leave blank for $0.</p>
            </div>
            <div className="badge badge-primary badge-lg gap-1 px-4 py-3">
              Total: <strong>{formatMoney(totalCost)}</strong>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MoneyField label="Ticket cost" value={form.ticket_cost} onChange={(v) => update("ticket_cost", v)} />
            <MoneyField label="Ticket fees" value={form.ticket_fees} onChange={(v) => update("ticket_fees", v)} />
            <MoneyField label="Parking cost" value={form.parking_cost} onChange={(v) => update("parking_cost", v)} />
            <MoneyField
              label="Food and drink cost"
              value={form.food_drink_cost}
              onChange={(v) => update("food_drink_cost", v)}
            />
            <MoneyField
              label="Merchandise cost"
              value={form.merchandise_cost}
              onChange={(v) => update("merchandise_cost", v)}
            />
            <MoneyField
              label="Hotel or lodging cost"
              value={form.lodging_cost}
              onChange={(v) => update("lodging_cost", v)}
            />
            <MoneyField
              label="Travel or gas cost"
              value={form.travel_cost}
              onChange={(v) => update("travel_cost", v)}
            />
            <MoneyField label="Other cost" value={form.other_cost} onChange={(v) => update("other_cost", v)} />
          </div>
        </div>
      </section>

      <section className="card bg-base-100 border border-base-300 shadow-sm">
        <div className="card-body gap-4">
          <div>
            <h2 className="card-title text-lg">Fun rating</h2>
            <p className="text-sm opacity-70">How much fun was this show?</p>
          </div>

          <div className="space-y-3">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={form.fun_rating}
              onChange={(e) => update("fun_rating", e.target.value)}
              className="range range-primary"
            />
            <div className="flex justify-between text-xs opacity-70 px-1">
              <span>1 · Terrible Time</span>
              <span className="font-semibold text-primary text-base">{form.fun_rating} / 10</span>
              <span>10 · Best Time Ever</span>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading ? "Saving..." : "Save concert"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  help,
  min,
  step,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  min?: string;
  step?: string;
}) {
  return (
    <label className="form-control w-full">
      <span className="label-text font-medium mb-1">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        min={min}
        step={step}
        className="input input-bordered w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {help && <span className="label-text-alt opacity-60 mt-1">{help}</span>}
    </label>
  );
}

function MoneyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="form-control w-full">
      <span className="label-text font-medium mb-1">{label}</span>
      <div className="join w-full">
        <span className="join-item btn btn-disabled no-animation px-3">$</span>
        <input
          type="number"
          min="0"
          step="0.01"
          className="input input-bordered join-item w-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
        />
      </div>
    </label>
  );
}
