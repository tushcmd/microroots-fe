export interface Session {
  name: string | null
  role: string | null
  token: string
}

export interface StaffPosition {
  id: number
  position_title: string
  position_description: string
}
export interface StaffProfile {
  id: number
  first_name: string | null
  last_name: string | null
  email_address: string
  phone_number: string | null
  staff_number: string
  country_name: string | null
  type_of_employment: string | null
  is_profile_active: boolean
  staff_position_details: StaffPosition | null
}

export interface ProductCategory {
  id: number
  category_name: string | null
  category_description: string | null
}

export interface Product {
  id: number
  product_name: string | null
  category: string | null
  retail_price: number | string | null
  quantity: number | string | null
  minimum_quantity: number | string | null
  // add these optional fields to the existing Product interface:
  product_category_id?: number | null
  supplier_id?: number | null
  unit_of_measurement?: string | null
  discount_type?: string | null
  recommended_discount?: number | string | null
}

export interface StockPurchase {
  id: number
  product_name: string | null
  quantity: number | string | null
  stock_price_per_unit: number | string | null
  stock_batch_number: string | null
  date: string | null
  // add to StockPurchase:
  product_id?: number | null
}

export interface Role {
  id: number
  role_title: string | null
  role_number: string | null
  role_description: string | null
}

export interface RoleInstance {
  id: number
  role: { id: number; role_title: string | null; role_number: string | null } | null
  // sub-role field names are a guess from the docs: "looked up by its unique role_number"
  sub_role: { role_number: string | number | null } | null
}

export interface Session {
  name: string | null
  role: string | null
  token: string
  staffNumber?: string
}

export interface StaffImage {
  image_id: string
  image_url: string
}

export const UNIT_OF_MEASUREMENT = ["piece", "metre", "kg", "other", "not_selected"] as const
export type UnitOfMeasurement = (typeof UNIT_OF_MEASUREMENT)[number]

export const DISCOUNT_TYPE = ["percentage", "fixed", "not_selected"] as const
export type DiscountType = (typeof DISCOUNT_TYPE)[number]
