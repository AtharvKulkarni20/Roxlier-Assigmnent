import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

export function AverageRatingCard({ storeName, average, count }) {
  const rounded = Math.round(average * 10) / 10
  const filledCount = Math.round(average)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-muted-foreground">Average Rating</CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div>
          <div className="text-3xl font-semibold">{rounded}</div>
          <p className="text-sm text-muted-foreground">
            {storeName} • {count} rating{count === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
                i < filledCount ? "text-amber-500 fill-amber-500" : "text-muted-foreground"
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
