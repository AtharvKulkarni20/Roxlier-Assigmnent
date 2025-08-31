"use client";

import * as React from "react";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoreDetails({ store, className }) {
  const storageKey = `ratemate:user-rating:${store.id}`;
  const [userRating, setUserRating] = React.useState(0);
  const [draft, setDraft] = React.useState(0);
  const [hasSaved, setHasSaved] = React.useState(false);

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const parsed = saved ? Number(saved) : 0;
      if (!Number.isNaN(parsed) && parsed > 0) {
        setUserRating(parsed);
        setDraft(parsed);
        setHasSaved(true);
      }
    } catch {
      // ignore read errors
    }
  }, [storageKey]);

  function handleSave() {
    try {
      localStorage.setItem(storageKey, String(draft));
      setUserRating(draft);
      setHasSaved(true);
    } catch {
      // ignore write errors
    }
  }

  function handleClear() {
    try {
      localStorage.removeItem(storageKey);
      setUserRating(0);
      setDraft(0);
      setHasSaved(false);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}
    >
      <div className="grid gap-8 md:grid-cols-[360px,1fr]">
        {/* Left: Store image */}
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <img
            src={
              store.imageUrl ||
              "https://www.canva.com/fr_fr/generateur-image-ia/"
            }
            alt={`${store.name} storefront`}
            className="w-full max-h-80 object-cover rounded-xl"
          />
        </div>

        {/* Right: Main details and rating actions */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-pretty">
              {store.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {store.address}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span>
                Overall rating:{" "}
                <span className="font-medium text-foreground">
                  {store.overallRating.toFixed(1)}
                </span>{" "}
                / 5
              </span>
              {typeof store.ratingCount === "number" && (
                <span>({store.ratingCount} reviews)</span>
              )}
            </div>
          </div>

          {/* Rating interaction row */}
          <section
            aria-labelledby="your-rating"
            className="rounded-lg border p-4"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="your-rating" className="text-base font-medium">
                  Your rating
                </h2>
                <p className="text-sm text-muted-foreground">
                  Click the stars to select a rating. You can update it anytime.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <RatingStars
                  value={draft}
                  onChange={(val) => setDraft(val)}
                  size="lg"
                  aria-label="Select your rating"
                />
                <div className="min-w-[4ch] text-sm tabular-nums text-muted-foreground">
                  {draft > 0 ? `${draft}/5` : "-/5"}
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                onClick={handleSave}
                className="bg-black text-white hover:bg-black/90"
                aria-label={hasSaved ? "Update rating" : "Submit rating"}
              >
                {hasSaved ? "Update Rating" : "Submit Rating"}
              </Button>
              {hasSaved ? (
                <Badge variant="secondary">Saved</Badge>
              ) : (
                <Badge variant="outline">Not submitted</Badge>
              )}
              {hasSaved && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground"
                  onClick={handleClear}
                >
                  Clear my rating
                </Button>
              )}
            </div>
            {/* Always show the user's submitted rating line (even before saving) */}
            <p className="mt-2 text-sm text-muted-foreground">
              Your submitted rating:{" "}
              <span className="font-medium">
                {userRating > 0 ? `${userRating}/5` : "Not yet submitted"}
              </span>
            </p>
          </section>

          {/* Details below */}
          <section aria-labelledby="about-store" className="space-y-3">
            <h3 id="about-store" className="text-base font-semibold">
              About this store
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {store.description ||
                "Discover quality products and friendly service. This store is committed to great value and a dependable experience for every customer visit."}
            </p>
            {store.categories && store.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {store.categories.map((c) => (
                  <Badge key={c} variant="outline">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </section>

          <Separator />

          <section aria-labelledby="hours" className="space-y-2">
            <h3 id="hours" className="text-base font-semibold">
              Hours
            </h3>
            <p className="text-sm text-muted-foreground">
              {store.hours || "Mon–Sun: 9:00 AM – 9:00 PM"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
