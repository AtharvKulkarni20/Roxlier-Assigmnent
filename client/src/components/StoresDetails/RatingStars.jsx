"use client"

import { Star } from "lucide-react"
import * as React from "react"
import { cn } from "@/lib/utils"

const sizes = {
  sm: 16,
  md: 22,
  lg: 28,
}

export function RatingStars({ value, onChange, readOnly = false, size = "md", className, ...rest }) {
  const [hover, setHover] = React.useState(null)
  const interactive = !readOnly && typeof onChange === "function"
  const dimension = sizes[size]

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role={interactive ? "slider" : "img"}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? 5 : undefined}
      aria-valuenow={interactive ? value : undefined}
      {...rest}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const current = i + 1
        const active = (hover ?? value) >= current
        return (
          <button
            key={current}
            type="button"
            className={cn("p-0.5", interactive ? "cursor-pointer" : "cursor-default")}
            onMouseEnter={() => interactive && setHover(current)}
            onMouseLeave={() => interactive && setHover(null)}
            onClick={() => interactive && onChange?.(current)}
            aria-label={`Rate ${current} star${current > 1 ? "s" : ""}`}
            disabled={!interactive}
          >
            <Star
              width={dimension}
              height={dimension}
              className={cn(active ? "fill-amber-400 text-amber-400" : "text-muted-foreground", "transition-colors")}
            />
          </button>
        )
      })}
      <span className="sr-only">{`Current rating ${value} out of 5`}</span>
    </div>
  )
}
