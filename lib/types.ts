export interface Session {
  name: string
  role: string
  token: string
}

export interface StaffPosition {
  id: number
  position_title: string
  position_description: string
}

export interface StaffProfile {
  id: number
  first_name: string
  last_name: string
  email_address: string
  phone_number: string
  staff_number: string
  country_name: string
  type_of_employment: string
  is_profile_active: boolean
  staff_position_details: StaffPosition
}

export interface ProductCategory {
  id: number
  category_name: string
  category_description: string
}

export interface Product {
  id: number
  product_name: string
  category: string
  retail_price: number
  quantity: number
  minimum_quantity: number
}

export interface StockPurchase {
  id: number
  product_name: string
  quantity: number
  stock_price_per_unit: number
  stock_batch_number: string
  date: string
}
