"use client"

import { useMemo, useState } from "react"
import { MessageCircle, PackageSearch, Search, SlidersHorizontal } from "lucide-react"
import { ProductCard } from "@/components/site/product-card"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CATEGORIES, getCatalog, type CatalogProduct } from "@/lib/catalog"
import { site, whatsappLink } from "@/lib/site"
import { cn } from "@/lib/utils"

type Category = "All" | CatalogProduct["category"]
type Sort = "featured" | "price-asc" | "price-desc" | "name"

const SORT_LABELS: Record<Sort, string> = {
  featured: "Featured",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  name: "Name: A–Z",
}

export function ShopBrowser({
  initialForm,
  initialQuery = "",
}: {
  initialForm?: "cut" | "living-tray"
  initialQuery?: string
}) {
  const products = useMemo(() => getCatalog(), [])
  const [category, setCategory] = useState<Category>(
    initialForm === "living-tray" ? "Living trays" : "All",
  )
  const [query, setQuery] = useState(initialQuery)
  const [sort, setSort] = useState<Sort>("featured")

  const categories: Category[] = ["All", ...CATEGORIES]

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = products.filter((product) => {
      if (category !== "All" && product.category !== category) return false
      if (!q) return true
      return (
        product.name.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.flavour.join(" ").toLowerCase().includes(q) ||
        product.pairsWith.join(" ").toLowerCase().includes(q)
      )
    })

    const sorted = [...filtered]
    if (sort === "price-asc") sorted.sort((a, b) => a.priceKes - b.priceKes)
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceKes - a.priceKes)
    else if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name))
    else
      sorted.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      )

    return sorted
  }, [products, category, query, sort])

  return (
    <div>
      {/* Filter bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search greens, flavours or pairings…"
              aria-label="Search products"
              className="pl-8"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal
              className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              aria-label="Sort products"
              className="h-8 w-full appearance-none rounded-lg border border-input bg-transparent pr-8 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-48"
            >
              {(Object.keys(SORT_LABELS) as Sort[]).map((value) => (
                <option key={value} value={value}>
                  {SORT_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              aria-pressed={category === value}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                category === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {visible.length} {visible.length === 1 ? "product" : "products"}
          {category !== "All" ? ` in ${category}` : ""}
        </p>
      </div>

      {/* Grid / empty */}
      {visible.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <PackageSearch className="size-6" aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-base font-medium">No matches just yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Try a different flavour or clear the filters. Or message us and we’ll point you to
            something in season.
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setCategory("All")
                setQuery("")
              }}
              className={buttonVariants({ variant: "outline" })}
            >
              Clear filters
            </button>
            <a
              href={whatsappLink("Hi MicroRootsKe! Can you help me choose some microgreens?")}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants()}
            >
              <MessageCircle aria-hidden="true" />
              Ask us on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Ordering note */}
      <div className="mt-12 flex flex-col items-start gap-4 rounded-xl bg-muted/30 p-6 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-medium">How ordering works</h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Tap <span className="font-medium text-foreground">Order</span> on any product to open
            WhatsApp with your order pre-filled. We confirm availability and your delivery day
            before you pay. Need a hand choosing?{" "}
            <a
              href={whatsappLink(`Hi ${site.name}! I'd like help choosing microgreens.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2"
            >
              Message us
            </a>
            .
          </p>
        </div>
        <a
          href={whatsappLink("Hi MicroRootsKe! I'd like to place an order.")}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: "lg" })}
        >
          <MessageCircle aria-hidden="true" />
          Order on WhatsApp
        </a>
      </div>
    </div>
  )
}