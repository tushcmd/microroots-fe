import { NextResponse } from "next/server"
import { getCatalog } from "@/lib/catalog"
import { buildPdf, type PdfLine } from "@/lib/server/pdf"
import { site } from "@/lib/site"

// Node.js runtime: we build a binary PDF buffer.
export const runtime = "nodejs"

const WHOLESALE_DISCOUNT = 0.8

export async function GET() {
  const products = getCatalog()

  const lines: PdfLine[] = [
    { text: "MicroRootsKe — Wholesale Price Sheet", size: 20, bold: true, gap: 26 },
    { text: "Cut-to-order microgreens & living trays, grown in Nairobi", size: 11, gap: 20 },
    { text: "Wholesale pricing per unit. Retail price shown for reference.", size: 10, gap: 18 },
  ]

  for (const product of products) {
    const wholesale = Math.round(product.priceKes * WHOLESALE_DISCOUNT)
    lines.push({
      text: `${product.name} (${product.unitLabel}) — KES ${wholesale}`,
      size: 11,
      gap: 15,
    })
    lines.push({
      text: `  Retail KES ${product.priceKes}  ·  ${product.flavour.slice(0, 2).join(", ")}`,
      size: 9,
      gap: 18,
    })
  }

  lines.push(
    { text: "Volume tiers & standing orders available", size: 11, bold: true, gap: 16 },
    { text: "Delivery across Nairobi on a weekly schedule; invoicing for trade accounts.", size: 10, gap: 18 },
    { text: `Order: WhatsApp ${site.contact.whatsappDisplay}  ·  ${site.contact.email}`, size: 10, gap: 16 },
    { text: site.url, size: 10, gap: 16 },
    { text: "Prices valid for the current season. Ask for a tailored quote for your kitchen.", size: 9, gap: 0 },
  )

  const pdf = buildPdf(lines)

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="microroots-wholesale-price-sheet.pdf"',
      "Cache-Control": "public, max-age=3600",
    },
  })
}