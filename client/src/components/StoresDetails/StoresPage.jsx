"use client"

import { StoreCard } from "./StoreCard"
import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

// API helper function
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  };
  
  const response = await fetch(`http://localhost:5001/api${url}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeUser('user');
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

export default function StoresPage({ onStoreClick }) {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState("")
  const [city, setCity] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("ASC")

  // Fetch stores from backend
  const fetchStores = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams({
        sortBy,
        sortOrder
      })
      
      if (query.trim()) {
        params.append('search', query.trim())
      }
      
      const data = await makeAuthenticatedRequest(`/user/stores?${params}`)
      
      // Transform backend data to match frontend expectations
      const transformedStores = data.stores.map(store => ({
        id: store.id,
        name: store.name,
        rating: parseFloat(store.averageRating) || 0,
        description: store.address, // Using address as description for now
        logoUrl: `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(store.name)}`,
        city: extractCityFromAddress(store.address),
        address: store.address,
        email: store.email,
        userRating: store.userRating,
        totalRatings: store.totalRatings,
        overallRating: parseFloat(store.averageRating) || 0
      }))
      
      setStores(transformedStores)
    } catch (err) {
      console.error('Failed to fetch stores:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract city from address
  const extractCityFromAddress = (address) => {
    if (!address) return "Unknown"
    // Simple extraction - assumes city is before the last comma
    const parts = address.split(',')
    return parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim()
  }

  // Fetch stores on component mount and when sort changes
  useEffect(() => {
    fetchStores()
  }, [sortBy, sortOrder])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStores()
    }, 300)
    
    return () => clearTimeout(timeoutId)
  }, [query])

  // Get unique cities from stores
  const cities = useMemo(() => {
    const set = new Set(stores.map((s) => s.city))
    return Array.from(set).sort()
  }, [stores])

  // Filter stores by city (client-side filtering for city)
  const filtered = useMemo(() => {
    return stores.filter((s) => {
      const matchesCity = city === "all" ? true : s.city === city
      return matchesCity
    })
  }, [stores, city])

  const handleClearFilters = () => {
    setQuery("")
    setCity("all")
    setSortBy("name")
    setSortOrder("ASC")
  }

  const handleSortChange = (value) => {
    const [field, order] = value.split('-')
    setSortBy(field)
    setSortOrder(order)
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading stores...</span>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchStores} className="mt-4">
          Try Again
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground text-balance">Stores</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse stores and see community ratings at a glance.</p>
      </header>

      {/* Filters and Search */}
      <section className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, address, or email"
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

        <div className="w-full md:w-48">
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
            <SelectTrigger aria-label="Sort stores">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-ASC">Name A-Z</SelectItem>
              <SelectItem value="name-DESC">Name Z-A</SelectItem>
              <SelectItem value="avg_rating-DESC">Rating High-Low</SelectItem>
              <SelectItem value="avg_rating-ASC">Rating Low-High</SelectItem>
              <SelectItem value="address-ASC">Address A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button
          variant="secondary"
          onClick={handleClearFilters}
        >
          Clear
        </Button>
      </section>

      <p className="mb-3 text-sm text-muted-foreground">
        Showing {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {/* Stores List */}
      <ul className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <li className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            {stores.length === 0 ? "No stores available." : "No stores found. Try a different search or choose another location."}
          </li>
        ) : (
          filtered.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              onStoreClick={onStoreClick}
            />
          ))
        )}
      </ul>

      {/* Refresh button */}
      <div className="mt-8 text-center">
        <Button variant="outline" onClick={fetchStores}>
          Refresh Stores
        </Button>
      </div>
    </main>
  )
}