import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardGourmande({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#6B2800')
  const sh = '0 2px 8px rgba(0,0,0,0.9), 0 1px 20px rgba(0,0,0,0.7)'
  const steamRef = useRef(null)

  useEffect(() => {
    if (!steamRef.current) return
    const container = steamRef.current
    const steams = []
    for (let i = 0; i < 16; i++) {
      const el = document.createElement('div')
      el.className = 'steam'
      const size = Math.random() * 30 + 15
      const dx = (Math.random() - 0.5) * 50
      const dx2 = (Math.random() - 0.5) * 80
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:rgba(253,230,138,0.35);
        left:${20 + Math.random() * 60}%;
        bottom:${Math.random() * 20}%;
        animation-duration:${Math.random() * 3 + 3}s;
        animation-delay:${Math.random() * 6}s;
        --dx:${dx}px;
        --dx2:${dx2}px;
        filter:blur(6px);
        opacity:0;
      `
      container.appendChild(el)
      steams.push(el)
    }
    return () => steams.forEach(s => s.remove())
  }, [fullscreen])
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const spices = [
    { color: '#C0392B', x: 15, y: 20 },
    { color: '#E67E22', x: 78, y: 15 },
    { color: '#F39C12', x: 12, y: 75 },
    { color: '#8E44AD', x: 80, y: 78 },
    { color: '#D35400', x: 50, y: 8 },
    { color: '#CB4335', x: 45, y: 88 },
  ]

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/gourmande.avif), linear-gradient(145deg, #2C0F00 0%, #6B2800 30%, #C4501E 65%, #D97706 85%, #F59E0B 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(25,8,0,0.5)' }} />
      <div ref={steamRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />

      {/* Spice dots */}
      <div className="absolute inset-0 pointer-events-none">
        {spices.map((s, i) => (
          <div key={i} className="absolute rounded-full opacity-30" style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: fullscreen ? 80 : 45,
            height: fullscreen ? 80 : 45,
            background: `radial-gradient(circle, ${s.color}, transparent)`,
            transform: 'translate(-50%, -50%)',
          }} />
        ))}
      </div>

      {/* Steam lines */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-15">
        <svg viewBox="0 0 80 60" width={fullscreen ? 100 : 55}>
          {[15, 30, 45, 60].map((x, i) => (
            <path key={i} d={`M${x},60 Q${x + 6},40 ${x - 4},20 Q${x + 5},5 ${x},0`}
              stroke="#FDE68A" strokeWidth="2" fill="none" />
          ))}
        </svg>
      </div>

      {/* Dot pattern border */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="absolute" style={{
            top: `${10 + i * 11}%`, left: 0, right: 0, height: 1,
            background: 'repeating-linear-gradient(90deg, #F59E0B 0, #F59E0B 3px, transparent 3px, transparent 10px)',
          }} />
        ))}
      </div>

      {/* Border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(245,158,11,0.4)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.3em] text-amber-300`} style={{ opacity: 0.9, textShadow: sh }}>
          Fête des Mères 2026
        </p>

        <div style={{ fontSize: fullscreen ? '2rem' : '1.1rem' }}>🍲</div>

        <h1 className={`${titleSize} italic font-bold leading-tight text-amber-100`}
          style={{ textShadow: sh }}>
          Maman Gourmande,<br />{recipientName || 'Maman'}
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-50" style={{ background: 'linear-gradient(to right, transparent, #F59E0B)' }} />
          <span style={{ color: '#F59E0B', fontSize: fullscreen ? '1rem' : '0.65rem', textShadow: sh }}>✦</span>
          <div className="h-px flex-1 opacity-50" style={{ background: 'linear-gradient(to left, transparent, #F59E0B)' }} />
        </div>

        <p className={`${msgSize} leading-relaxed text-orange-100`}
          style={{ whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif', textShadow: sh }}>
          {message || 'Je t\'aime de tout mon cœur.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: safeAccent, textShadow: sh }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-amber-200`} style={{ fontFamily: '"Lato", sans-serif', textShadow: sh }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
