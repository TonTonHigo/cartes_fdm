import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardNature({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#0E4020')
  const sh = '0 2px 8px rgba(0,0,0,0.9), 0 1px 20px rgba(0,0,0,0.7)'
  const dropsRef = useRef(null)

  useEffect(() => {
    if (!dropsRef.current) return
    const container = dropsRef.current
    const drops = []
    for (let i = 0; i < 25; i++) {
      const el = document.createElement('div')
      el.className = 'drop'
      const w = Math.random() * 4 + 2
      const h = w * 3
      el.style.cssText = `
        width:${w}px; height:${h}px;
        background:linear-gradient(to bottom, #7FDFFF, #0EA5E9);
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 1.5 + 0.8}s;
        animation-delay:${Math.random() * 5}s;
        opacity:0;
        border-radius:0 50% 50% 50%;
        transform:rotate(45deg);
      `
      container.appendChild(el)
      drops.push(el)
    }
    return () => drops.forEach(d => d.remove())
  }, [fullscreen])
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const drops = Array.from({ length: fullscreen ? 18 : 9 }).map((_, i) => ({
    left: `${(i / (fullscreen ? 18 : 9)) * 100}%`,
    top: `${Math.sin(i * 1.7) * 35 + 50}%`,
    size: Math.sin(i * 0.9) * 3 + 5,
  }))

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/plage.avif), linear-gradient(160deg, #071E0A 0%, #0E4020 25%, #1A7A3A 55%, #0C5E6E 80%, #093B4A 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(4,15,7,0.55)' }} />
      <div ref={dropsRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />

      {/* Water drops */}
      <div className="absolute inset-0 pointer-events-none">
        {drops.map((d, i) => (
          <div key={i} className="absolute rounded-full opacity-30"
            style={{
              left: d.left, top: d.top,
              width: d.size, height: d.size * 1.4,
              background: 'radial-gradient(circle at 30% 30%, #7FDFFF, #0EA5E9)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
            }} />
        ))}
      </div>

      {/* Jungle leaves bottom */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30 pointer-events-none">
        <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="w-full" style={{ height: fullscreen ? 100 : 50 }}>
          <path d="M0,80 Q30,20 60,50 Q80,10 110,45 Q140,5 170,40 Q200,0 230,35 Q260,5 290,40 Q320,10 350,45 Q380,20 400,50 L400,80Z" fill={safeAccent} />
          <path d="M0,80 Q20,40 40,60 Q60,30 80,55 Q100,25 120,50 Q140,20 160,48 Q180,15 200,45 Q220,10 240,42 Q260,20 280,50 Q300,30 320,55 Q340,25 360,52 Q380,35 400,55 L400,80Z" fill={safeAccent} opacity="0.6" />
        </svg>
      </div>

      {/* Waterfall effect top */}
      <div className="absolute top-0 right-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 80 120" width={fullscreen ? 100 : 55}>
          {[0, 1, 2, 3].map(i => (
            <path key={i} d={`M${20 + i * 15},0 Q${22 + i * 15},40 ${18 + i * 15},80 Q${20 + i * 15},100 ${22 + i * 15},120`}
              stroke={safeAccent} strokeWidth="2" fill="none" opacity={0.6 - i * 0.1} />
          ))}
        </svg>
      </div>

      {/* Border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(127,223,255,0.2)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.3em]`} style={{ color: '#7FDFFF', opacity: 0.8, textShadow: sh }}>
          Fête des Mères 2026
        </p>

        <div style={{ fontSize: fullscreen ? '2rem' : '1.2rem' }}>🌊</div>

        <h1 className={`${titleSize} italic font-bold leading-tight text-emerald-100`}
          style={{ textShadow: sh }}>
          {recipientName || 'Maman'},<br />ma source de vie
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to right, transparent, #7FDFFF)' }} />
          <span style={{ color: '#7FDFFF', fontSize: fullscreen ? '1rem' : '0.65rem', textShadow: sh }}>❧</span>
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to left, transparent, #7FDFFF)' }} />
        </div>

        <p className={`${msgSize} leading-relaxed text-emerald-100`}
          style={{ whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif', textShadow: sh }}>
          {message || 'Je t\'aime de tout mon cœur.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: safeAccent, textShadow: sh }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-emerald-200`} style={{ fontFamily: '"Lato", sans-serif', textShadow: sh }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
