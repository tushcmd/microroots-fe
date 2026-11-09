"use client"

import { useEffect, useState } from "react"
import { Toaster as Sonner } from "sonner"

export function Toaster() {
  const [position, setPosition] = useState<"bottom-right" | "top-center">("bottom-right")

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)")
    const update = () => setPosition(mq.matches ? "bottom-right" : "top-center")
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return (
    <Sonner
      position={position}
      theme="system"
      toastOptions={{ classNames: { toast: "rounded-xl border border-border/70 shadow-none" } }}
    />
  )
}