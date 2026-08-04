import { ConcertForm } from "@/components/ConcertForm";

export default function AddConcertPage() {
  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold">Add Concert</h2>
        <p className="text-sm opacity-70">
          Fill in the show details, costs, and how much fun you had. Total cost
          updates as you type.
        </p>
      </div>
      <ConcertForm />
    </div>
  );
}
