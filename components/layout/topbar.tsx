"use client"

import { useRouter } from "next/navigation"
import { ChevronDown, LogOut, Menu, UserCog } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { staffLogout } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import { displayInitials, displayText } from "@/lib/display"

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { session, logout } = useAuth()
  const router = useRouter()
  if (!session) return null

  const displayName = displayText(session.name, "Staff")
  const initials = displayInitials(session.name?.split(" ")[0], session.name?.split(" ")[1], displayName)

  async function handleSignOut() {
    try {
      await staffLogout(session!.token)
    } finally {
      logout()
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/90 px-5 backdrop-blur sm:px-8">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
          <Menu />
        </Button>
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-auto gap-3 px-2 py-1.5" />}>
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-left sm:block">
            <span className="block text-sm font-medium">{displayName}</span>
            <span className="block text-xs text-muted-foreground">{displayText(session.role, "Staff")}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <UserCog /> Profile settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut /> Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
