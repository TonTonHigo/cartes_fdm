function hexToRgb(hex) {
  return [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))
}

function luminance(r, g, b) {
  return [r, g, b].reduce((acc, c, i) => {
    c /= 255
    return acc + (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][i]
  }, 0)
}

function contrastRatio(l1, l2) {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}

function hexToHsl(hex) {
  let [r, g, b] = hexToRgb(hex).map(c => c / 255)
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l * 100]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6
    : max === g ? ((b - r) / d + 2) / 6
    : ((r - g) / d + 4) / 6
  return [h * 360, s * 100, l * 100]
}

function hslToHex(h, s, l) {
  h /= 360; s /= 100; l /= 100
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = t => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  return '#' + [h + 1 / 3, h, h - 1 / 3]
    .map(t => Math.round(hue2rgb(t) * 255).toString(16).padStart(2, '0'))
    .join('')
}

export function ensureContrast(fgHex, bgHex, minRatio = 4.5) {
  try {
    const bgL = luminance(...hexToRgb(bgHex))
    const fgL = luminance(...hexToRgb(fgHex))
    if (contrastRatio(fgL, bgL) >= minRatio) return fgHex

    const [h, s, l] = hexToHsl(fgHex)
    const lighten = bgL < 0.5

    for (let i = 1; i <= 20; i++) {
      const newL = Math.max(0, Math.min(100, l + (lighten ? 1 : -1) * i * 5))
      const newHex = hslToHex(h, s, newL)
      if (contrastRatio(luminance(...hexToRgb(newHex)), bgL) >= minRatio) return newHex
    }
    return lighten ? '#ffffff' : '#1a1a1a'
  } catch {
    return fgHex
  }
}
