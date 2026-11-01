"use client"

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

export function Topbar({ title, onMenuClick }: { title: string; onMenuClick: () => void }) {
  const { session, logout } = useAuth()
  if (!session) return null

  const initials = session.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)

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
            <span className="block text-sm font-medium">{session.name}</span>
            <span className="block text-xs text-muted-foreground">{session.role}</span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem>
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
