"use client"

import React, { useState, useEffect } from "react"
import { RatingStars } from "./RatingStars"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
  
  const response = await fetch(`http://localhost:5000/api${url}`, config);
  const data = await response.json();
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Authentication failed. Please login again.');
    }
    throw new Error(data.error || 'Request failed');
  }
  
  return data;
};

export default function StoreDetails({ storeId, onBack, className }) {
  const [store, setStore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [draft, setDraft] = useState(0)
  const [hasSaved, setHasSaved] = useState(false)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)

  // Fetch store details
  const fetchStoreDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get all stores and find the specific one
      const data = await makeAuthenticatedRequest('/user/stores')
      const storeData = data.stores.find(s => s.id.toString() === storeId)
      
      if (!storeData) {
        setError('Store not found')
        return
      }
      
      // Transform the store data
      const transformedStore = {
        id: storeData.id,
        name: storeData.name,
        address: storeData.address,
        email: storeData.email,
        overallRating: parseFloat(storeData.averageRating) || 0,
        ratingCount: storeData.totalRatings,
        userRating: storeData.userRating,
        logoUrl: `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(storeData.name)}`,
        imageUrl: `/placeholder.svg?height=640&width=640&query=${encodeURIComponent(storeData.name)}%20storefront`,
        city: extractCityFromAddress(storeData.address),
        description: `${storeData.name} is located at ${storeData.address}. Contact them at ${storeData.email} for more information.`,
        categories: ['Store'], // Default category since not in backend yet
        hours: "Mon–Sun: 9:00 AM – 9:00 PM" // Default hours since not in backend yet
      }
      
      setStore(transformedStore)
      
      // Set user rating if available
      if (transformedStore.userRating) {
        setUserRating(transformedStore.userRating)
        setDraft(transformedStore.userRating)
        setHasSaved(true)
      }
      
    } catch (err) {
      console.error('Failed to fetch store details:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to extract city from address
  const extractCityFromAddress = (address) => {
    if (!address) return "Unknown"
    const parts = address.split(',')
    return parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim()
  }

  useEffect(() => {
    if (storeId) {
      fetchStoreDetails()
    }
  }, [storeId])

  // Handle rating submission
  const handleSave = async () => {
    if (draft === 0) return
    
    try {
      setIsSubmittingRating(true)
      
      await makeAuthenticatedRequest('/user/rating', {
        method: 'POST',
        body: JSON.stringify({
          storeId: parseInt(storeId),
          rating: draft
        })
      })
      
      setUserRating(draft)
      setHasSaved(true)
      
      // Refresh store data to get updated average rating
      await fetchStoreDetails()
      
    } catch (error) {
      console.error('Failed to submit rating:', error)
      setError('Failed to submit rating. Please try again.')
      // Reset to previous rating on error
      setDraft(userRating)
    } finally {
      setIsSubmittingRating(false)
    }
  }

  // Handle rating cancel
  const handleClear = () => {
    setUserRating(0)
    setDraft(0)
    setHasSaved(false)
    // Note: You might want to add a backend endpoint to delete ratings
    // For now, this just clears the local state
  }

  if (loading) {
    return (
      <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-muted-foreground">Loading store details...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}>
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>
        
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="mt-4 space-x-2">
          <Button onClick={fetchStoreDetails}>Try Again</Button>
          <Button variant="outline" onClick={onBack}>
            Back to Stores
          </Button>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}>
        <Button 
          variant="ghost" 
          onClick={() => onClick={onBack}}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>
        
        <Alert>
          <AlertDescription>Store not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 py-8 md:py-10", className)}>
      {/* Back button */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Stores
      </Button>

      <div className="grid gap-8 md:grid-cols-[360px,1fr]">
        {/* Left: Store image */}
        <div className="relative overflow-hidden rounded-xl bg-muted">
          <img
            src={store.imageUrl}
            alt={`${store.name} storefront`}
            title={`${store.name} storefront`}
            className="h-full w-full object-cover aspect-square"
          />
        </div>

        {/* Right: Main details and rating actions */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-pretty">{store.name}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {store.city}
              </span>
              {store.city && store.address && <Separator orientation="vertical" className="h-4" />}
              {store.address && <span className="truncate">{store.address}</span>}
              <Separator orientation="vertical" className="h-4" />
              <span>
                Overall rating: <span className="font-medium text-foreground">{store.overallRating.toFixed(1)}</span> / 5
              </span>
              {typeof store.ratingCount === "number" && <span>({store.ratingCount} reviews)</span>}
            </div>
            {store.email && (
              <div className="mt-1 text-sm text-muted-foreground">
                Contact: {store.email}
              </div>
            )}
          </div>

          {/* Rating interaction row */}
          <section aria-labelledby="your-rating" className="rounded-lg border p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 id="your-rating" className="text-base font-medium">Your rating</h2>
                <p className="text-sm text-muted-foreground">
                  Click the stars to select a rating. You can update it anytime.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <RatingStars
                  value={draft}
                  onChange={(val) => setDraft(val)}
                  size={24}
                  readOnly={isSubmittingRating}
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
                disabled={draft === 0 || isSubmittingRating || (hasSaved && draft === userRating)}
                className="bg-black text-white hover:bg-black/90"
                aria-label={hasSaved ? "Update rating" : "Submit rating"}
              >
                {isSubmittingRating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  hasSaved ? "Update Rating" : "Submit Rating"
                )}
              </Button>
              {hasSaved ? <Badge variant="secondary">Saved</Badge> : <Badge variant="outline">Not submitted</Badge>}
              {hasSaved && (
                <Button 
                  variant="ghost" 
                  className="text-muted-foreground" 
                  onClick={handleClear}
                  disabled={isSubmittingRating}
                >
                  Clear my rating
                </Button>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground" aria-live="polite">
              Your submitted rating: <span className="font-medium">{userRating > 0 ? `${userRating}/5` : "Not yet submitted"}</span>
            </p>
          </section>

          {/* Details below */}
          <section aria-labelledby="about-store" className="space-y-3">
            <h3 id="about-store" className="text-base font-semibold">About this store</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {store.description}
            </p>
            {store.categories && store.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {store.categories.map((c) => (
                  <Badge key={c} variant="outline">{c}</Badge>
                ))}
              </div>
            )}
          </section>

          <Separator />

          <section aria-labelledby="hours" className="space-y-2">
            <h3 id="hours" className="text-base font-semibold">Hours</h3>
            <p className="text-sm text-muted-foreground">{store.hours}</p>
          </section>

          <Separator />

          <section aria-labelledby="contact" className="space-y-2">
            <h3 id="contact" className="text-base font-semibold">Contact Information</h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Address:</strong> {store.address}</p>
              <p><strong>Email:</strong> {store.email}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}