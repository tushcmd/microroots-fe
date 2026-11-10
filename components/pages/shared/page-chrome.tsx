"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function PageRoot({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn("flex flex-col gap-6", className)}>{children}</div>
}

export function PageHeader({
  title,
  eyebrow,
  description,
  children,
  className,
}: {
  title: string
  eyebrow?: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 sm:flex-row sm:items-start",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow && (
          <p className="text-sm text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
    </div>
  )
}
