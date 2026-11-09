"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { useAuth } from "@/lib/auth-context"

const titleByPath: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/staff": "Staff",
  "/products": "Products",
  "/roles": "Roles",
  "/settings": "Settings",
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !session) router.replace("/login")
  }, [isLoading, session, router])

  if (isLoading || !session) {
    return <div className="flex min-h-screen items-center justify-center bg-muted/20" />
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-[240px]">
        <Topbar title={titleByPath[pathname] ?? "Dashboard"} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto max-w-[1500px] p-5 sm:p-8">{children}</main>
      </div>
    </div>
  )
}
