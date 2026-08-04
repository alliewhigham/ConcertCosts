"use client";

import { Music2 } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  message?: string;
  showAddLink?: boolean;
};

export function EmptyState({
  message = "No concerts logged yet. Add your first concert to start seeing your dashboard.",
  showAddLink = true,
}: EmptyStateProps) {
  return (
    <div className="card bg-base-200/70 border border-base-300 shadow-sm">
      <div className="card-body items-center text-center gap-3 py-12">
        <div className="rounded-full bg-primary/15 p-4 text-primary">
          <Music2 className="h-8 w-8" aria-hidden />
        </div>
        <p className="max-w-md text-base-content/80">{message}</p>
        {showAddLink && (
          <Link href="/add" className="btn btn-primary mt-2">
            Add your first concert
          </Link>
        )}
      </div>
    </div>
  );
}
