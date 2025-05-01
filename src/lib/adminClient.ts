import { createClient, SupabaseClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL!
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY!

let client: SupabaseClient = createClient(URL, ANON)

export function setAdminKey(key: string) {
  client = createClient(URL, key)
}

export function getAdminClient(): SupabaseClient {
  return client
}