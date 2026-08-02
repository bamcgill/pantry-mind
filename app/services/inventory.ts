// ─────────────────────────────────────────────
// Inventory service
// All inventory reads and writes go through here.
// ─────────────────────────────────────────────

import { supabase } from './supabase'
import type { InventoryItem, LocationType, RemovalReason } from '../../packages/types'

export async function getInventory(
  householdId: string,
  locationType?: LocationType
): Promise<InventoryItem[]> {
  let query = supabase
    .from('inventory_items')
    .select(`
      *,
      product:products(*),
      location:locations(*)
    `)
    .eq('household_id', householdId)
    .is('removed_at', null)          // only active items
    .order('added_at', { ascending: false })

  if (locationType) {
    query = query.eq('locations.type', locationType)
  }

  const { data, error } = await query
  if (error) throw error
  return data as InventoryItem[]
}

export async function addItem(item: {
  householdId: string
  productId: string
  locationId: string
  addedBy: string
  quantity: number
  unit: string
  portionCount?: number
  notes?: string
}) {
  const { data, error } = await supabase
    .from('inventory_items')
    .insert({
      household_id:  item.householdId,
      product_id:    item.productId,
      location_id:   item.locationId,
      added_by:      item.addedBy,
      quantity:      item.quantity,
      unit:          item.unit,
      portion_count: item.portionCount ?? null,
      notes:         item.notes ?? null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function consumeItem(itemId: string) {
  // Get current item first
  const { data: item, error: fetchError } = await supabase
    .from('inventory_items')
    .select('portion_count, quantity')
    .eq('id', itemId)
    .single()

  if (fetchError) throw fetchError

  // If portioned: decrement count. If last portion or not portioned: mark removed.
  if (item.portion_count && item.portion_count > 1) {
    const { error } = await supabase
      .from('inventory_items')
      .update({ portion_count: item.portion_count - 1 })
      .eq('id', itemId)
    if (error) throw error
  } else {
    await removeItem(itemId, 'consumed')
  }
}

export async function removeItem(itemId: string, reason: RemovalReason = 'removed') {
  const { error } = await supabase
    .from('inventory_items')
    .update({
      removed_at:    new Date().toISOString(),
      removal_reason: reason,
    })
    .eq('id', itemId)

  if (error) throw error
}

export async function updateItem(itemId: string, updates: {
  quantity?: number
  unit?: string
  portionCount?: number
  locationId?: string
  notes?: string
}) {
  const { error } = await supabase
    .from('inventory_items')
    .update({
      ...(updates.quantity    !== undefined && { quantity: updates.quantity }),
      ...(updates.unit        !== undefined && { unit: updates.unit }),
      ...(updates.portionCount !== undefined && { portion_count: updates.portionCount }),
      ...(updates.locationId  !== undefined && { location_id: updates.locationId }),
      ...(updates.notes       !== undefined && { notes: updates.notes }),
    })
    .eq('id', itemId)

  if (error) throw error
}
