import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardCreole({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#B83A1A')
  const sh = ''
  const petalsRef = useRef(null)

  useEffect(() => {
    if (!petalsRef.current) return
    const container = petalsRef.current
    const colors = ['#FF4500', '#FF6B00', '#FFC300', '#FF3300', '#FFD700']
    const embers = []
    for (let i = 0; i < 22; i++) {
      const el = document.createElement('div')
      el.className = 'ember'
      const size = Math.random() * 7 + 3
      const dx = (Math.random() - 0.5) * 160
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 100}%;
        bottom:${Math.random() * 20}%;
        animation-duration:${Math.random() * 3 + 2}s;
        animation-delay:${Math.random() * 6}s;
        --dx:${dx}px;
        box-shadow:0 0 ${size * 2}px ${colors[0]};
        opacity:0;
      `
      container.appendChild(el)
      embers.push(el)
    }
    return () => embers.forEach(e => e.remove())
  }, [fullscreen])

  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const hibiscus = (size) => (
    <svg viewBox="0 0 60 60" width={size} height={size}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse
          key={a}
          cx={30 + 16 * Math.cos((a * Math.PI) / 180)}
          cy={30 + 16 * Math.sin((a * Math.PI) / 180)}
          rx="11" ry="6"
          fill={safeAccent} opacity="0.85"
          transform={`rotate(${a} ${30 + 16 * Math.cos((a * Math.PI) / 180)} ${30 + 16 * Math.sin((a * Math.PI) / 180)})`}
        />
      ))}
      <circle cx="30" cy="30" r="8" fill={safeAccent} opacity="0.7" />
      <circle cx="30" cy="30" r="4" fill="white" opacity="0.6" />
    </svg>
  )

  const sz = fullscreen ? 72 : 40

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/creole.avif), linear-gradient(145deg, #6B1A0A 0%, #B83A1A 35%, #D4652A 65%, #E8A020 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(40,8,4,0)' }} />
      <div ref={petalsRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />


      {/* Dotted pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="absolute h-px w-full" style={{
            top: `${18 + i * 13}%`,
            background: 'repeating-linear-gradient(90deg, #fff 0, #fff 5px, transparent 5px, transparent 11px)',
          }} />
        ))}
      </div>

      {/* Gold border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(240,180,20,0.5)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.3em] text-[#991b1b]`}>Fête des Mères 2026</p>

        <h1 className={`${titleSize} italic font-bold leading-tight text-[#7f1d1d]`}
          style={{}}>
          Amour Créole,<br />{recipientName || 'Maman'}
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-50" style={{ background: 'linear-gradient(to right, transparent, #F0B414)' }} />
          <span style={{ color: '#F0B414', fontSize: fullscreen ? '1.1rem' : '0.75rem', textShadow: sh }}>✦</span>
          <div className="h-px flex-1 opacity-50" style={{ background: 'linear-gradient(to left, transparent, #F0B414)' }} />
        </div>

        <p className={`${msgSize} leading-loose text-[#7f1d1d]`}
          style={{ whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif' }}>
          {message || 'Dans ta chaleur créole,\nj\'ai appris l\'amour et la joie de vivre.\nJe t\'aime, Maman.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: '#7f1d1d' }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-[#b91c1c]`} style={{ fontFamily: '"Lato", sans-serif' }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
