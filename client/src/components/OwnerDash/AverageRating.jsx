import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AverageRating({ ratings }) {
  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-100 text-green-800 border-green-200"
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!ratings || ratings.length === 0) {
    return (
      <div className="rounded-xl border border-black/20 bg-white p-12 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No reviews yet</h3>
        <p className="text-slate-600">When customers rate your store, their feedback will appear here.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
      <Table>
        <TableCaption className="bg-slate-50 py-4 text-slate-600">
          Complete list of customer reviews and ratings for your store
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50">
            <TableHead className="font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-slate-900">Email</TableHead>
            <TableHead className="font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Rating
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comment
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-900">
              <div className="flex items-center justify-end gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((r, index) => (
            <TableRow key={r.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {r.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{r.userName}</p>
                    <p className="text-xs text-slate-500 md:hidden">{r.userEmail}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-slate-600">
                {r.userEmail}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < r.rating
                            ? "h-4 w-4 text-amber-400 fill-amber-400"
                            : "h-4 w-4 text-slate-300"
                        }
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className={cn("text-xs font-semibold", getRatingColor(r.rating))}>
                    {r.rating}/5
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell max-w-[320px]">
                {r.comment ? (
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">{r.comment}</p>
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No comment</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="text-right">
                  <p className="font-medium text-slate-900">{formatDate(r.date)}</p>
                  <p className="text-xs text-slate-500">
                    {Math.abs(new Date(r.date) - new Date()) / (1000 * 60 * 60 * 24) < 7 
                      ? "Recent" 
                      : "Older"}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}