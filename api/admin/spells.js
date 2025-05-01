import { createClient } from '@supabase/supabase-js'
import { parse } from 'cookie'

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
)

export default async function handler(req, res) {
  const cookies = parse(req.headers.cookie || '')
  if (cookies.admin_key !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'not authorized' })
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin.from('spells').select('*')
    if (error) return res.status(500).json({ error })
    return res.status(200).json({ data })
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const payload = req.body
    let result
    if (req.method === 'PUT') {
      result = await supabaseAdmin
        .from('spells')
        .update(payload)
        .eq('id', payload.id)
    } else {
      result = await supabaseAdmin.from('spells').insert([payload])
    }
    if (result.error) return res.status(500).json({ error: result.error })
    return res.status(200).json({ data: result.data })
  }

  res.status(405).end()
}
