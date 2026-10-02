import type { Product, StaffProfile, StockPurchase } from "./types"

// Staff, products, and stock-purchase data below is placeholder content.
// Staff and staff-positions endpoints are live — swap those two first
// (see components/staff/staff-table.tsx). Products/inventory endpoints
// are also live per the API docs; batches, delivery, and finance modules
// have no registered backend routes yet, so leave those on mock data
// until the backend team confirms they exist.

export const mockStaff: StaffProfile[] = [
  { id: 1, first_name: "Jane", last_name: "Wanjiku", staff_position_details: { id: 1, position_title: "Operations Manager", position_description: "" }, email_address: "jane@microroots.ke", phone_number: "+254 712 456 890", is_profile_active: true, staff_number: "MRK001", country_name: "Kenya", type_of_employment: "Full time" },
  { id: 2, first_name: "David", last_name: "Ochieng", staff_position_details: { id: 2, position_title: "Farm Supervisor", position_description: "" }, email_address: "david@microroots.ke", phone_number: "+254 723 882 110", is_profile_active: true, staff_number: "MRK014", country_name: "Kenya", type_of_employment: "Full time" },
  { id: 3, first_name: "Mercy", last_name: "Njeri", staff_position_details: { id: 3, position_title: "Inventory Clerk", position_description: "" }, email_address: "mercy@microroots.ke", phone_number: "+254 701 109 442", is_profile_active: true, staff_number: "MRK021", country_name: "Kenya", type_of_employment: "Part time" },
  { id: 4, first_name: "Brian", last_name: "Kiptoo", staff_position_details: { id: 4, position_title: "Farm Technician", position_description: "" }, email_address: "brian@microroots.ke", phone_number: "+254 735 220 615", is_profile_active: false, staff_number: "MRK009", country_name: "Kenya", type_of_employment: "Full time" },
  { id: 5, first_name: "Esther", last_name: "Akinyi", staff_position_details: { id: 5, position_title: "Sales Associate", position_description: "" }, email_address: "esther@microroots.ke", phone_number: "+254 790 345 775", is_profile_active: true, staff_number: "MRK032", country_name: "Kenya", type_of_employment: "Full time" },
]

export const mockProducts: Product[] = [
  { id: 1, product_name: "Sunflower Microgreens", category: "Microgreens", retail_price: 450, quantity: 84, minimum_quantity: 30 },
  { id: 2, product_name: "Pea Shoots", category: "Microgreens", retail_price: 380, quantity: 18, minimum_quantity: 25 },
  { id: 3, product_name: "Coco Coir Block", category: "Growing Medium", retail_price: 800, quantity: 42, minimum_quantity: 15 },
  { id: 4, product_name: "Basil Seeds", category: "Seeds", retail_price: 1200, quantity: 9, minimum_quantity: 12 },
]

export const mockPurchases: StockPurchase[] = [
  { id: 1, product_name: "Coco Coir Block", quantity: 50, stock_price_per_unit: 560, stock_batch_number: "BN20260920123000", date: "20 Sep 2026" },
  { id: 2, product_name: "Sunflower Seeds", quantity: 100, stock_price_per_unit: 240, stock_batch_number: "BN20260918101500", date: "18 Sep 2026" },
  { id: 3, product_name: "Pea Seeds", quantity: 40, stock_price_per_unit: 310, stock_batch_number: "BN20260912094000", date: "12 Sep 2026" },
]
