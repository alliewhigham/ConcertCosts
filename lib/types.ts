export type Concert = {
  id: string;
  user_id: string;
  concert_name: string;
  artist: string;
  venue: string;
  city: string;
  state: string;
  concert_date: string;
  distance_from_home: number;
  hours_at_event: number;
  ticket_cost: number;
  ticket_fees: number;
  parking_cost: number;
  food_drink_cost: number;
  merchandise_cost: number;
  lodging_cost: number;
  travel_cost: number;
  other_cost: number;
  fun_rating: number;
  notes: string | null;
  created_at: string;
};

export type ConcertCosts = Pick<
  Concert,
  | "ticket_cost"
  | "ticket_fees"
  | "parking_cost"
  | "food_drink_cost"
  | "merchandise_cost"
  | "lodging_cost"
  | "travel_cost"
  | "other_cost"
>;

export const COST_CATEGORIES = [
  { key: "ticket_cost", label: "Tickets" },
  { key: "ticket_fees", label: "Fees" },
  { key: "parking_cost", label: "Parking" },
  { key: "food_drink_cost", label: "Food & Drink" },
  { key: "merchandise_cost", label: "Merch" },
  { key: "lodging_cost", label: "Lodging" },
  { key: "travel_cost", label: "Travel/Gas" },
  { key: "other_cost", label: "Other" },
] as const;
