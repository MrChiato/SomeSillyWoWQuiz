import { serialize } from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { key } = req.body

  if (key === process.env.ADMIN_KEY) {
    res.setHeader('Set-Cookie', serialize('admin_key', key, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60
    }))
    return res.status(200).json({ ok: true })
  } else {
    return res.status(401).json({ error: 'Invalid key' })
  }
}
