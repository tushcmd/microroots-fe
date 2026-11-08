// Base API client for the MicroRootsKe backend.
// Swap NEXT_PUBLIC_API_URL per environment rather than editing this file.

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.210.23"
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://169.58.210.23"

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

async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string } = {},
): Promise<ApiResponse<T>> {
  const { token, ...init } = options
  const url = `${BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Token ${token}`
  }

  let response: Response
  try {
    response = await fetch(url, { ...init, headers })
  } catch {
    // Network-level failure (timeout, DNS, connection refused) never reaches
    // the JSON branch below, so it needs its own typed error.
    throw new ApiError("Unable to reach the server. Check your connection.", 0)
  }

  if (!response.ok) {
    const contentType = response.headers.get("content-type")
    let message = response.statusText
    if (contentType?.includes("application/json")) {
      try {
        const body = await response.json()
        message = typeof body?.message === "string" ? body.message : message
      } catch {
        // fall through to statusText
      }
    }
    throw new ApiError(message, response.status)
  }

  return (await response.json()) as ApiResponse<T>
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
): Promise<{ user_token: string; full_name: string | null; user_role: string | null }> {
  const res = await apiCall<{ user_token: string; full_name: string | null; user_role: string | null }>(
    "/staff-profile/staff-login/",
    { method: "POST", body: JSON.stringify({ staff_number, password }) },
  )
  if (!res.payload?.user_token) throw new ApiError("Malformed login response", 500)
  return res.payload
}

export async function staffLogout(token: string): Promise<void> {
  await apiCall("/staff-profile/staff-logout/", { method: "POST", token })
}

// --- Staff profiles -----------------------------------------------------

export async function getAllStaffProfiles(token: string) {
  const res = await apiCall<unknown>("/staff-profile/get-all-staff-profiles/", { token })
  return asList(res, ["staff_profiles", "profiles"])
}

export async function createStaffProfile(email: string, token: string): Promise<void> {
  await apiCall("/staff-profile/create-staff-profile/", {
    method: "POST",
    body: JSON.stringify({ username: email }),
    token,
  })
}

export async function getAllStaffPositions(token: string) {
  const res = await apiCall<unknown>("/staff-profile/get-all-staff-positions/", { token })
  return asList(res, ["staff_positions", "positions"])
}

export async function createStaffPosition(
  data: { position_title: string; position_description: string },
  token: string,
): Promise<void> {
  await apiCall("/staff-profile/create-staff-position/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function updateStaffPosition(
  data: { position_id: number; position_title: string; position_description: string },
  token: string,
): Promise<void> {
  await apiCall("/staff-profile/update-staff-position/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

// Partial update — pass only the fields you want to change, plus staff_profile_id.
export async function updateStaffProfile(
  data: { staff_profile_id: number } & Record<string, unknown>,
  token: string,
): Promise<void> {
  await apiCall("/staff-profile/update-staff-profile/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function changeMyStaffPassword(password: string, token: string): Promise<void> {
  await apiCall("/staff-profile/change-my-staff-password/", {
    method: "POST",
    body: JSON.stringify({ password }),
    token,
  })
}

export async function getAllAvailableRoles(token: string) {
  const res = await apiCall<unknown>("/staff-profile/get-all-available-roles/", { token })
  return asList(res, ["roles", "available_roles"])
}

// --- Products & inventory -------------------------------------------------

export async function getAllProducts(token: string) {
  const res = await apiCall<unknown>("/products/get-all-products/", { token })
  return asList(res, ["products"])
}

export async function addProduct(
  productData: {
    product_category_id: number
    supplier_id: number
    product_name: string
    unit_of_measurement: string
    minimum_quantity: string
    retail_price: string
    discount_type: string
    recommended_discount: string
    quantity: string
  },
  token: string,
): Promise<void> {
  await apiCall("/products/add-product/", {
    method: "POST",
    body: JSON.stringify(productData),
    token,
  })
}

export async function getAllStockPurchases(token: string) {
  const res = await apiCall<unknown>("/products/get-all-stock-purchase-inventories/", { token })
  return asList(res, ["stock_purchase_inventories"])
}

export async function addStockPurchase(
  data: { product_id: number; quantity: string; stock_price_per_unit: string },
  token: string,
): Promise<void> {
  await apiCall("/products/add-stock-purchase-inventory/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function getAllProductCategories(token: string) {
  const res = await apiCall<unknown>("/products/get-all-product-categories/", { token })
  return asList(res, ["product_categories"])
}

export async function addProductCategory(
  data: { category_name: string; description: string },
  token: string,
): Promise<void> {
  await apiCall("/products/add-product-category/", {
    method: "POST",
    body: JSON.stringify(data),
    token,
  })
}

export async function deleteProductCategory(
  product_category_id: number,
  token: string,
): Promise<void> {
  await apiCall("/products/delete-single-product-category/", {
    method: "POST",
    body: JSON.stringify({ product_category_id }),
    token,
  })
}
