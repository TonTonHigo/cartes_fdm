import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardHauts({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccent = ensureContrast(accentColor, '#1A3A22')
  const sh = ''
  const flakesRef = useRef(null)

  useEffect(() => {
    if (!flakesRef.current) return
    const container = flakesRef.current
    const mist = []
    const flakes = []
    for (let i = 0; i < 24; i++) {
      const el = document.createElement('div')
      el.className = 'snowflake'
      const size = Math.random() * 8 + 3
      const dx = (Math.random() - 0.5) * 60
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background:rgba(255,255,255,0.9);
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 5 + 6}s;
        animation-delay:${Math.random() * 8}s;
        --dx:${dx}px;
        box-shadow:0 0 4px rgba(255,255,255,0.8);
        opacity:0;
      `
      container.appendChild(el)
      flakes.push(el)
    }
    return () => flakes.forEach(f => f.remove())
  }, [fullscreen])
  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/nuit.avif), linear-gradient(180deg, #0F1F14 0%, #1A3A22 20%, #2D5A35 45%, #4A7A58 65%, #7A9E82 80%, #B8CCB8 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(8,15,10,0)' }} />
      <div ref={flakesRef} className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }} />

      {/* Mountain silhouette */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="w-full" style={{ height: fullscreen ? 160 : 80 }}>
          <path d="M0,120 L80,40 L140,75 L200,20 L260,65 L320,35 L400,80 L400,120Z" fill="#1A3A22" opacity="0.8" />
          <path d="M0,120 L60,70 L100,90 L160,55 L220,80 L280,50 L340,75 L400,60 L400,120Z" fill="#0F1F14" opacity="0.6" />
        </svg>
      </div>


      {/* Stars top */}
      {Array.from({ length: fullscreen ? 15 : 8 }).map((_, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          top: `${Math.random() * 30}%`,
          left: `${(i / (fullscreen ? 15 : 8)) * 100}%`,
          width: 2, height: 2,
          borderRadius: '50%',
          background: 'white',
          opacity: 0.6,
        }} />
      ))}

      {/* Border */}
      <div className="absolute inset-3 rounded-xl pointer-events-none" style={{ border: '1px solid rgba(184,204,184,0.25)' }} />

      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-[0.3em]`} style={{ color: '#B8CCB8', opacity: 0.8, textShadow: sh }}>
          Fête des Mères
        </p>

        <div style={{ fontSize: fullscreen ? '1.8rem' : '1rem' }}>🏔️</div>

        <h1 className={`${titleSize} italic font-bold leading-tight`}
          style={{ color: '#E8F0E8', textShadow: `0 2px 12px rgba(0,0,0,0.6), ${sh}` }}>
          Maman Étoile,<br />{recipientName || 'Maman'}
        </h1>

        <div className="flex items-center gap-2 justify-center">
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to right, transparent, #B8CCB8)' }} />
          <span style={{ color: '#B8CCB8', fontSize: fullscreen ? '1rem' : '0.65rem', textShadow: sh }}>⋆</span>
          <div className="h-px flex-1 opacity-40" style={{ background: 'linear-gradient(to left, transparent, #B8CCB8)' }} />
        </div>

        <p className={`${msgSize} leading-loose`}
          style={{ color: '#D4E4D4', whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif', textShadow: sh }}>
          {message || 'Tu es mon étoile,\ncelle qui guide mes pas\ndans la nuit.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: safeAccent, textShadow: sh }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText}`} style={{ color: '#B8CCB8', fontFamily: '"Lato", sans-serif', textShadow: sh }}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
