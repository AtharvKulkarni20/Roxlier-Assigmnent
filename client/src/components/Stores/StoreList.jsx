import { Star } from "lucide-react"
import { useEffect, useState } from "react"

// StoreCard component
function formatRating(rating) {
  const clamped = Math.max(0, Math.min(5, rating))
  return (Math.round(clamped * 10) / 10).toFixed(1)
}

function StoreCard({ store }) {
  const rating = Math.max(0, Math.min(5, store.rating))
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  const empty = 5 - full - (hasHalf ? 1 : 0)

  return (
    <li className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm">
      {/* Square logo */}
      <img
        src={store.logoUrl ?? "/placeholder.svg?height=64&width=64&query=store%20logo"}
        alt={`${store.name} logo`}
        className="size-16 rounded-md object-cover"
      />

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold leading-6 text-foreground text-pretty">{store.name}</h3>
          <span className="shrink-0 text-sm text-muted-foreground" aria-hidden="true">
            {store.totalRatings}
          </span>
        </div>

        {/* Stars */}
        <div className="mt-1 flex items-center gap-1" role="img" aria-label={`${formatRating(rating)} out of 5 stars`}>
          {Array.from({ length: full }).map((_, i) => (
            <Star key={`full-${i}`} className="size-4 fill-yellow-500 text-yellow-500" aria-hidden="true" />
          ))}
          {hasHalf && (
            <div className="relative">
              <Star className="size-4 text-yellow-500" aria-hidden="true" />
              <Star
                className="pointer-events-none absolute inset-0 size-4 text-yellow-500"
                style={{ clipPath: "inset(0 50% 0 0)" }}
                aria-hidden="true"
              />
            </div>
          )}
          {Array.from({ length: empty }).map((_, i) => (
            <Star key={`empty-${i}`} className="size-4 text-muted-foreground" aria-hidden="true" />
          ))}
        </div>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{store.description}</p>
      </div>
    </li>
  )
}


// Page component
export default function StoresList() {
  const [store, setStore] = useState([])

  useEffect(() => {
    const fetchStores = async () => {
      const response = await axios.get("http://localhost:5000/api/user/stores")
      const data = await response.data.stores
      setStore(data)
    }
    fetchStores()
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">Stores</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse stores and see community ratings at a glance.
        </p>
      </header>

      {/* List */}
      <ul className="flex flex-col gap-4">
        {store.map((s) => (
          <StoreCard key={s.id} store={s} />
        ))}
      </ul>
    </main>
  )
}