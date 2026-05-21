import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardLontan({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#5C3D1E')
  const motesRef = useRef(null)

  useEffect(() => {
    if (!motesRef.current) return
    const container = motesRef.current
    const colors = ['#C4A882', '#D4B896', '#E8D5B0', '#B8975A', '#F0DEB8']
    const motes = []
    for (let i = 0; i < 25; i++) {
      const el = document.createElement('div')
      el.className = 'mote'
      const size = Math.random() * 5 + 2
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        left:${Math.random() * 80}%;
        top:${Math.random() * 80}%;
        animation-duration:${Math.random() * 8 + 6}s;
        animation-delay:${Math.random() * 10}s;
        filter:blur(0.5px);
        opacity:0;
      `
      container.appendChild(el)
      motes.push(el)
    }
    return () => motes.forEach(m => m.remove())
  }, [fullscreen])
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/lontan.avif), linear-gradient(160deg, #2C1A0E 0%, #5C3D1E 30%, #8B6340 60%, #C4A882 85%, #E8D5B0 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(25,12,4,0.5)' }} />
      <div ref={motesRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />

      {/* Vintage grain overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '150px' }} />

      {/* Leaf silhouettes */}
      {[
        { top: '-8%', left: '-5%', rot: 20 },
        { top: '-5%', right: '-8%', rot: -30 },
        { bottom: '-8%', left: '-6%', rot: -15 },
        { bottom: '-5%', right: '-5%', rot: 25 },
      ].map((pos, i) => (
        <div key={i} className="absolute opacity-20 pointer-events-none" style={{
          top: pos.top, left: pos.left, right: pos.right, bottom: pos.bottom,
          transform: `rotate(${pos.rot}deg)`,
        }}>
          <svg viewBox="0 0 80 120" width={fullscreen ? 120 : 70}>
            <path d="M40,5 C40,5 75,30 70,70 C65,100 40,115 40,115 C40,115 15,100 10,70 C5,30 40,5 40,5Z" fill="#5C3D1E" />
            <line x1="40" y1="5" x2="40" y2="115" stroke="#8B6340" strokeWidth="2" opacity="0.6" />
            {[20, 35, 50, 65, 80, 95].map(y => (
              <line key={y} x1="40" y1={y} x2={40 + 20 * Math.sin(y)} y2={y} stroke="#8B6340" strokeWidth="1" opacity="0.4" />
            ))}
          </svg>
        </div>
      ))}

      {/* Vintage double border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(196,168,130,0.4)' }} />
      <div className="absolute inset-5 rounded-xl pointer-events-none" style={{ border: '0.5px solid rgba(196,168,130,0.2)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.4em]`} style={{ color: '#D4B896' }}>
          Fête des Mères · 2026
        </p>

        <div style={{ color: '#C4A882', fontSize: fullscreen ? '1.8rem' : '1rem' }}>🌿</div>

        <h1 className={`${titleSize} italic font-bold leading-tight`}
          style={{ color: '#F0E0C0', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
          Lontan, aujourd'hui,<br />toujours toi, {recipientName || 'Maman'}
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to right, transparent, #C4A882)' }} />
          <span style={{ color: '#C4A882', fontSize: fullscreen ? '1rem' : '0.65rem' }}>◆</span>
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to left, transparent, #C4A882)' }} />
        </div>

        <p className={`${msgSize} leading-relaxed`}
          style={{ color: '#E8D5B0', whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif' }}>
          {message || 'Je t\'aime de tout mon cœur.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: safeAccent }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText}`} style={{ color: '#C4A882', fontFamily: '"Lato", sans-serif' }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
