import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardRoyal({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccentOnDark = ensureContrast(accentColor, '#1e0a3c')
  const sh = ''
  const particlesRef = useRef(null)

  useEffect(() => {
    if (!particlesRef.current) return
    const container = particlesRef.current
    const particles = []

    for (let i = 0; i < 25; i++) {
      const el = document.createElement('div')
      el.className = 'star'
      const size = Math.random() * 5 + 2
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background: ${safeAccentOnDark};
        border-radius: 50%;
        top:${Math.random() * 100}%;
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 3 + 2}s;
        animation-delay:${Math.random() * 4}s;
      `
      container.appendChild(el)
      particles.push(el)
    }
    return () => particles.forEach(p => p.remove())
  }, [fullscreen])

  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const ornament = (
    <svg viewBox="0 0 200 20" className="w-full opacity-60" style={{ maxWidth: fullscreen ? 300 : 180 }}>
      <line x1="0" y1="10" x2="70" y2="10" stroke={safeAccentOnDark} strokeWidth="1" />
      <path d="M80,10 L90,3 L100,10 L90,17 Z" fill={safeAccentOnDark} />
      <path d="M95,10 L100,5 L105,10 L100,15 Z" fill={safeAccentOnDark} />
      <path d="M110,10 L120,3 L130,10 L120,17 Z" fill={safeAccentOnDark} />
      <line x1="130" y1="10" x2="200" y2="10" stroke={safeAccentOnDark} strokeWidth="1" />
    </svg>
  )

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/sportive.avif), linear-gradient(145deg, #1e0a3c 0%, #2d1557 30%, #1a0a35 60%, #0f0520 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(8,2,25,0)' }} />
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Gold border */}
      <div
        className="absolute inset-3 rounded-xl pointer-events-none"
        style={{ border: '1.5px solid rgba(251,191,36,0.35)' }}
      />
      <div
        className="absolute inset-5 rounded-xl pointer-events-none"
        style={{ border: '0.5px solid rgba(251,191,36,0.15)' }}
      />


      <div className="relative z-10 space-y-4 max-w-lg">
        <div className="flex justify-center">{ornament}</div>

        <p className={`${smallText} uppercase tracking-[0.3em] text-[#553c9a]`}>
          Fête des Mères
        </p>

        <h1 className={`${titleSize} italic font-bold leading-tight text-[#44337a]`}
          style={{}}>
          Maman Sportive,<br />{recipientName || 'Maman'}
        </h1>

        <div className="flex justify-center">{ornament}</div>

        <p
          className={`${msgSize} leading-loose text-[#44337a]`}
          style={{ whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif' }}
        >
          {message || 'Tu es la championne de ma vie,\nforte, belle et inspirante.\nJe t\'aime de tout mon cœur.'}
        </p>

        <div className="pt-3 space-y-1">
          <p
            className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`}
            style={{ color: '#44337a' }}
          >
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-[#6b46c1]`}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
