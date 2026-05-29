import { useEffect, useRef } from 'react'
import { ensureContrast } from '../../utils/colorUtils'

export default function CardSunset({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccentOnDark = ensureContrast(accentColor, '#2d1b69')
  const sh = ''
  const starsRef = useRef(null)

  useEffect(() => {
    if (!starsRef.current) return
    const container = starsRef.current
    const stars = []

    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div')
      el.className = 'star'
      const size = Math.random() * 4 + 2
      el.style.cssText = `
        width:${size}px; height:${size}px;
        background: white;
        top:${Math.random() * 40}%;
        left:${Math.random() * 100}%;
        animation-duration:${Math.random() * 2 + 1.5}s;
        animation-delay:${Math.random() * 3}s;
      `
      container.appendChild(el)
      stars.push(el)
    }
    return () => stars.forEach(s => s.remove())
  }, [fullscreen])

  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6 pb-14'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  return (
    <div
      className={`relative overflow-hidden ${fullscreen ? '' : 'rounded-2xl'} ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        backgroundImage: 'url(/images/cartes/coucher_soleil.avif), linear-gradient(180deg, #1a1035 0%, #2d1b69 20%, #7c3aed 45%, #db2777 65%, #f97316 80%, #fbbf24 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(10,5,30,0)' }} />
      <div ref={starsRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} />


      <div className="relative z-10 space-y-4 max-w-lg">
        <p className={`${smallText} uppercase tracking-widest text-[#4a1d96]`}>
          Fête des Mères
        </p>

        <h1 className={`${titleSize} italic font-bold leading-tight text-[#3b0764]`}>
          Maman Étoile,<br />{recipientName || 'Maman'}
        </h1>

        <div className="py-1">
          <div className="flex items-center gap-2 justify-center">
            <div className="h-px flex-1 opacity-60" style={{ background: `linear-gradient(to right, transparent, ${safeAccentOnDark})` }} />
            <span className="text-lg" style={{ color: safeAccentOnDark, textShadow: sh }}>★</span>
            <div className="h-px flex-1 opacity-60" style={{ background: `linear-gradient(to left, transparent, ${safeAccentOnDark})` }} />
          </div>
        </div>

        <p
          className={`${msgSize} leading-loose text-[#3b0764]`}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {message || 'Tu es mon étoile,\ncelle qui guide mes pas dans la nuit.\nJe t\'aime infiniment.'}
        </p>

        <div className="pt-2">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: '#3b0764' }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText} text-[#5b21b6] mt-1`}>— {senderName}</p>
          )}
        </div>
      </div>
    </div>
  )
}
