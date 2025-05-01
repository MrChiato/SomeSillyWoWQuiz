import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { id } = req.query
  if (Array.isArray(id)) return res.status(400).send('bad id')

  const { data, error } = await supabase
    .from('spells')
    .select('icon_url')
    .eq('id', id)
    .single()

  if (error || !data?.icon_url) {
    console.error('lookup failed:', error)
    return res.status(404).send('not found')
  }

  const upstream = await fetch(data.icon_url)
  if (!upstream.ok) {
    console.error('upstream fetch failed:', upstream.status)
    return res.status(502).send('upstream error')
  }

  const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
  const buffer = await upstream.arrayBuffer()

  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable')
  res.send(Buffer.from(buffer))
}
