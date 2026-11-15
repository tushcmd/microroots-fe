import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Consistent hero band for interior pages: eyebrow, title, description and an
 * optional row of calls to action.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  eyebrow?: string
  title: string
  description?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <section className={cn("border-b border-border/70 bg-muted/20", className)}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="max-w-2xl">
          {eyebrow && <p className="text-sm font-medium text-primary">{eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
          {children && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}