"use client"

import { useEffect, useState } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className={cn("h-9 w-[132px] rounded-lg bg-muted/50", className)} />
  }

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1", className)}>
      {options.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <Button
            key={value}
            type="button"
            variant={active ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-7 gap-1.5 px-2.5 text-xs shadow-none",
              active ? "bg-background" : "text-muted-foreground",
            )}
            onClick={() => setTheme(value)}
            aria-pressed={active}
          >
            <Icon className="size-3.5" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
