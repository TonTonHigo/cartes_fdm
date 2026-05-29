import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardSoleil({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#0284C7')
  const sh = ''
  const sparklesRef = useRef(null)

  useEffect(() => {
    if (!sparklesRef.current) return
    const container = sparklesRef.current
    const rays = []
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      el.className = 'ray'
      const size = Math.random() * 8 + 3
      const colors = ['#FDE68A', '#FCD34D', '#FBBF24', '#ffffff']
      const color = colors[Math.floor(Math.random() * colors.length)]
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:${color};
        bottom:${Math.random() * 30}%;
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 3 + 2}s;
        animation-delay:${Math.random() * 7}s;
        box-shadow:0 0 ${size * 3}px ${color};
        filter:blur(0.5px);
      `
      container.appendChild(el)
      rays.push(el)
    }
    return () => rays.forEach(r => r.remove())
  }, [fullscreen])
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const rays = Array.from({ length: 12 }).map((_, i) => i * 30)

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/soleil.avif), linear-gradient(180deg, #0C4A6E 0%, #0284C7 25%, #38BDF8 50%, #7DD3FC 70%, #FDE68A 88%, #F59E0B 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(5,35,70,0)' }} />
      <div ref={sparklesRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />

      {/* Sun */}
      <div className="absolute pointer-events-none" style={{
        bottom: fullscreen ? '-60px' : '-30px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: fullscreen ? 180 : 90,
        height: fullscreen ? 180 : 90,
      }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          {rays.map(angle => (
            <line key={angle}
              x1="50" y1="50"
              x2={50 + 48 * Math.cos((angle - 90) * Math.PI / 180)}
              y2={50 + 48 * Math.sin((angle - 90) * Math.PI / 180)}
              stroke={safeAccent} strokeWidth="2" opacity="0.6"
            />
          ))}
          <circle cx="50" cy="50" r="28" fill={safeAccent} opacity="0.5" />
          <circle cx="50" cy="50" r="20" fill={safeAccent} />
        </svg>
      </div>

      {/* Ocean waves bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: fullscreen ? 70 : 35 }}>
        <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="w-full h-full">
          <path d="M0,40 Q50,10 100,35 Q150,60 200,30 Q250,5 300,35 Q350,60 400,30 L400,70 L0,70Z" fill="#0284C7" opacity="0.4" />
          <path d="M0,55 Q50,30 100,50 Q150,70 200,45 Q250,25 300,50 Q350,70 400,45 L400,70 L0,70Z" fill="#0C4A6E" opacity="0.5" />
        </svg>
      </div>

      {/* Sparkles */}
      {[
        { top: '15%', left: '10%' }, { top: '20%', right: '12%' },
        { top: '35%', left: '5%' }, { top: '30%', right: '8%' },
      ].map((pos, i) => (
        <div key={i} className="absolute pointer-events-none opacity-60" style={{ ...pos, color: safeAccent, fontSize: fullscreen ? '1.2rem' : '0.7rem' }}>✦</div>
      ))}

      {/* Border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(253,230,138,0.3)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.3em] text-[#075985]`}>
          Fête des Mères
        </p>

        <h1 className={`${titleSize} italic font-bold leading-tight text-[#0c4a6e]`}
          style={{}}>
          {recipientName || 'Maman'},<br />mon soleil
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to right, transparent, #FDE68A)' }} />
          <span style={{ color: '#FDE68A', fontSize: fullscreen ? '1rem' : '0.65rem', textShadow: sh }}>☀</span>
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to left, transparent, #FDE68A)' }} />
        </div>

        <p className={`${msgSize} leading-loose text-[#0c4a6e]`}
          style={{ whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif' }}>
          {message || 'Tu es mon soleil,\ntu réchauffes mon cœur chaque jour.\nJe t\'aime.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: '#0c4a6e' }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-[#0369a1]`} style={{ fontFamily: '"Lato", sans-serif' }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
