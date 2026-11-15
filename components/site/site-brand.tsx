import Link from "next/link"
import { Sprout } from "lucide-react"
import { cn } from "@/lib/utils"
import { site } from "@/lib/site"

export function SiteBrand({
  className,
  showTagline = true,
}: {
  className?: string
  showTagline?: boolean
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} home`}
      className={cn(
        "group flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:-rotate-3">
        <Sprout className="size-5" aria-hidden="true" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-sm font-medium tracking-tight">
          MicroRoots<span className="text-primary">Ke</span>
        </span>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
            Fresh microgreens
          </span>
        )}
      </span>
    </Link>
  )
}