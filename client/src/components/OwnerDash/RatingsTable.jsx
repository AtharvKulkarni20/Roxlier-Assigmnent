import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Star } from "lucide-react"

export function RatingsTable({ ratings }) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableCaption>A list of users who rated your store.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead className="hidden md:table-cell">Comment</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.userName}</TableCell>
              <TableCell className="hidden md:table-cell">{r.userEmail}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < r.rating
                            ? "h-4 w-4 text-amber-500 fill-amber-500"
                            : "h-4 w-4 text-muted-foreground"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{r.rating}/5</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-[320px] truncate">
                {r.comment || "—"}
              </TableCell>
              <TableCell className="text-right">{r.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
