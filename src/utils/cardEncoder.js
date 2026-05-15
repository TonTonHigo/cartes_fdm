export function encodeCard(data) {
  try {
    const json = JSON.stringify(data)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  } catch {
    return null
  }
}

export function decodeCard(str) {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '=='.slice((4 - (base64.length % 4)) % 4)
    return JSON.parse(decodeURIComponent(escape(atob(padded))))
  } catch {
    return null
  }
}

export function getCardUrl(id) {
  const base = import.meta.env.VITE_BASE_URL || window.location.origin
  return `${base}/carte/${id}`
}
