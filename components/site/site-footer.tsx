import Link from "next/link"
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import { SiteBrand } from "@/components/site/site-brand"
import { footerNavGroups, site, telLink, whatsappLink } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border/70 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2fr]">
          <div>
            <SiteBrand />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Cut-to-order and living-tray microgreens grown in controlled Nairobi grow rooms,
              delivered fresh to kitchens and homes across the city.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-primary" aria-hidden="true" />
                {site.contact.location}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={telLink()} className="hover:text-foreground">
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="hover:text-foreground">
                  {site.contact.email}
                </a>
              </li>
            </ul>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Chat on WhatsApp
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNavGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  {group.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. Grown fresh in Nairobi.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {site.contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {social.label}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ))}
            <Link
              href="/login"
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Staff login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}