// ─────────────────────────────────────────────
// PantryMind — Shared Types
// Used by both the app and Edge Functions
// ─────────────────────────────────────────────

export type LocationType = 'fridge' | 'freezer' | 'cupboard'
export type ReceiptStatus = 'pending' | 'parsed' | 'confirmed' | 'failed' | 'rejected'
export type RemovalReason = 'consumed' | 'removed' | 'expired' | 'wasted'

// ── Database row types
export interface Household {
  id: string
  name: string
  created_at: string
}

export interface User {
  id: string
  household_id: string
  name: string
  email: string
  created_at: string
}

export interface Location {
  id: string
  household_id: string
  name: string
  type: LocationType
  created_at: string
}

export interface Product {
  id: string
  household_id: string | null  // null = global product
  name: string
  brand: string | null
  category: string | null
  barcode: string | null
  default_location: LocationType | null
  is_custom: boolean
  created_by: string | null
  image_url: string | null
  created_at: string
}

export interface InventoryItem {
  id: string
  household_id: string
  product_id: string
  location_id: string
  added_by: string | null
  quantity: number
  unit: string
  portion_count: number | null
  notes: string | null
  expires_at: string | null   // brick two — null for now
  added_at: string
  removed_at: string | null
  removal_reason: RemovalReason | null
  // joined fields
  product?: Product
  location?: Location
}

export interface Receipt {
  id: string
  household_id: string
  uploaded_by: string | null
  image_url: string
  parsed_raw: ParsedReceipt | null
  status: ReceiptStatus
  item_count: number | null
  confirmed_at: string | null
  confirmed_by: string | null
  created_at: string
}

// ── AI Parse types
export interface ParsedReceiptItem {
  name: string
  quantity: number
  unit: string
  category: string
  default_location: LocationType
  confidence: number
  // user overrides — populated on review screen
  user_name_override?: string | null
  user_location_override?: LocationType | null
}

export interface ParsedReceipt {
  store: string | null
  date: string | null
  items: ParsedReceiptItem[]
  parse_confidence: number
  items_skipped: string[]
}

// ── Confirm payload
export interface ConfirmReceiptPayload {
  items: ConfirmReceiptItem[]
}

export interface ConfirmReceiptItem extends ParsedReceiptItem {
  user_name_override: string | null
  user_location_override: LocationType | null
}

// ── Confirm response
export interface ConfirmReceiptResponse {
  receipt_id: string
  status: 'confirmed'
  items_added: number
  items_created_as_custom: number
  inventory_ids: string[]
  confirmed_at: string
}

// ── Correction log
export interface ProductCorrection {
  receipt_id: string
  household_id: string
  product_id: string | null
  field_corrected: 'name' | 'location' | 'quantity' | 'removed'
  ai_value: string | null
  user_value: string | null
}
