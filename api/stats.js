import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

const TEMPLATES = ['floral', 'sunset', 'aquarelle', 'royal', 'creole', 'lontan', 'nature', 'soleil', 'hauts', 'gourmande']

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end()

  const stats = {}
  for (const t of TEMPLATES) {
    const copied = await redis.get(`card:copy:${t}`) || 0
    const sent = await redis.get(`card:send:${t}`) || 0
    stats[t] = { copied: Number(copied), sent: Number(sent), total: Number(copied) + Number(sent) }
  }

  const sorted = Object.entries(stats).sort((a, b) => b[1].total - a[1].total)
  res.status(200).json(sorted)
}
