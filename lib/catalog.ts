// Public catalog access layer.
//
// Today this returns typed products from the static file in ./catalog-data.
// When the backend ships a public read endpoint (no staff token required),
// rewrite ONLY getCatalog()/getProduct() to fetch from it and keep the same
// CatalogProduct shape — every page and component stays unchanged.

import { catalogProducts, type CatalogProduct } from "./catalog-data"

export type {
  CatalogProduct,
  ProductCategory,
  ProductForm,
  ProductIcon,
} from "./catalog-data"

export const CATEGORIES = ["Microgreens", "Blends", "Living trays"] as const

export function getCatalog(): CatalogProduct[] {
  return catalogProducts
}

export function getProduct(id: string): CatalogProduct | undefined {
  return catalogProducts.find((product) => product.id === id)
}

export function getFeaturedProducts(limit = 3): CatalogProduct[] {
  return catalogProducts.filter((product) => product.featured).slice(0, limit)
}

export function getProductsByForm(form: CatalogProduct["form"]): CatalogProduct[] {
  return catalogProducts.filter((product) => product.form === form)
}

/** Cheapest price in the catalog, formatted for "from KES X" style copy. */
export function startingPrice(): number {
  return Math.min(...catalogProducts.map((product) => product.priceKes))
}