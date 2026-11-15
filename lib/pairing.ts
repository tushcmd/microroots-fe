// Pairing logic for the "type a meal, get a microgreen" tool.
//
// Two strategies live here:
//   1. suggestPairing() — a curated, deterministic ruleset used when no LLM
//      is configured (or as a fallback if the LLM call fails).
//   2. buildPairingPrompt() / coercePairingResult() — build and validate the
//      request/response for the LLM path in the API route.

import { getCatalog, getProduct, type CatalogProduct } from "./catalog"

export interface PairingResult {
  meal: string
  productId: string
  productName: string
  reason: string
  pairsWith: string[]
  flavour: string[]
  runnerUp?: {
    productId: string
    productName: string
    reason: string
  }
  /** "ai" when produced by the LLM, "curated" for the local ruleset. */
  mode: "ai" | "curated"
}

interface Rule {
  pattern: RegExp
  ids: string[]
  reason: string
}

// Ordered most-specific first. The first rule whose pattern matches the meal
// drives the result, so e.g. "grilled salmon" hits the fish rule (not the
// generic grilled-meat rule) and "beef tacos" hits the taco rule.
const RULES: Rule[] = [
  {
    pattern: /fish|salmon|tuna|seafood|prawn|shrimp|cod|tilapia|fishy/i,
    ids: ["radish-microgreens", "broccoli-microgreens"],
    reason: "A peppery, crisp lift that brightens delicate fish.",
  },
  {
    pattern: /taco|burrito|quesadilla|nachos|mexican|salsa|fajita/i,
    ids: ["radish-microgreens", "spicy-mix"],
    reason: "Peppery heat stands up to bold, spiced Mexican flavours.",
  },
  {
    pattern: /pizza|flatbread|wrap|burger|fries|fried|sandwich/i,
    ids: ["mild-family-blend", "broccoli-microgreens"],
    reason: "Fresh, mild greens to balance rich, cheesy or fried food.",
  },
  {
    pattern: /pasta|risotto|orzo|noodle|spaghetti|mac|lasagna|lasagne/i,
    ids: ["pea-shoots", "mild-family-blend"],
    reason: "Sweet, tender shoots balance starchy or creamy pasta.",
  },
  {
    pattern: /soup|broth|stew|ramen|congee|dal|chowder/i,
    ids: ["broccoli-microgreens", "pea-shoots"],
    reason: "Tender greens added at the end keep their crunch in warm bowls.",
  },
  {
    pattern: /egg|omelette|breakfast|brunch|toast|avocado|frittata/i,
    ids: ["broccoli-microgreens", "mild-family-blend", "sunflower-shoots"],
    reason: "Mild, fresh greens fold into eggs and toast without overpowering them.",
  },
  {
    pattern: /smoothie|juice|drink|shake|bowl|grain|quinoa|poke|salad/i,
    ids: ["sunflower-shoots", "chefs-blend", "pea-shoots"],
    reason: "Juicy, crunchy shoots add body and texture to bowls and salads.",
  },
  {
    pattern: /dessert|sweet|cake|chocolate|pancake|waffle/i,
    ids: ["pea-shoots"],
    reason: "Sweet pea shoots add a fresh, green counterpoint to something sweet.",
  },
  {
    pattern: /spicy|hot|chilli|chili|heat|curry|harissa|sichuan|buffalo/i,
    ids: ["mild-family-blend", "broccoli-microgreens"],
    reason: "Cooling, mild greens help tame the heat.",
  },
  {
    pattern: /chicken|poultry|turkey|duck/i,
    ids: ["mild-family-blend", "chefs-blend"],
    reason: "A balanced blend that complements lean poultry.",
  },
  {
    pattern: /steak|beef|lamb|roast|grill|bbq|barbecue|kebab|pork|meat/i,
    ids: ["chefs-blend", "radish-microgreens", "spicy-mix"],
    reason: "Peppery, bold greens cut through rich, grilled meat.",
  },
]

const DEFAULT_PAIRING = {
  id: "chefs-blend",
  reason: "A balanced, chef-curated blend that works with almost anything.",
}

function toResult(
  product: CatalogProduct,
  meal: string,
  reason: string,
  runnerUp?: CatalogProduct,
): PairingResult {
  return {
    meal,
    productId: product.id,
    productName: product.name,
    reason,
    pairsWith: product.pairsWith,
    flavour: product.flavour,
    runnerUp: runnerUp
      ? {
          productId: runnerUp.id,
          productName: runnerUp.name,
          reason: `Also great: ${runnerUp.tagline}`,
        }
      : undefined,
    mode: "curated",
  }
}

/**
 * Deterministic pairing from the local ruleset. Used directly when no LLM is
 * configured, and as a safety net if the LLM path fails.
 */
export function suggestPairing(meal: string): PairingResult {
  const text = meal.trim()

  for (const rule of RULES) {
    if (!rule.pattern.test(text)) continue
    const primary = rule.ids.map((id) => getProduct(id)).find(Boolean)
    if (!primary) continue
    const runnerUp = rule.ids
      .slice(1)
      .map((id) => getProduct(id))
      .find(Boolean)
    return toResult(primary, text, rule.reason, runnerUp)
  }

  // No rule matched: fall back to a keyword scan against pairsWith + tags.
  const lower = text.toLowerCase()
  const scored = getCatalog()
    .map((product) => {
      const haystack = [
        ...product.pairsWith,
        ...product.tags,
        ...product.flavour,
        product.category,
      ]
        .join(" ")
        .toLowerCase()
      const score = haystack
        .split(/\W+/)
        .filter((word) => word.length > 3 && lower.includes(word)).length
      return { product, score }
    })
    .sort((a, b) => b.score - a.score)

  const best = scored[0]?.score ? scored[0].product : undefined
  const primary = best ?? getProduct(DEFAULT_PAIRING.id) ?? getCatalog()[0]
  const reason = best
    ? `Matches the ${best.flavour.slice(0, 2).join(" and ")} notes your dish is looking for.`
    : DEFAULT_PAIRING.reason
  return toResult(primary, text, reason)
}

/** Build the chat prompt for the LLM path, grounding it in the live catalog. */
export function buildPairingPrompt(meal: string): { system: string; user: string } {
  const catalog = getCatalog().map((p) => ({
    id: p.id,
    name: p.name,
    form: p.form,
    flavour: p.flavour,
    pairsWith: p.pairsWith,
    tagline: p.tagline,
  }))

  const system = [
    "You are a microgreens pairing assistant for MicroRootsKe, a Nairobi farm.",
    "Given a meal, recommend exactly ONE product from the provided catalog.",
    "Prefer a primary pick and, when useful, a runner-up.",
    "Keep the reason to one short sentence, specific to the dish.",
    'Respond with ONLY JSON of the form: {"productId": string, "reason": string, "runnerUpId"?: string}.',
    "The productId MUST be one of the catalog ids.",
    `Catalog: ${JSON.stringify(catalog)}`,
  ].join("\n")

  const user = `What microgreen pairs best with: ${meal}`

  return { system, user }
}

/**
 * Validate and coerce raw LLM output into a PairingResult. Returns null when
 * the output is unusable (e.g. unknown product id) so the caller can fall back.
 */
export function coercePairingResult(raw: unknown, meal: string): PairingResult | null {
  if (!raw || typeof raw !== "object") return null
  const data = raw as { productId?: unknown; reason?: unknown; runnerUpId?: unknown }

  const product =
    typeof data.productId === "string" ? getProduct(data.productId) : undefined
  if (!product) return null

  const reason =
    typeof data.reason === "string" && data.reason.trim()
      ? data.reason.trim()
      : "A great match for your dish."

  const runnerUp =
    typeof data.runnerUpId === "string" ? getProduct(data.runnerUpId) : undefined

  return {
    meal: meal.trim(),
    productId: product.id,
    productName: product.name,
    reason,
    pairsWith: product.pairsWith,
    flavour: product.flavour,
    runnerUp:
      runnerUp && runnerUp.id !== product.id
        ? {
            productId: runnerUp.id,
            productName: runnerUp.name,
            reason: `Also worth trying: ${runnerUp.tagline}`,
          }
        : undefined,
    mode: "ai",
  }
}