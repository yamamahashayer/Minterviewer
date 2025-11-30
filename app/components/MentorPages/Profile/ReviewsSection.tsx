"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Star } from "lucide-react";

export default function ReviewsSection({ reviews, stats }: any) {
  return (
    <div
      className="relative overflow-hidden rounded-xl backdrop-blur-xl p-6"
      style={{ background: "var(--card)", border: "1px solid var(--border)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[var(--foreground)]">Recent Reviews</h3>

        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="text-[var(--foreground)]">{stats.rating}</span>
          <span className="text-[var(--foreground-muted)]">
            ({stats.totalReviews} reviews)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review: any, index: number) => (
          <div
            key={index}
            className="p-4 rounded-lg"
            style={{ background: "var(--background-muted)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={review.avatar} />
                <AvatarFallback>{review.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[var(--foreground)] text-sm">{review.name}</h4>
                  <span className="text-[var(--foreground-muted)] text-xs">
                    {review.date}
                  </span>
                </div>

                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[var(--foreground)] text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
