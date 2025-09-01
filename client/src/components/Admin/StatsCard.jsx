import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StatsCards({ users, stores, admin }) {
  const items = [
    { label: "Users", value: users },
    { label: "Stores", value: stores },
    { label: "Admin", value: admin },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => (
        <Card key={it.label} className="rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">{it.label}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-3xl font-semibold">{it.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
