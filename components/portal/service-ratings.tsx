"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

const ratings = {
  overall: 4.8,
  breakdown: [
    { stars: 5, count: 150, percentage: 75 },
    { stars: 4, count: 35, percentage: 17.5 },
    { stars: 3, count: 10, percentage: 5 },
    { stars: 2, count: 4, percentage: 2 },
    { stars: 1, count: 1, percentage: 0.5 },
  ],
  categories: [
    { name: "Service Quality", rating: 4.9 },
    { name: "Staff Performance", rating: 4.8 },
    { name: "Timeliness", rating: 4.7 },
    { name: "Communication", rating: 4.6 },
    { name: "Value for Money", rating: 4.5 },
  ],
};

export function ServiceRatings() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <h3 className="font-medium mb-4">Overall Rating</h3>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-4xl font-bold">{ratings.overall}</div>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.floor(ratings.overall)
                    ? "fill-primary text-primary"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Based on {ratings.breakdown.reduce((acc, curr) => acc + curr.count, 0)} reviews
        </p>

        <div className="mt-6 space-y-3">
          {ratings.breakdown.map((rating) => (
            <div key={rating.stars} className="flex items-center space-x-4">
              <div className="w-12 text-sm">{rating.stars} stars</div>
              <Progress value={rating.percentage} className="flex-1" />
              <div className="w-12 text-sm text-right">{rating.count}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-medium mb-4">Category Ratings</h3>
        <div className="space-y-6">
          {ratings.categories.map((category) => (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{category.name}</span>
                <span className="font-medium">{category.rating}</span>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(category.rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <Progress value={(category.rating / 5) * 100} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}