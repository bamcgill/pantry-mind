// ─────────────────────────────────────────────
// Products service
// Resolution: barcode → exact name → fuzzy → create
// ─────────────────────────────────────────────

import { supabase } from './supabase'
import type { Product, LocationType } from '../../packages/types'

export async function resolveProduct(
  name: string,
  householdId: string,
  barcode?: string
): Promise<string> {  // returns product_id

  // 1. Barcode match — most reliable
  if (barcode) {
    const { data } = await supabase
      .from('products')
      .select('id')
      .eq('barcode', barcode)
      .limit(1)
      .single()

    if (data) return data.id
  }

  // 2. Exact name match — global first, then household
  const { data: exactMatch } = await supabase
    .from('products')
    .select('id')
    .ilike('name', name)
    .or(`household_id.is.null,household_id.eq.${householdId}`)
    .limit(1)
    .single()

  if (exactMatch) return exactMatch.id

  // 3. Fuzzy name match via pg_trgm (similarity > 0.7)
  const { data: fuzzyMatch } = await supabase
    .rpc('find_similar_product', {
      p_name:         name,
      p_household_id: householdId,
      p_threshold:    0.7
    })

  if (fuzzyMatch && fuzzyMatch.length > 0) return fuzzyMatch[0].id

  // 4. No match — create custom product
  const newProduct = await createCustomProduct(name, householdId)
  return newProduct.id
}

export async function createCustomProduct(
  name: string,
  householdId: string,
  options?: {
    category?: string
    defaultLocation?: LocationType
    barcode?: string
  }
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      household_id:     householdId,
      name:             name,
      is_custom:        true,
      category:         options?.category ?? null,
      default_location: options?.defaultLocation ?? null,
      barcode:          options?.barcode ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data as Product
}
