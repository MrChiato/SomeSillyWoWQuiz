import { createClient, SupabaseClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_URL!
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY!

let _client: SupabaseClient = createClient(URL, ANON)

export function setAdminKey(key: string) {
    _client = createClient(URL, ANON, {
        global: {
            headers: {
                'x-admin-key': key
            }
        }
    })
}

export const adminSupabase = _client