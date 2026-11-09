"use client"

import Link from "next/link"
import { ChevronRight, Package, Settings, ShieldCheck, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const actions = [
  { label: "View products", href: "/products", icon: Package },
  { label: "Manage staff", href: "/staff", icon: Users },
  { label: "Roles", href: "/roles", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function QuickActions() {
  return (
    <Card className="border-border/70 shadow-none">
      <CardHeader>
        <CardTitle className="text-base">Quick actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col items-start gap-2 rounded-lg border border-border/70 bg-background p-3 text-sm font-medium transition-colors hover:bg-muted"
              >
                <div className="flex w-full items-center justify-between">
                  <Icon className="size-4 text-muted-foreground" />
                  <ChevronRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                {action.label}
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
