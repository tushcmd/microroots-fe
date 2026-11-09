"use client"

import { Toaster as Sonner } from "sonner"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"

export function Toaster() {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      position={isDesktop ? "bottom-right" : "top-center"}
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      toastOptions={{ classNames: { toast: "rounded-xl border border-border/70 shadow-none" } }}
    />
  )
}
