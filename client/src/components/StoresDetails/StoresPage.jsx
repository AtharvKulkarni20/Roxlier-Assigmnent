"use client"

import { StoreCard } from "./StoreCard"
import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const stores = [
  {
    id: "freshmart",
    name: "FreshMart",
    rating: 4.6,
    description: "Neighborhood grocer with fresh produce, quick delivery, and friendly service.",
    logoUrl: "/freshmart-logo.png",
    city: "San Francisco",
    address: "123 Market St, San Francisco, CA",
  },
  {
    id: "techhub",
    name: "TechHub",
    rating: 4.2,
    description: "Electronics and gadgets with transparent reviews and solid warranty support.",
    logoUrl: "/techhub-logo.png",
    city: "San Jose",
    address: "77 First St, San Jose, CA",
  },
  {
    id: "stylecorner",
    name: "StyleCorner",
    rating: 4.0,
    description: "Trendy apparel and accessories from local designers and emerging brands.",
    logoUrl: "/stylecorner-logo.png",
    city: "Los Angeles",
    address: "501 Sunset Blvd, Los Angeles, CA",
  },
  {
    id: "booknest",
    name: "BookNest",
    rating: 4.8,
    description: "Independent bookstore with curated picks, events, and a cozy reading nook.",
    logoUrl: "/booknest-logo.png",
    city: "Portland",
    address: "42 Hawthorne Ave, Portland, OR",
  },
  {
    id: "petpals",
    name: "PetPals",
    rating: 3.9,
    description: "Pet supplies and grooming with helpful staff and reliable inventory.",
    logoUrl: "/petpals-logo.png",
    city: "Seattle",
    address: "19 Pine St, Seattle, WA",
  },
  {
    id: "homefair",
    name: "HomeFair",
    rating: 4.3,
    description: "Home essentials and decor with fair pricing and easy returns.",
    logoUrl: "/homefair-logo.png",
    city: "San Francisco",
    address: "880 Mission St, San Francisco, CA",
  },
]

export default function StoresPage() {
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("all")

  const cities = useMemo(() => {
    const set = new Set(stores.map((s) => s.city))
    return Array.from(set).sort()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return stores.filter((s) => {
      const matchesCity = city === "all" ? true : s.city === city
      if (!q) return matchesCity
      const haystack = `${s.name} ${s.description} ${s.city} ${s.address}`.toLowerCase()
      return matchesCity && haystack.includes(q)
    })
  }, [query, city])

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">Stores</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse stores and see community ratings at a glance.</p>
      </header>

      <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, description, city, or address"
            aria-label="Search stores"
          />
        </div>
        <div className="w-full md:w-60">
          <Select value={city} onValueChange={(v) => setCity(v)}>
            <SelectTrigger aria-label="Filter by city">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="secondary"
          onClick={() => {
            setQuery("")
            setCity("all")
          }}
        >
          Clear
        </Button>
      </section>

      <p className="mb-3 text-sm text-muted-foreground">
        Showing {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {/* List */}
      <ul className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <li className="rounded-lg border p-6 text-sm text-muted-foreground">
            No stores found. Try a different search or choose another location.
          </li>
        ) : (
          filtered.map((s) => <StoreCard key={s.id} store={s} />)
        )}
      </ul>
    </main>
  )
}
