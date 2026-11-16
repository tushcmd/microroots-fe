// Central storefront configuration.
//
// Everything a customer needs to reach the farm lives here so it can be
// updated in one place. Contact values below are placeholders — replace them
// with the farm's real details before launch.

export interface NavLink {
  href: string
  label: string
}

export interface SocialLink {
  label: string
  href: string
}

export const site = {
  name: "MicroRootsKe",
  shortName: "MicroRoots",
  tagline: "Fresh microgreens, grown in Nairobi",
  description:
    "Cut-to-order and living-tray microgreens grown in controlled Nairobi grow rooms, delivered fresh to kitchens and homes across the city.",
  url: "https://microroots.co.ke",
  locale: "en_KE",
  contact: {
    // TODO: replace placeholders with real details before launch.
    whatsappDisplay: "+254 700 000 000",
    phoneDisplay: "+254 700 000 000",
    email: "hello@microroots.co.ke",
    location: "Nairobi, Kenya",
    hours: "Mon–Sat, 8:00am–6:00pm EAT",
    socials: [
      { label: "Instagram", href: "https://instagram.com/microrootske" },
      { label: "TikTok", href: "https://tiktok.com/@microrootske" },
      { label: "Facebook", href: "https://facebook.com/microrootske" },
    ] satisfies SocialLink[],
  },
  // Digits only, with country code, for wa.me links.
  whatsappNumber: "254700000000",
  // Details used on the legal pages (Privacy, Terms, Cookies). Sourced from
  // the website legal documentation prepared for MicroRootsKE.
  legal: {
    controller: "MicroRootsKE",
    operator: "Alexander D. Maina Karanja",
    email: "alexanderdavid254@gmail.com",
    phoneDisplay: "+254 727 590 752",
    phoneDial: "+254727590752",
    website: "https://microrootske.odoo.com/",
    location: "Nairobi, Kenya",
    updatedAt: "16 November 2026",
    supervisoryAuthority: "Office of the Data Protection Commissioner",
    supervisoryAuthorityUrl: "https://www.odpc.go.ke",
  },
} as const

export const navLinks: NavLink[] = [
  { href: "/shop", label: "Shop" },
  { href: "/harvest-club", label: "Harvest Club" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/about", label: "Our farm" },
  { href: "/faq", label: "FAQ & Care" },
  { href: "/contact", label: "Contact" },
]

export const footerNavGroups: { title: string; links: NavLink[] }[] = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All microgreens" },
      { href: "/shop?form=living-tray", label: "Living trays" },
      { href: "/harvest-club", label: "Harvest Club subscriptions" },
      { href: "/pairing", label: "Pairing tool" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/about", label: "Our farm" },
      { href: "/faq", label: "FAQ & care guide" },
      { href: "/contact", label: "Delivery & contact" },
    ],
  },
  {
    title: "Trade",
    links: [
      { href: "/wholesale", label: "Wholesale & chefs" },
      { href: "/wholesale#price-sheet", label: "Price sheet" },
      { href: "/contact", label: "Get in touch" },
    ],
  },
]

/**
 * Build a WhatsApp deep link. Optionally prefill a message so customers land
 * in a chat with the order already drafted.
 */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${site.whatsappNumber}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

/** tel: link for the farm phone number. */
export function telLink(): string {
  return `tel:+${site.whatsappNumber}`
}