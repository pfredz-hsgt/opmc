// Supabase Client Configuration
// Replace these with your actual Supabase project credentials

import { createClient } from '@supabase/supabase-js'

// TODO: Replace with your Supabase project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'

// TODO: Replace with your Supabase anon/public key
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
