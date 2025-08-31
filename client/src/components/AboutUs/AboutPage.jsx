import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16">
      <header className="mb-8 space-y-2">
        <h1 className="text-balance text-3xl font-semibold tracking-tight">About RateMate</h1>
        <p className="text-muted-foreground">
          We’re building a simple, trustworthy way to discover great stores through real customer feedback.
        </p>
      </header>

      <Card>
        <CardContent className="space-y-6 p-6">
          <section className="space-y-2">
            <h2 className="text-xl font-medium">Our Mission</h2>
            <p className="text-pretty text-muted-foreground">
              RateMate exists to help shoppers make confident decisions. We do this by presenting clear store profiles
              and honest ratings, with a focus on quality over quantity.
            </p>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Clean, unbiased store ratings that are easy to understand at a glance.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">Community</h3>
              <p className="text-sm text-muted-foreground">
                We believe the best recommendations come from real shoppers, not ads.
              </p>
            </div>
          </section>

          <div className="flex gap-3">
            <Link to="/stores">
              <Button variant="ghost">Explore Stores</Button>
            </Link>
            <Link to="/rating">
              <Button className="bg-black text-white hover:bg-zinc-900">Rate a Store</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
