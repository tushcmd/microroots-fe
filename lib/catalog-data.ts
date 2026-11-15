// Static product catalog.
//
// This is the single source of truth the storefront reads today. When the
// backend ships a public catalog endpoint, replace the body of getCatalog()
// in lib/catalog.ts and keep this file (or swap it for a fetch) — the pages
// and components depend only on the CatalogProduct shape below.

export type ProductForm = "cut" | "living-tray"

export type ProductCategory = "Microgreens" | "Blends" | "Living trays"

export type ProductIcon =
  | "sprout"
  | "leaf"
  | "salad"
  | "flower"
  | "wheat"
  | "cherry"
  | "citrus"
  | "flame"

export interface CatalogProduct {
  /** URL-safe unique id/slug. */
  id: string
  name: string
  category: ProductCategory
  form: ProductForm
  /** One-line summary shown on cards. */
  tagline: string
  /** Longer description for the detail area. */
  description: string
  /** Flavour notes, e.g. ["peppery", "crisp"]. */
  flavour: string[]
  /** Suggested food pairings. */
  pairsWith: string[]
  /** Short nutrition note. */
  nutrition: string
  priceKes: number
  /** What the customer receives, e.g. "50 g punnet". */
  unitLabel: string
  /** Colour accent key mapped to gradients in the UI. */
  accent: "emerald" | "lime" | "rose" | "amber" | "teal" | "violet"
  /** Icon key mapped to a lucide icon in the UI. */
  icon: ProductIcon
  tags: string[]
  featured?: boolean
  badge?: string
}

export const catalogProducts: CatalogProduct[] = [
  {
    id: "broccoli-microgreens",
    name: "Broccoli Microgreens",
    category: "Microgreens",
    form: "cut",
    tagline: "Mild, fresh and everyday-friendly.",
    description:
      "Tender broccoli microgreens with a gentle, fresh crunch. Our most versatile variety — an easy way to add greens and colour to almost any dish.",
    flavour: ["mild", "fresh", "crisp"],
    pairsWith: ["Eggs", "Sandwiches", "Smoothies", "Soups"],
    nutrition: "Rich in sulforaphane and vitamins A, C and K.",
    priceKes: 250,
    unitLabel: "50 g punnet",
    accent: "emerald",
    icon: "sprout",
    tags: ["everyday", "kid-friendly", "salads"],
    featured: true,
    badge: "Bestseller",
  },
  {
    id: "radish-microgreens",
    name: "Radish Microgreens",
    category: "Microgreens",
    form: "cut",
    tagline: "Peppery bite that wakes up a plate.",
    description:
      "Vibrant magenta stems with a peppery, radish-like finish. A little goes a long way — perfect for cutting through rich or creamy dishes.",
    flavour: ["peppery", "bold", "crunchy"],
    pairsWith: ["Tacos", "Tuna", "Creamy soups", "Avocado toast"],
    nutrition: "High in vitamin C and a natural source of antioxidants.",
    priceKes: 250,
    unitLabel: "50 g punnet",
    accent: "rose",
    icon: "flame",
    tags: ["spicy", "colourful", "garnish"],
  },
  {
    id: "sunflower-shoots",
    name: "Sunflower Shoots",
    category: "Microgreens",
    form: "cut",
    tagline: "Nutty, juicy and satisfyingly crunchy.",
    description:
      "Plump sunflower shoots with a mild, nutty flavour and a satisfying bite. Substantial enough to anchor a salad or grain bowl on their own.",
    flavour: ["nutty", "juicy", "crunchy"],
    pairsWith: ["Grain bowls", "Salads", "Stir-fries", "Toast"],
    nutrition: "A source of plant protein, vitamin E and healthy fats.",
    priceKes: 300,
    unitLabel: "100 g bag",
    accent: "amber",
    icon: "wheat",
    tags: ["protein", "bowls", "filling"],
    featured: true,
  },
  {
    id: "pea-shoots",
    name: "Pea Shoots",
    category: "Microgreens",
    form: "cut",
    tagline: "Sweet, tender tendrils with a fresh pea finish.",
    description:
      "Sweet, tender pea shoots with curling tendrils. Delicate enough to eat raw, sturdy enough to wilt into warm dishes.",
    flavour: ["sweet", "tender", "fresh"],
    pairsWith: ["Pasta", "Risotto", "Salads", "Spring rolls"],
    nutrition: "Vitamins A, C and folate with a gentle sweetness.",
    priceKes: 300,
    unitLabel: "100 g bag",
    accent: "lime",
    icon: "leaf",
    tags: ["sweet", "tender", "stir-fry"],
  },
  {
    id: "chefs-blend",
    name: "Chef's Blend",
    category: "Blends",
    form: "cut",
    tagline: "A chef-curated mix of textures and flavour.",
    description:
      "Our signature blend of microgreens chosen for contrast: peppery, sweet and mild in one handful. Built for plating where every element counts.",
    flavour: ["balanced", "complex", "peppery-sweet"],
    pairsWith: ["Tasting plates", "Steak", "Roasts", "Fine dining"],
    nutrition: "A mix of varieties for a broad spectrum of micronutrients.",
    priceKes: 350,
    unitLabel: "100 g bag",
    accent: "violet",
    icon: "salad",
    tags: ["chef", "plating", "signature"],
    featured: true,
    badge: "Chef favourite",
  },
  {
    id: "mild-family-blend",
    name: "Mild Family Blend",
    category: "Blends",
    form: "cut",
    tagline: "Gentle greens the whole table will eat.",
    description:
      "A softer blend of mild microgreens with no peppery heat. A reliable way to get extra greens onto family meals without changing the flavour kids know.",
    flavour: ["mild", "fresh", "gentle"],
    pairsWith: ["Family dinners", "Sandwiches", "Omelettes", "Salads"],
    nutrition: "Everyday vitamins A, C and K in a mild, approachable mix.",
    priceKes: 320,
    unitLabel: "100 g bag",
    accent: "teal",
    icon: "leaf",
    tags: ["family", "kid-friendly", "mild"],
  },
  {
    id: "spicy-mix",
    name: "Spicy Mix",
    category: "Blends",
    form: "cut",
    tagline: "Bold and peppery for cooks who want heat.",
    description:
      "A punchy blend led by radish and mustard notes. Ideal for anyone who finds standard greens too quiet — great on tacos, eggs and grilled dishes.",
    flavour: ["peppery", "bold", "spicy"],
    pairsWith: ["Tacos", "Grilled meats", "Eggs", "Grain bowls"],
    nutrition: "Peppery greens bring vitamin C and mustard-derived compounds.",
    priceKes: 350,
    unitLabel: "100 g bag",
    accent: "rose",
    icon: "flame",
    tags: ["spicy", "bold", "tacos"],
  },
  {
    id: "pea-shoot-living-tray",
    name: "Pea Shoot Living Tray",
    category: "Living trays",
    form: "living-tray",
    tagline: "Grow on your windowsill. Snip as you need.",
    description:
      "A living tray of pea shoots that keeps growing after delivery. Snip what you need and it regrows for a second, sometimes third cut — the freshest possible greens at home.",
    flavour: ["sweet", "tender", "fresh"],
    pairsWith: ["Windowsill growing", "Salads", "Stir-fries", "Snacking"],
    nutrition: "Harvest on demand to keep nutrients at their peak.",
    priceKes: 550,
    unitLabel: "1 living tray",
    accent: "lime",
    icon: "sprout",
    tags: ["living", "regrows", "windowsill"],
    featured: true,
    badge: "Living",
  },
  {
    id: "sunflower-living-tray",
    name: "Sunflower Living Tray",
    category: "Living trays",
    form: "living-tray",
    tagline: "Crunchy sunflower greens, fresh from the tray.",
    description:
      "A living tray of sunflower shoots for the freshest crunch at home. Keep it watered and it will keep giving — snip handfuls straight onto the plate.",
    flavour: ["nutty", "juicy", "crunchy"],
    pairsWith: ["Windowsill growing", "Bowls", "Salads", "Snacking"],
    nutrition: "Plant protein and vitamin E, harvested when you need them.",
    priceKes: 600,
    unitLabel: "1 living tray",
    accent: "amber",
    icon: "wheat",
    tags: ["living", "protein", "windowsill"],
  },
]