"use client"

import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  StoreIcon,
  ShieldPlus,
  Settings,
  Star,
  Building2,
  Plus,
  FileBarChart,
  Flag,
  UserPlus,
  MessageSquarePlus,
} from "lucide-react"

const navMain = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/stores", label: "Stores", icon: Building2 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/owners", label: "Store Owners", icon: StoreIcon },
  { href: "/admin", label: "Reviews", icon: Star },

]

const actions = [
  { href: "/admin/adduser", label: "Add User", icon: UserPlus },
  { href: "/admin", label: "Add Review", icon: MessageSquarePlus },
]

export function Sidebar() {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-4 sticky top-0 h-screen overflow-y-auto">
        <div className="mb-4">
          <Link to="/" className="font-semibold text-lg">
            RateMate Admin
          </Link>
          <p className="text-sm text-muted-foreground">Store review website</p>
        </div>

        <ul className="space-y-1">
          {navMain.map((item) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted",
                    active && "bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-4 border-t pt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Quick actions</p>
          <ul className="space-y-1">
            {actions.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Render your dashboard pages here */}
      </main>
    </div>
  )
}
