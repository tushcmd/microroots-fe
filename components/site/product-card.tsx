import { MessageCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ProductGlyph, accentPanel } from "@/components/site/product-visual"
import { whatsappLink } from "@/lib/site"
import type { CatalogProduct } from "@/lib/catalog"
import { cn } from "@/lib/utils"

function formLabel(product: CatalogProduct) {
  return product.form === "living-tray" ? "Living tray" : "Cut & packed"
}

function orderMessage(product: CatalogProduct) {
  return `Hi MicroRootsKe! I'd like to order ${product.name} (${product.unitLabel}) — KES ${product.priceKes}. Is it available?`
}

export function ProductCard({
  product,
  className,
}: {
  product: CatalogProduct
  className?: string
}) {
  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className={cn("relative flex h-30 items-center justify-center", accentPanel[product.accent])}>
        {product.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-background/85 px-2.5 py-1 text-[11px] font-medium text-foreground shadow-sm backdrop-blur">
            {product.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
          {formLabel(product)}
        </span>
        <ProductGlyph icon={product.icon} accent={product.accent} />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-medium tracking-tight">{product.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {product.tagline}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.flavour.slice(0, 3).map((note) => (
            <span
              key={note}
              className="rounded-md bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {note}
            </span>
          ))}
        </div>

        <p className="mt-3 line-clamp-1 text-[11px] text-muted-foreground">
          Pairs with {product.pairsWith.slice(0, 3).join(", ")}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-sm font-medium">KES {product.priceKes.toLocaleString()}</p>
            <p className="text-[11px] text-muted-foreground">{product.unitLabel}</p>
          </div>
          <a
            href={whatsappLink(orderMessage(product))}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: "sm" })}
            aria-label={`Order ${product.name} on WhatsApp`}
          >
            <MessageCircle aria-hidden="true" />
            Order
          </a>
        </div>
      </div>
    </article>
  )
}