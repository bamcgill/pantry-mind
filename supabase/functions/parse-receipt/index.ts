// ─────────────────────────────────────────────
// Edge Function: parse-receipt
// Receives receipt_id.
// Fetches image. Calls Claude Vision.
// Stores result. Returns parsed items.
//
// Anthropic API key NEVER leaves this function.
// ─────────────────────────────────────────────

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY      = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const RECEIPT_PARSE_PROMPT = `
You are a receipt parser for a home inventory app called PantryMind.

You will be given an image of a supermarket receipt.
Extract every food and drink product purchased.

For each item return:
- name: clean product name, remove store brand prefixes (e.g. "Tesco" → just the product)
- quantity: numeric amount purchased
- unit: kg / g / l / ml / each
- category: one of [dairy, meat, fish, fruit, vegetables, frozen, bakery, drinks, condiments, snacks, dry_goods, household]
- default_location: one of [fridge, freezer, cupboard]
- confidence: 0.0 to 1.0

Rules:
- Ignore non-food items (cleaning products, magazines, etc)
- Ignore loyalty points, discounts, totals, store information
- If quantity is unclear assume 1
- If location is ambiguous use best judgment (milk → fridge, pasta → cupboard)
- Return ONLY valid JSON, no explanation, no markdown

Return this exact structure:
{
  "store": "store name if visible or null",
  "date": "YYYY-MM-DD if visible or null",
  "items": [
    {
      "name": "Semi Skimmed Milk 2L",
      "quantity": 1,
      "unit": "each",
      "category": "dairy",
      "default_location": "fridge",
      "confidence": 0.95
    }
  ],
  "parse_confidence": 0.0,
  "items_skipped": ["line: reason"]
}
`.trim()

Deno.serve(async (req) => {
  try {
    const { receipt_id } = await req.json()
    if (!receipt_id) {
      return new Response(JSON.stringify({ error: 'receipt_id required' }), { status: 400 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
    const startMs  = Date.now()

    // 1. Get receipt record
    const { data: receipt, error: receiptError } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receipt_id)
      .single()

    if (receiptError || !receipt) {
      return new Response(JSON.stringify({ error: 'Receipt not found' }), { status: 404 })
    }

    // 2. Call Claude Vision
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [{
          role: 'user',
          content: [
            {
              type:   'image',
              source: { type: 'url', url: receipt.image_url },
            },
            {
              type: 'text',
              text: RECEIPT_PARSE_PROMPT,
            }
          ]
        }]
      })
    })

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`)
    }

    const claudeData = await claudeResponse.json()
    const durationMs = Date.now() - startMs

    // 3. Parse response
    const rawText   = claudeData.content[0].text
    const parsed    = JSON.parse(rawText)

    // 4. Store raw result + update receipt status
    await supabase
      .from('receipts')
      .update({
        parsed_raw: parsed,
        status:     parsed.parse_confidence >= 0.3 ? 'parsed' : 'failed',
        item_count: parsed.items?.length ?? 0,
      })
      .eq('id', receipt_id)

    // 5. Log token usage
    await supabase.from('ai_usage').insert({
      receipt_id:    receipt_id,
      household_id:  receipt.household_id,
      model:         'claude-sonnet-4-20250514',
      input_tokens:  claudeData.usage?.input_tokens  ?? 0,
      output_tokens: claudeData.usage?.output_tokens ?? 0,
      duration_ms:   durationMs,
    })

    return new Response(JSON.stringify(parsed), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('parse-receipt error:', err)
    return new Response(
      JSON.stringify({ error: 'Parse failed', message: err.message }),
      { status: 500 }
    )
  }
})
