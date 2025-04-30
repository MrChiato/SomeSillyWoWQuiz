import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient }         from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query
  if (typeof id !== 'string') return res.status(400).send('bad id')

  const { data, error } = await supabase
    .from('spells')
    .select('icon_url')
    .eq('id', id)
    .single()

  if (error || !data?.icon_url) return res.status(404).send('not found')

  const upstream = await fetch(data.icon_url)
  if (!upstream.ok) return res.status(upstream.status).send('upstream error')

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
  const buffer      = await upstream.arrayBuffer()

  res.setHeader('Content-Type', contentType)
  res.send(Buffer.from(buffer))
}
