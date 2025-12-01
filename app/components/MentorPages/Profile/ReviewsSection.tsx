"use client";

import { Star } from "lucide-react";

export default function ReviewsSection({ stats }) {
  const s = stats || {};

  return (
    <div
      className="p-6 rounded-xl border backdrop-blur-xl"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <h3 className="text-lg font-semibold mb-6 text-[var(--foreground)]">
        Reviews Summary
      </h3>

      <div className="flex items-center gap-4">
        <Star className="text-yellow-500" />
        <p className="text-xl font-semibold">
          {s.rating} <span className="text-sm">/ 5.0</span>
        </p>
      </div>

      <p className="text-[var(--foreground-muted)] mt-2">
        Based on {s.reviewsCount} reviews
      </p>
    </div>
  );
}
