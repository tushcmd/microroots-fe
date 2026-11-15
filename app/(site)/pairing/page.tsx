import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/site/page-hero"
import { PairingTool } from "@/components/site/pairing-tool"
import { buttonVariants } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "AI pairing tool",
  description:
    "Type a meal and get a microgreen recommendation from MicroRootsKe. A quick way to find the right greens for any dish.",
}

export default function PairingPage() {
  return (
    <>
      <PageHero eyebrow="Pairing tool" title="Type a meal, get a microgreen.">
        <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Not sure which greens to reach for? Describe what you’re cooking and we’ll suggest a
          microgreen that fits — with a quick reason and a way to order it.
        </p>
      </PageHero>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <PairingTool />
      </section>

      <section className="border-t border-border/70 bg-muted/20">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-medium tracking-tight">Found your match?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse the full range of cut-to-order microgreens and living trays.
            </p>
          </div>
          <Link href="/shop" className={buttonVariants()}>
            Shop all microgreens
          </Link>
        </div>
      </section>
    </>
  )
}