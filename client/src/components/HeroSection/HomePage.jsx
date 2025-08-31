import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "../Footer/Footer";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-6">
            <h1 className="text-balance font-sans text-4xl font-semibold tracking-tight md:text-5xl">
              Discover top stores through real customer ratings
            </h1>
            <p className="text-pretty text-muted-foreground">
              RateMate helps shoppers find trustworthy stores and share honest feedback. 
              Browse ratings, compare experiences, and make confident decisions.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/stores">
                <Button className="bg-black text-white hover:bg-zinc-900">Browse Stores</Button>
              </Link>
            </div>
          </div>

          {/* Visual card */}
          <Card className="border border-input">
            <CardContent className="p-0">
              <img
                src="/img.png"
                alt="Illustration of a store rating dashboard"
                className="h-auto w-full rounded-lg"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h1 className="text-balance font-sans text-3xl font-semibold tracking-tight md:text-4xl mb-6 mt-10">Why RateMate ?</h1>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 p-6">
              <h3 className="font-medium">Verified Reviews</h3>
              <p className="text-sm text-muted-foreground">
                A streamlined process to keep spam out so you can trust what you read.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <h3 className="font-medium">Clear Store Profiles</h3>
              <p className="text-sm text-muted-foreground">
                See ratings, highlights, and recent reviews at a glance for each store.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-6">
              <h3 className="font-medium">Simple, Fair Ratings</h3>
              <p className="text-sm text-muted-foreground">
                Leave quick star ratings or detailed feedback—the choice is yours.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-lg border bg-card p-6 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-balance text-2xl font-semibold tracking-tight">
                Help the community shop smarter
              </h2>
              <p className="mt-2 text-muted-foreground">
                Share your experience—good or bad—and help others choose the best stores.
              </p>
            </div>
            <Link to="/signup">
              <Button className="bg-black text-white hover:bg-zinc-900">Create an account</Button>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
