"use client"

import { Toaster as Sonner } from "sonner"
import { useMediaQuery } from "@/hooks/use-media-query"

export function Toaster() {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  return (
    <Sonner
      position={isDesktop ? "bottom-right" : "top-center"}
      theme="system"
      toastOptions={{ classNames: { toast: "rounded-xl border border-border/70 shadow-none" } }}
    />
  )
}
