import { AverageRatingCard } from "./AverageRationgCard"
import { RatingsTable } from "./RatingsTable"
import { Link } from "react-router-dom"

// Demo data — replace with your data source or backend later
const storeName = "FreshMart Downtown"
const ratings = [
  {
    id: "1",
    userName: "Aarav Patel",
    userEmail: "aarav@example.com",
    rating: 5,
    comment: "Great produce and friendly staff!",
    date: "2025-08-01",
  },
  {
    id: "2",
    userName: "Mia Chen",
    userEmail: "mia@example.com",
    rating: 4,
    comment: "Nice selection, could improve checkout speed.",
    date: "2025-08-03",
  },
  {
    id: "3",
    userName: "Lucas Silva",
    userEmail: "lucas@example.com",
    rating: 3,
    comment: "Average experience, decent prices.",
    date: "2025-08-10",
  },
]

function getAverage(r) {
  if (!r.length) return 0
  return r.reduce((sum, x) => sum + x.rating, 0) / r.length
}

export default function OwnerDashboardPage() {
  const avg = getAverage(ratings)

  return (
    <main className="container mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-pretty text-2xl font-semibold">Store Owner Dashboard</h1>
        <p className="text-muted-foreground">
          Overview for <span className="font-medium">{storeName}</span>.{" "}
          <Link className="underline" to="/stores">
            View store listings
          </Link>
        </p>
      </header>

      <section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <AverageRatingCard storeName={storeName} average={avg} count={ratings.length} />
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">Quick facts</h3>
          <ul className="space-y-1 text-sm">
            <li>
              Total ratings: <span className="font-medium">{ratings.length}</span>
            </li>
            <li>
              Last rating date: <span className="font-medium">{ratings[0]?.date ?? "—"}</span>
            </li>
            <li>
              Current average: <span className="font-medium">{Math.round(avg * 10) / 10}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Users who rated your store</h2>
          <span className="text-sm text-muted-foreground">{ratings.length} total</span>
        </div>
        <RatingsTable ratings={ratings} />
      </section>
    </main>
  )
}
