import LZString from 'lz-string'

const DEFAULTS = {
  template: 'floral',
  recipientName: 'Maman',
  senderName: '',
  message: "Tu es la femme la plus merveilleuse du monde.\nChaque jour, je suis reconnaissant(e) de t'avoir dans ma vie.\nJe t'aime infiniment.",
  signature: 'Avec tout mon amour',
  accentColor: '#f43f5e',
}

const KEYS = { template: 't', recipientName: 'r', senderName: 's', message: 'm', signature: 'sg', accentColor: 'c' }
const KEYS_REV = Object.fromEntries(Object.entries(KEYS).map(([k, v]) => [v, k]))

export function encodeCard(data) {
  try {
    const compact = {}
    for (const [key, short] of Object.entries(KEYS)) {
      if (data[key] !== undefined && data[key] !== DEFAULTS[key]) {
        compact[short] = data[key]
      }
    }
    return LZString.compressToEncodedURIComponent(JSON.stringify(compact))
  } catch {
    return null
  }
}

export function decodeCard(str) {
  try {
    const compact = JSON.parse(LZString.decompressFromEncodedURIComponent(str))
    const data = { ...DEFAULTS }
    for (const [short, val] of Object.entries(compact)) {
      const key = KEYS_REV[short]
      if (key) data[key] = val
    }
    return data
  } catch {
    return null
  }
}

export function getCardUrl(id) {
  const base = import.meta.env.VITE_BASE_URL || window.location.origin
  return `${base}/carte/${id}`
}
