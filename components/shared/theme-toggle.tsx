"use client"

import { useSyncExternalStore } from "react"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const icons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const

function subscribe() {
  return () => {}
}

function getNextTheme(current: string) {
  if (current === "light") return "dark"
  if (current === "dark") return "system"
  return "light"
}

export function ThemeToggle({ className, compact }: { className?: string; compact?: boolean }) {
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(subscribe, () => true, () => false)

  if (!mounted) {
    return <div className={cn("h-9 w-9 rounded-lg bg-muted/50", className)} />
  }

  const currentTheme = theme || "system"
  const Icon = icons[currentTheme as keyof typeof icons] || Monitor

  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("h-9 w-9 rounded-lg", className)}
        onClick={() => setTheme(getNextTheme(currentTheme))}
        aria-label={`Current theme: ${currentTheme}. Click to cycle.`}
      >
        <Icon className="size-5" />
      </Button>
    )
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const

  return (
    <div className={cn("inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1", className)}>
      {options.map(({ value, label, icon: OptionIcon }) => {
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
            <OptionIcon className="size-3.5" />
            {label}
          </Button>
        )
      })}
    </div>
  )
}
