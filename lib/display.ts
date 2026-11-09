export function displayText(value: string | number | null | undefined, fallback = "—") {
  if (value == null) return fallback
  const text = String(value).trim()
  return text || fallback
}

export function displayName(
  first: string | null | undefined,
  last: string | null | undefined,
  fallback: string,
) {
  return `${first ?? ""} ${last ?? ""}`.trim() || fallback
}

export function displayInitials(
  first: string | null | undefined,
  last: string | null | undefined,
  fallback: string,
) {
  const a = first?.[0]
  const b = last?.[0]
  if (a || b) return `${a ?? ""}${b ?? ""}`
  return fallback[0]?.toUpperCase() ?? "?"
}

export function asNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) ? n : null
}

export function formatKes(value: number | string | null | undefined) {
  const n = asNumber(value)
  return n == null ? "—" : `KES ${n.toLocaleString()}`
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
}
