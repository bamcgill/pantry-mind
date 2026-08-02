// ─────────────────────────────────────────────
// Supabase client — single instance
// THIS IS THE ONLY FILE THAT IMPORTS SUPABASE
// All other services import from here.
// ─────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseKey  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
})
