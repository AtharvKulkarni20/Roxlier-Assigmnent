import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Star, MessageSquare, Calendar, User, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RatingsTable({ ratings }) {
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
      <div className="rounded-xl border  p-16 text-center">
        <div className="mx-auto mb-6 w-20 h-20  rounded-full flex items-center justify-center shadow-lg">
          <MessageSquare className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-3">No customer reviews yet</h3>
        <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
          When customers rate your store, their valuable feedback and reviews will be displayed here to help you understand their experience.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border  overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 hover:bg-slate-50 border-b border-slate-200">
            <TableHead className="font-semibold text-slate-900 py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 " />
                Customer
              </div>
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 " />
                Email
              </div>
            </TableHead>
            <TableHead className="font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                Rating
              </div>
            </TableHead>
            <TableHead className="hidden lg:table-cell font-semibold text-slate-900">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-green-600" />
                Feedback
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-900">
              <div className="flex items-center justify-end gap-2">
                <Calendar className="h-4 w-4 " />
                Date
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ratings.map((r, index) => (
            <TableRow key={r.id} className="hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-b-0">
              <TableCell className="py-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12  rounded-xl flex items-center justify-center border-black border-1 font-bold text-sm shadow-lg">
                    {r.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-base">{r.name}</p>
                    <p className="text-sm text-slate-500 md:hidden">{r.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-slate-600">
                <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                  <code className="text-sm">{r.email}</code>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={
                          i < r.rating
                            ? "h-5 w-5 text-amber-400 fill-amber-400"
                            : "h-5 w-5 text-slate-300"
                        }
                      />
                    ))}
                  </div>
                  <Badge variant="outline" className={cn("text-sm font-bold px-2 py-1", getRatingColor(r.rating))}>
                    {r.rating}.0
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="hidden lg:table-cell max-w-[400px]">
                {r.comment ? (
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-sm text-slate-700 leading-relaxed">{r?.comment}</p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <span className="text-slate-400 italic text-sm">No comment provided</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatDate(r.date)}</p>
                  <p className="text-xs text-slate-500">
                    {Math.floor(Math.abs(new Date(r.date) - new Date()) / (1000 * 60 * 60 * 24))} days ago
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