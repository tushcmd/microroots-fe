import Link from "next/link"
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { site } from "@/lib/site"

export interface LegalBlock {
  type: "p" | "ul"
  text?: string
  items?: string[]
}

export interface LegalSection {
  /** Anchor id, e.g. "collect". */
  id: string
  /** Section number label, e.g. "1.2". */
  number: string
  heading: string
  blocks: LegalBlock[]
}

interface LegalDocumentProps {
  title: string
  intro: string[]
  sections: LegalSection[]
}

export function LegalDocument({ title, intro, sections }: LegalDocumentProps) {
  const legal = site.legal

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-border/70 pb-6">
        <p className="text-sm font-medium text-primary">Legal</p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight text-balance sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {legal.updatedAt}</p>
      </header>

      {intro.length > 0 && (
        <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {intro.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      )}

      <nav
        aria-label="On this page"
        className="mt-8 rounded-xl bg-muted/30 p-5 ring-1 ring-foreground/10"
      >
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          On this page
        </p>
        <ol className="mt-2 grid gap-1 sm:grid-cols-2">
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="text-sm text-foreground/80 transition-colors hover:text-primary"
              >
                <span className="text-muted-foreground">{section.number}</span> {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-lg font-medium tracking-tight">
              <span className="text-muted-foreground">{section.number}</span> {section.heading}
            </h2>
            <div className="mt-3 space-y-3">
              {section.blocks.map((block, index) =>
                block.type === "ul" ? (
                  <ul
                    key={index}
                    className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-primary/60 sm:text-base"
                  >
                    {block.items?.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p
                    key={index}
                    className="text-sm leading-relaxed text-muted-foreground sm:text-base"
                  >
                    {block.text}
                  </p>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        <h2 className="text-base font-medium">Contact &amp; data requests</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          For any question about this policy or to exercise your data rights, contact the data
          controller:
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
            {legal.location}
          </li>
          <li className="flex items-center gap-2">
            <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <a href={`tel:${legal.phoneDial}`} className="hover:text-primary">
              {legal.phoneDisplay}
            </a>
          </li>
          <li className="flex items-center gap-2">
            <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <a href={`mailto:${legal.email}`} className="break-all hover:text-primary">
              {legal.email}
            </a>
          </li>
        </ul>
        <Link
          href="/contact"
          className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}
        >
          Go to contact page
        </Link>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to home
        </Link>
      </div>
    </article>
  )
}