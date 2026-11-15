// Minimal, dependency-free PDF generator.
//
// Produces a single US-A4 page of text using the standard Helvetica fonts.
// This is enough for a downloadable price sheet without pulling in a PDF
// library. Each line is absolutely positioned from the top of the page.

export interface PdfLine {
  text: string
  /** Font size in points (default 11). */
  size?: number
  bold?: boolean
  /** Vertical gap after the line in points (default size + 6). */
  gap?: number
}

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const MARGIN = 56
const TOP_Y = PAGE_HEIGHT - MARGIN

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
}

export function buildPdf(lines: PdfLine[]): Buffer {
  const ops: string[] = []
  let y = TOP_Y

  for (const line of lines) {
    const size = line.size ?? 11
    const font = line.bold ? "F2" : "F1"
    const gap = line.gap ?? size + 6
    ops.push(
      `BT /${font} ${size} Tf 1 0 0 1 ${MARGIN} ${Math.round(y)} Tm (${escapePdfText(
        line.text,
      )}) Tj ET`,
    )
    y -= gap
  }

  const content = ops.join("\n")

  const objects: string[] = []
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>"
  objects[2] = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
  objects[3] =
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
    `/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`
  objects[4] =
    `<< /Length ${Buffer.byteLength(content, "ascii")} >>\nstream\n${content}\nendstream`
  objects[5] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"
  objects[6] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"

  let pdf = "%PDF-1.4\n"
  const offsets: number[] = []
  const objectCount = 6

  for (let i = 1; i <= objectCount; i++) {
    offsets[i] = Buffer.byteLength(pdf, "ascii")
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`
  }

  const xrefOffset = Buffer.byteLength(pdf, "ascii")
  pdf += `xref\n0 ${objectCount + 1}\n`
  pdf += "0000000000 65535 f \n"
  for (let i = 1; i <= objectCount; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`
  }
  pdf += `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`

  return Buffer.from(pdf, "ascii")
}