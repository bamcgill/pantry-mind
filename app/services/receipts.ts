// ─────────────────────────────────────────────
// Receipts service
// Upload → parse → review → confirm
// ─────────────────────────────────────────────

import { supabase } from './supabase'
import type {
  Receipt,
  ParsedReceipt,
  ConfirmReceiptPayload,
  ConfirmReceiptResponse,
  ProductCorrection,
} from '../../packages/types'

export async function uploadAndCreateReceipt(
  householdId: string,
  userId: string,
  imageUri: string
): Promise<{ receiptId: string; imageUrl: string }> {

  // 1. Upload image to storage
  const fileName  = `${householdId}/${Date.now()}.jpg`
  const response  = await fetch(imageUri)
  const blob      = await response.blob()

  const { error: uploadError } = await supabase.storage
    .from('receipt-images')
    .upload(fileName, blob, { contentType: 'image/jpeg' })

  if (uploadError) throw uploadError

  // 2. Get signed URL (valid 1 hour — enough for parsing)
  const { data: signedData, error: signedError } = await supabase.storage
    .from('receipt-images')
    .createSignedUrl(fileName, 3600)

  if (signedError) throw signedError

  // 3. Create receipt record
  const { data, error } = await supabase
    .from('receipts')
    .insert({
      household_id: householdId,
      uploaded_by:  userId,
      image_url:    signedData.signedUrl,
      status:       'pending',
    })
    .select()
    .single()

  if (error) throw error
  return { receiptId: data.id, imageUrl: signedData.signedUrl }
}

export async function parseReceipt(receiptId: string): Promise<ParsedReceipt> {
  // Call the Edge Function — Claude API call happens server-side
  const { data, error } = await supabase.functions.invoke('parse-receipt', {
    body: { receipt_id: receiptId }
  })

  if (error) throw error
  return data as ParsedReceipt
}

export async function confirmReceipt(
  receiptId: string,
  householdId: string,
  userId: string,
  payload: ConfirmReceiptPayload,
  corrections: ProductCorrection[]
): Promise<ConfirmReceiptResponse> {

  // Log corrections first — never lose this data
  if (corrections.length > 0) {
    await supabase.from('product_corrections').insert(corrections)
  }

  // Call confirm Edge Function
  const { data, error } = await supabase.functions.invoke('confirm-receipt', {
    body: {
      receipt_id:   receiptId,
      household_id: householdId,
      user_id:      userId,
      items:        payload.items,
    }
  })

  if (error) throw error
  return data as ConfirmReceiptResponse
}

export async function getReceipt(receiptId: string): Promise<Receipt> {
  const { data, error } = await supabase
    .from('receipts')
    .select('*')
    .eq('id', receiptId)
    .single()

  if (error) throw error
  return data as Receipt
}
