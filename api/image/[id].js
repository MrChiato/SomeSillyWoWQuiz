import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { id } = req.query
  if (Array.isArray(id)) return res.status(400).send('bad id')
  const { data, error } = await supabase
    .from('spells')
    .select('icon_url')
    .eq('id', id)
    .single()

  if (error || !data?.icon_url) {
    return res.status(404).send('not found')
  }

  const up = await fetch(data.icon_url)
  if (!up.ok) return res.status(up.status).send('upstream error')

  const contentType = up.headers.get('content-type') || 'application/octet-stream'
  const buffer = await up.arrayBuffer()



  res.setHeader('Content-Type', contentType)
  res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, immutable')
  res.send(Buffer.from(buffer))
}
