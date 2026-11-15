import {
  Cherry,
  Citrus,
  Flame,
  Flower2,
  Leaf,
  Salad,
  Sprout,
  Wheat,
  type LucideIcon,
} from "lucide-react"
import type { CatalogProduct, ProductIcon } from "@/lib/catalog"
import { cn } from "@/lib/utils"

const iconMap: Record<ProductIcon, LucideIcon> = {
  sprout: Sprout,
  leaf: Leaf,
  salad: Salad,
  flower: Flower2,
  wheat: Wheat,
  cherry: Cherry,
  citrus: Citrus,
  flame: Flame,
}

export const accentPanel: Record<CatalogProduct["accent"], string> = {
  emerald:
    "bg-gradient-to-br from-emerald-100 via-emerald-50 to-lime-50 dark:from-emerald-950/70 dark:via-emerald-950/30 dark:to-background",
  lime: "bg-gradient-to-br from-lime-100 via-lime-50 to-emerald-50 dark:from-lime-950/70 dark:via-lime-950/30 dark:to-background",
  rose: "bg-gradient-to-br from-rose-100 via-rose-50 to-orange-50 dark:from-rose-950/70 dark:via-rose-950/30 dark:to-background",
  amber:
    "bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-50 dark:from-amber-950/70 dark:via-amber-950/30 dark:to-background",
  teal: "bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-50 dark:from-teal-950/70 dark:via-teal-950/30 dark:to-background",
  violet:
    "bg-gradient-to-br from-violet-100 via-violet-50 to-fuchsia-50 dark:from-violet-950/70 dark:via-violet-950/30 dark:to-background",
}

const accentIcon: Record<CatalogProduct["accent"], string> = {
  emerald: "text-emerald-700/80 dark:text-emerald-300/80",
  lime: "text-lime-700/80 dark:text-lime-300/80",
  rose: "text-rose-700/80 dark:text-rose-300/80",
  amber: "text-amber-700/80 dark:text-amber-300/80",
  teal: "text-teal-700/80 dark:text-teal-300/80",
  violet: "text-violet-700/80 dark:text-violet-300/80",
}

export function ProductGlyph({
  icon,
  accent,
  iconClassName,
}: {
  icon: ProductIcon
  accent: CatalogProduct["accent"]
  iconClassName?: string
}) {
  const Icon = iconMap[icon] ?? Sprout
  return (
    <Icon
      className={cn("size-14 transition-transform group-hover:scale-105", accentIcon[accent], iconClassName)}
      aria-hidden="true"
    />
  )
}