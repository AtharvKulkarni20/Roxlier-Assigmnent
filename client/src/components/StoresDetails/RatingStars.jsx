"use client"

import React, { useState } from "react"
import { Star } from "lucide-react"

export function RatingStars({ value, onChange, max = 5, size = 22, readOnly = false, ...rest }) {
  const [hover, setHover] = useState(null)
  const stars = Array.from({ length: max }, (_, i) => i + 1)
  const active = hover ?? value

  return (
    <div className="flex items-center gap-1" role="group" {...rest}>
      {stars.map((n) => {
        const filled = n <= active
        return (
          <button
            key={n}
            type="button"
            className="p-0.5"
            aria-label={`Rate ${n} out of ${max}`}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(null)}
            onClick={() => !readOnly && onChange?.(n)}
            disabled={readOnly}
          >
            <Star
              width={size}
              height={size}
              className={filled ? "fill-amber-500 stroke-amber-500" : "stroke-amber-500"}
            />
          </button>
        )
      })}
      <span className="ml-2 text-sm text-muted-foreground">{value.toFixed(1)}</span>
    </div>
  )
}
