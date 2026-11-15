import type { Metadata } from "next"
import { PageHero } from "@/components/site/page-hero"
import { ShopBrowser } from "@/components/site/shop-browser"

export const metadata: Metadata = {
  title: "Shop microgreens",
  description:
    "Shop cut-to-order microgreens and living trays from MicroRootsKe. Filter by variety, flavour and pairing, then order via WhatsApp for Nairobi delivery.",
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const form = params.form === "living-tray" ? "living-tray" : undefined
  const query = typeof params.q === "string" ? params.q : undefined

  return (
    <>
      <PageHero eyebrow="Shop" title="Fresh harvest, cut to order.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Browse cut-to-order microgreens, chef blends and living trays. Filter by flavour or
          pairing, then order directly on WhatsApp — we harvest after you order and deliver on your
          area’s day.
        </p>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <ShopBrowser initialForm={form} initialQuery={query} />
      </section>
    </>
  )
}