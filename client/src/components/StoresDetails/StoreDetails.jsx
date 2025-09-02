"use client";

import React, { useState, useEffect } from "react";
import { RatingStars } from "./RatingStars";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, ArrowLeft, Loader2, Mail, Clock, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// API helper function - FIXED: Use same base URL as StoresPage
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  };

  const response = await fetch(`http://localhost:5001/api${url}`, config);
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw new Error("Authentication failed. Please login again.");
    }
    throw new Error(data.error || "Request failed");
  }

  return data;
};

export default function StoreDetails({ storeId, onBack, className }) {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [draft, setDraft] = useState(0);
  const [hasSaved, setHasSaved] = useState(false);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Fetch store details
  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all stores and find the specific one
      const data = await makeAuthenticatedRequest("/user/stores");
      const storeData = data.stores.find((s) => s.id.toString() === storeId);

      if (!storeData) {
        setError("Store not found");
        return;
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
        logoUrl: `/placeholder.svg?height=120&width=120&query=${encodeURIComponent(
          storeData.name
        )}%20logo`,
        imageUrl: `/placeholder.svg?height=400&width=1200&query=${encodeURIComponent(
          storeData.name
        )}%20banner%20storefront`,
        city: extractCityFromAddress(storeData.address),
        description: `${storeData.name} is located at ${storeData.address}. Contact them at ${storeData.email} for more information.`,
        categories: ["Store"], // Default category since not in backend yet
        hours: "Mon–Sun: 9:00 AM – 9:00 PM", // Default hours since not in backend yet
      };

      setStore(transformedStore);

      // Set user rating if available
      if (transformedStore.userRating) {
        setUserRating(transformedStore.userRating);
        setDraft(transformedStore.userRating);
        setHasSaved(true);
      }
    } catch (err) {
      console.error("Failed to fetch store details:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract city from address
  const extractCityFromAddress = (address) => {
    if (!address) return "Unknown";
    const parts = address.split(",");
    return parts.length > 1 ? parts[parts.length - 2].trim() : parts[0].trim();
  };

  useEffect(() => {
    if (storeId) {
      fetchStoreDetails();
    }
  }, [storeId]);

  // Handle rating submission
  const handleSave = async () => {
    if (draft === 0) return;

    try {
      setIsSubmittingRating(true);

      await makeAuthenticatedRequest("/user/rating", {
        method: "POST",
        body: JSON.stringify({
          storeId: parseInt(storeId),
          rating: draft,
        }),
      });

      setUserRating(draft);
      setHasSaved(true);

      // Refresh store data to get updated average rating
      await fetchStoreDetails();
    } catch (error) {
      console.error("Failed to submit rating:", error);
      setError("Failed to submit rating. Please try again.");
      // Reset to previous rating on error
      setDraft(userRating);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  // Handle rating cancel
  const handleClear = () => {
    setUserRating(0);
    setDraft(0);
    setHasSaved(false);
    // Note: You might want to add a backend endpoint to delete ratings
    // For now, this just clears the local state
  };

  if (loading) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
          className
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <div className="flex items-center justify-center py-32">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600" />
              <p className="mt-4 text-lg text-slate-600">
                Loading store details...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
          className
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Alert variant="destructive">
              <AlertDescription className="text-base">{error}</AlertDescription>
            </Alert>

            <div className="mt-6 space-x-3">
              <Button
                onClick={fetchStoreDetails}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Try Again
              </Button>
              <Button variant="outline" onClick={onBack}>
                Back to Stores
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div
        className={cn(
          "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
          className
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-6 hover:bg-white/60"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Stores
          </Button>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <Alert>
              <AlertDescription className="text-base">
                Store not found
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-50 to-blue-50",
        className
      )}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-6">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 hover:bg-white/60 text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Stores
        </Button>

        {/* Main content card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Banner image section */}
          <div className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-700">
            <img
              src={store.imageUrl}
              alt={`${store.name} banner`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/banner.png"; // fallback if image is missing/broken
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Logo positioned at bottom left of banner */}
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                <img
                  src={store.logoUrl}
                  alt={`${store.name} logo`}
                  onError={(e) => {
                    e.target.src = "/default.png"; // fallback if image is missing/broken
                  }}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl bg-white object-cover"
                />
              </div>
            </div>
          </div>

          {/* Content section with top padding for logo overlap */}
          <div className="px-8 pt-20 pb-8">
            {/* Store name and basic info */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-slate-900 mb-3">
                {store.name}
              </h1>

              {/* Location and rating info */}
              <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-4">
                <span className="flex items-center gap-2 text-lg">
                  <MapPin className="h-5 w-5 " />
                  <span className="font-medium">{store.city}</span>
                </span>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-2">
                  <RatingStars value={store.overallRating} readOnly size={20} />
                  <span className="font-semibold text-slate-900">
                    {store.overallRating.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({store.ratingCount}{" "}
                    {store.ratingCount === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </div>

              {/* Categories */}
              {store.categories && store.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {store.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="text-sm px-3 py-1"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Quick contact info */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 " />
                  {store.email}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 " />
                  {store.hours}
                </span>
              </div>
            </div>

            {/* Rating interaction section - Enhanced design */}
            <section
              aria-labelledby="your-rating"
              className="b rounded-xl border border-black-200 p-6 mb-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h2
                    id="your-rating"
                    className="text-xl font-semibold text-slate-900 mb-2"
                  >
                    Rate Your Experience
                  </h2>
                  <p className="text-slate-600">
                    Share your experience with this store. Your feedback helps
                    other customers make informed decisions.
                  </p>
                </div>

                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="flex items-center gap-4 bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-center">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Your Rating
                      </p>
                      <RatingStars
                        value={draft}
                        onChange={(val) => setDraft(val)}
                        size={28}
                        readOnly={isSubmittingRating}
                        aria-label="Select your rating"
                      />
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm font-medium text-slate-700 mb-2">
                        Score
                      </p>
                      <p className="text-2xl font-bold text-black-600">
                        {draft > 0 ? `${draft}.0` : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button
                  onClick={handleSave}
                  disabled={
                    draft === 0 ||
                    isSubmittingRating ||
                    (hasSaved && draft === userRating)
                  }
                  className=" hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
                  aria-label={hasSaved ? "Update rating" : "Submit rating"}
                >
                  {isSubmittingRating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : hasSaved ? (
                    "Update Rating"
                  ) : (
                    "Submit Rating"
                  )}
                </Button>

                <div className="flex items-center gap-3">
                  {hasSaved ? (
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 border-green-200"
                    >
                      ✓ Saved
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="border-slate-300 text-slate-600"
                    >
                      Not submitted
                    </Badge>
                  )}

                  {hasSaved && (
                    <Button
                      variant="ghost"
                      className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleClear}
                      disabled={isSubmittingRating}
                    >
                      Clear Rating
                    </Button>
                  )}
                </div>
              </div>

              <div
                className="mt-4 text-sm text-slate-600 bg-white/50 rounded-lg p-3 border border-blue-100"
                aria-live="polite"
              >
                <strong>Current Status:</strong>{" "}
                {userRating > 0
                  ? `You rated this store ${userRating}/5 stars`
                  : "You haven't rated this store yet"}
              </div>
            </section>

            {/* Content grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* About section */}
              <section
                aria-labelledby="about-store"
                className="bg-slate-50 rounded-xl p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Info className="h-5 w-5 " />
                  <h3
                    id="about-store"
                    className="text-xl font-semibold text-slate-900"
                  >
                    About This Store
                  </h3>
                </div>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {store.description}
                </p>
                {store.categories && store.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {store.categories.map((c) => (
                      <Badge
                        key={c}
                        variant="outline"
                        className="border-blue-200  bg-blue-50"
                      >
                        {c}
                      </Badge>
                    ))}
                  </div>
                )}
              </section>

              {/* Contact and hours section */}
              <div className="space-y-6">
                {/* Hours */}
                <section
                  aria-labelledby="hours"
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5" />
                    <h3
                      id="hours"
                      className="text-xl font-semibold text-slate-900"
                    >
                      Business Hours
                    </h3>
                  </div>
                  <p className="text-slate-700 font-medium">{store.hours}</p>
                </section>

                {/* Contact */}
                <section
                  aria-labelledby="contact"
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Mail className="h-5 w-5 " />
                    <h3
                      id="contact"
                      className="text-xl font-semibold text-slate-900"
                    >
                      Contact Information
                    </h3>
                  </div>
                  <div className="space-y-3 text-slate-700">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 mt-1 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-slate-600">{store.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-1 text-slate-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-slate-600">{store.email}</p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
