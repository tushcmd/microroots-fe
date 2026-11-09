"use client"

// Browser-side API client. Calls same-origin Next.js routes which proxy to Django.
// The auth token lives in an httpOnly cookie and is never exposed to JS.

export interface ApiResponse<T> {
  message: string
  payload?: T
  [key: string]: unknown
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

type AuthHandler = (() => void) | null
let onAuthExpired: AuthHandler = null

export function setAuthExpiredHandler(handler: AuthHandler) {
  onAuthExpired = handler
}

function isInvalidTokenDetail(body: unknown): boolean {
  const detail = (body as any)?.detail
  return (
    detail === "Invalid token." ||
    detail === "Authentication credentials were not provided."
  )
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const init = { ...options }
  const headers = new Headers(init.headers || {})
  if (!(init.body instanceof FormData) && init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }
  init.headers = headers
  init.credentials = "same-origin"
  init.cache = "no-store"

  let response: Response
  try {
    response = await fetch(`/api/proxy${endpoint}`, init)
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.", 0)
  }

  const contentType = response.headers.get("content-type") || ""
  const text = await response.text()
  let json: any = null
  if (contentType.includes("application/json") && text) {
    try {
      json = JSON.parse(text)
    } catch {
      json = null
    }
  }

  if (!response.ok) {
    if (response.status === 502) {
      throw new ApiError("Unable to reach the server. Check your connection.", 0)
    }
    if (response.status === 401 && (isInvalidTokenDetail(json) || (json?.message || text) === "Not signed in")) {
      onAuthExpired?.()
      throw new ApiError("Session expired", 401)
    }
    const message = typeof json?.message === "string" ? json.message : response.statusText
    throw new ApiError(message, response.status)
  }

  return (json ?? ({} as ApiResponse<T>)) as ApiResponse<T>
}

function asList<T>(res: ApiResponse<unknown>, keys: string[] = []): T[] {
  if (Array.isArray(res)) return res as T[]
  if (Array.isArray(res.payload)) return res.payload as T[]
  for (const key of keys) {
    if (Array.isArray(res[key])) return res[key] as T[]
  }
  if (res.payload && typeof res.payload === "object") {
    const payload = res.payload as Record<string, unknown>
    for (const key of keys) {
      if (Array.isArray(payload[key])) return payload[key] as T[]
    }
  }
  return []
}

function asFlag(res: ApiResponse<unknown>, key: string) {
  if (typeof res[key] === "boolean") return res[key] as boolean
  if (res.payload && typeof res.payload === "object" && !Array.isArray(res.payload)) {
    const value = (res.payload as Record<string, unknown>)[key]
    if (typeof value === "boolean") return value
  }
  return false
}

async function authJson<T>(path: string, body: unknown): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "same-origin",
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.", 0)
  }
  const text = await response.text()
  let json: any = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = null
  }
  if (!response.ok) {
    if (response.status === 502) {
      throw new ApiError("Unable to reach the server. Check your connection.", 0)
    }
    throw new ApiError(typeof json?.message === "string" ? json.message : response.statusText, response.status)
  }
  return json as T
}

// --- Setup (first-run admin) ---------------------------------------------

export async function checkAdminProfile(): Promise<boolean> {
  const res = await apiCall<unknown>("/staff-profile/check-admin-profile/")
  return asFlag(res, "admin_profile_exists")
}

export async function createAdminProfile(username: string): Promise<void> {
  await apiCall("/staff-profile/create-admin-profile/", {
    method: "POST",
    body: JSON.stringify({ username }),
  })
}

// --- Auth -------------------------------------------------------------

export async function staffLogin(
  staff_number: string,
  password: string,
): Promise<{ name: string | null; role: string | null; staffNumber?: string }> {
  return authJson("/api/auth/login", { staff_number, password })
}

export async function staffLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin", cache: "no-store" })
  } catch {
    // ignore
  }
}

export async function getSession(): Promise<{ name: string | null; role: string | null; staffNumber?: string } | null> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "same-origin", cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// --- Staff profiles -----------------------------------------------------

export async function getAllStaffProfiles() {
  const res = await apiCall<unknown>("/staff-profile/get-all-staff-profiles/")
  return asList(res, ["staff_profiles", "profiles"])
}

export async function createStaffProfile(email: string): Promise<void> {
  await apiCall("/staff-profile/create-staff-profile/", {
    method: "POST",
    body: JSON.stringify({ username: email }),
  })
}

export async function getAllStaffPositions() {
  const res = await apiCall<unknown>("/staff-profile/get-all-staff-positions/")
  return asList(res, ["staff_positions", "positions"])
}

export async function createStaffPosition(data: { position_title: string; position_description: string }): Promise<void> {
  await apiCall("/staff-profile/create-staff-position/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateStaffPosition(
  data: { position_id: number; position_title: string; position_description: string },
): Promise<void> {
  await apiCall("/staff-profile/update-staff-position/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateStaffProfile(data: { staff_profile_id: number } & Record<string, unknown>): Promise<void> {
  await apiCall("/staff-profile/update-staff-profile/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function changeMyStaffPassword(password: string): Promise<void> {
  await apiCall("/staff-profile/change-my-staff-password/", {
    method: "POST",
    body: JSON.stringify({ password }),
  })
}

export async function getAllAvailableRoles() {
  const res = await apiCall<unknown>("/staff-profile/get-all-available-roles/")
  return asList(res, ["roles", "available_roles"])
}

// --- Products & inventory -------------------------------------------------

export async function getAllProducts() {
  const res = await apiCall<unknown>("/products/get-all-products/")
  return asList(res, ["products"])
}

export async function addProduct(productData: {
  product_category_id: number
  supplier_id: number
  product_name: string
  unit_of_measurement: string
  minimum_quantity: string
  retail_price: string
  discount_type: string
  recommended_discount: string
  quantity: string
}): Promise<void> {
  await apiCall("/products/add-product/", {
    method: "POST",
    body: JSON.stringify(productData),
  })
}

export async function getAllStockPurchases() {
  const res = await apiCall<unknown>("/products/get-all-stock-purchase-inventories/")
  return asList(res, ["stock_purchase_inventories"])
}

export async function addStockPurchase(data: { product_id: number; quantity: string; stock_price_per_unit: string }): Promise<void> {
  await apiCall("/products/add-stock-purchase-inventory/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getAllProductCategories() {
  const res = await apiCall<unknown>("/products/get-all-product-categories/")
  return asList(res, ["product_categories"])
}

export async function addProductCategory(data: { category_name: string; description: string }): Promise<void> {
  await apiCall("/products/add-product-category/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteProductCategory(product_category_id: number): Promise<void> {
  await apiCall("/products/delete-single-product-category/", {
    method: "POST",
    body: JSON.stringify({ product_category_id }),
  })
}

// --- Staff: delete + roles ------------------------------------------------

export async function deleteStaffProfile(id: number): Promise<void> {
  await apiCall(`/staff-profile/delete-staff-profile/${id}/`, { method: "DELETE" })
}

export async function deleteStaffPosition(id: number): Promise<void> {
  await apiCall(`/staff-profile/delete-staff-position/${id}/`, { method: "DELETE" })
}

export async function getStaffRoles(staff_profile_id: number) {
  const res = await apiCall<unknown>("/staff-profile/get-this-staff-roles/", {
    method: "POST",
    body: JSON.stringify({ staff_profile_id }),
  })
  return asList(res, ["roles", "role_instances"])
}

export async function editStaffRoles(
  staff_profile_id: number,
  role_instance_list: { role_id: number; sub_role_numbers: string[] }[],
): Promise<void> {
  await apiCall("/staff-profile/edit-staff-roles/", {
    method: "POST",
    body: JSON.stringify({ staff_profile_id, role_instance_list }),
  })
}

// --- Products: edit + delete ---------------------------------------------

export async function editProduct(data: {
  product_id: number
  product_category_id: number
  supplier_id: number
  product_name: string
  unit_of_measurement: string
  minimum_quantity: string
  retail_price: string
  discount_type: string
  recommended_discount: string
}): Promise<void> {
  await apiCall("/products/edit-single-product/", { method: "POST", body: JSON.stringify(data) })
}

export async function deleteProduct(product_id: number): Promise<void> {
  await apiCall("/products/delete-single-product/", {
    method: "POST",
    body: JSON.stringify({ product_id }),
  })
}

export async function editStockPurchase(data: {
  stock_purchase_inventory_id: number
  product_id: number
  quantity: string
  stock_price_per_unit: string
}): Promise<void> {
  await apiCall("/products/edit-single-stock-purchase-inventories/", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteStockPurchase(stock_purchase_inventory_id: number): Promise<void> {
  await apiCall("/products/delete-single-stock-purchase-inventory/", {
    method: "POST",
    body: JSON.stringify({ stock_purchase_inventory_id }),
  })
}

// --- Staff images ---------------------------------------------------------

export function mediaUrl(path: string) {
  const base = (process.env.NEXT_PUBLIC_MEDIA_URL || "http://169.58.210.23").replace(/\/+$/, "")
  try {
    const { pathname } = new URL(path, base)
    return `${base}${pathname}`
  } catch {
    return `${base}${path}`
  }
}

export async function getStaffImages(staff_profile_id: number) {
  const res = await apiCall<unknown>("/staff-profile/get-all-staff-images/", {
    method: "POST",
    body: JSON.stringify({ staff_profile_id }),
  })
  return asList<{ image_id: string; image_url: string }>(res, ["image_list"])
}

export async function addStaffImage(staff_profile_id: number, file: File): Promise<void> {
  const form = new FormData()
  form.append("staff_profile_id", String(staff_profile_id))
  form.append("images", file)

  let response: Response
  try {
    response = await fetch("/api/proxy/staff-profile/add-staff-image/", {
      method: "POST",
      body: form,
      credentials: "same-origin",
      cache: "no-store",
    })
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection.", 0)
  }
  if (response.status === 502) {
    throw new ApiError("Unable to reach the server. Check your connection.", 0)
  }
  if (!response.ok) throw new ApiError("Couldn't upload the photo.", response.status)
}

export async function deleteStaffImage(image_id: number): Promise<void> {
  await apiCall("/staff-profile/delete-staff-image/", {
    method: "POST",
    body: JSON.stringify({ image_id }),
  })
}

// Admin setup aliases (backward-compat with setup form naming)
export async function createAdminAccount(data: {
  admin_number?: string
  email_address?: string
  password?: string
  username?: string
}): Promise<void> {
  await apiCall("/staff-profile/create-admin-profile/", {
    method: "POST",
    body: JSON.stringify({ username: data.username || data.admin_number || data.email_address }),
  })
}

// Position edit (supports both param shapes used in codebase)
export async function editStaffPosition(
  data:
    | { position_id: number; position_title: string; position_description?: string }
    | { staff_position_id: number; staff_position_name: string },
): Promise<void> {
  const payload =
    "staff_position_id" in data
      ? {
          position_id: data.staff_position_id,
          position_title: data.staff_position_name,
          position_description: "",
        }
      : data
  await updateStaffPosition(payload as { position_id: number; position_title: string; position_description: string })
}
