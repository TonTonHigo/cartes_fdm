import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

const FLOWER_SVG = (color = '#f9a8d4') => `
  <svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(40,40)">
      ${[0,45,90,135,180,225,270,315].map(a => `
        <ellipse cx="${22 * Math.cos((a * Math.PI) / 180)}" cy="${22 * Math.sin((a * Math.PI) / 180)}"
          rx="12" ry="8" fill="${color}" opacity="0.85"
          transform="rotate(${a} ${22 * Math.cos((a * Math.PI) / 180)} ${22 * Math.sin((a * Math.PI) / 180)})" />
      `).join('')}
      <circle cx="0" cy="0" r="12" fill="#fde68a" />
      <circle cx="0" cy="0" r="7" fill="#fbbf24" />
    </g>
  </svg>
`

export default function CardFloral({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const petalsRef = useRef(null)

  useEffect(() => {
    if (!petalsRef.current) return
    const container = petalsRef.current
    const colors = [accentColor, '#fda4af', '#f9a8d4', '#fbcfe8', '#fce7f3']
    const petals = []

    for (let i = 0; i < 12; i++) {
      const el = document.createElement('div')
      el.className = 'petal'
      const size = Math.random() * 12 + 8
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 6 + 7}s;
        animation-delay:${Math.random() * 8}s;
        opacity:0.7;
      `
      container.appendChild(el)
      petals.push(el)
    }
    return () => petals.forEach(p => p.remove())
  }, [accentColor])

  const safeAccent = ensureContrast(accentColor, '#fce7f3')
  const sh = ''
  const scale = fullscreen ? 'text-base' : 'text-xs'
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/jardin_fleuri.avif), linear-gradient(135deg, #fff0f6 0%, #fce7f3 40%, #fdf2f8 70%, #fff5f7 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(255,240,246,0)' }} />
      <div ref={petalsRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />


      {/* Border decoration */}
      <div
        className="absolute inset-3 rounded-xl border-2 pointer-events-none"
        style={{ borderColor: `${accentColor}40` }}
      />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${scale} font-sans uppercase tracking-widest`} style={{ color: safeAccent, textShadow: sh }}>
          Fête des Mères
        </p>

        <h1 className={`${titleSize} italic font-bold leading-tight`} style={{ color: '#9d174d', textShadow: sh }}>
          Maman Fleurie,<br />{recipientName || 'Maman'}
        </h1>

        <div className="py-2">
          <div className="flex items-center gap-2 justify-center">
            <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${accentColor})` }} />
            <span style={{ color: accentColor }}>✿</span>
            <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${accentColor})` }} />
          </div>
        </div>

        <p
          className={`${msgSize} leading-loose font-sans`}
          style={{ color: '#4a1942', whiteSpace: 'pre-wrap', textShadow: sh }}
        >
          {message || 'Comme les fleurs qui s\'épanouissent,\ntu embellis chaque jour de ma vie.\nJe t\'aime.'}
        </p>

        <div className="pt-2">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: '#be185d', textShadow: sh }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${scale} font-sans mt-1`} style={{ color: '#9d174d', textShadow: sh }}>
              — {senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
