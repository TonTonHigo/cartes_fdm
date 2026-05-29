import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { template, action } = req.body
  if (!template || !action) return res.status(400).json({ error: 'Missing params' })

  const key = `card:${action}:${template}`
  const count = await redis.incr(key)

  res.status(200).json({ ok: true, count })
}
