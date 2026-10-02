"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Settings,
  ShieldCheck,
  Sprout,
  Users,
  Warehouse,
  X,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brand } from "./brand"

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Batches & Trays", href: "/batches", icon: Sprout },
  { label: "Inventory", href: "/products", icon: Warehouse, badge: "7" },
  { label: "Products", href: "/products", icon: Package },
  { label: "Staff", href: "/staff", icon: Users },
  { label: "Roles", href: "/roles", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-[260px] flex-col border-r bg-background p-4 transition-transform lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between">
        <Brand />
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X />
        </Button>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const selected = pathname === item.href
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="size-[18px]" />
              {item.label}
              {item.badge && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="rounded-xl border bg-muted/40 p-3">
        <p className="text-xs font-semibold">Need help?</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Check the API docs for integration support.
        </p>
        <Button variant="link" className="h-auto px-0 pt-2 text-xs">
          View documentation
        </Button>
      </div>
    </aside>
  )
}
