import { ensureContrast } from '../../utils/colorUtils'

export default function CardAquarelle({ data, fullscreen = false }) {
  const { senderName, recipientName, message, signature, accentColor } = data
  const safeAccentOnWhite = ensureContrast(accentColor, '#ffffff')

  const msgSize = fullscreen ? 'text-xl' : 'text-sm'
  const titleSize = fullscreen ? 'text-4xl' : 'text-xl'
  const pad = fullscreen ? 'p-12' : 'p-6'
  const smallText = fullscreen ? 'text-base' : 'text-xs'

  const blobs = [
    { top: '-5%', left: '-5%', w: 280, h: 220, color: '#fce7f3', opacity: 0.7, r: '60% 40% 55% 45%/50% 60% 40% 50%' },
    { top: '-8%', right: '-8%', w: 240, h: 200, color: '#ede9fe', opacity: 0.6, r: '40% 60% 40% 60%/55% 45% 55% 45%' },
    { bottom: '-5%', left: '-3%', w: 260, h: 180, color: '#d1fae5', opacity: 0.5, r: '55% 45% 55% 45%/40% 60% 40% 60%' },
    { bottom: '-8%', right: '-5%', w: 300, h: 200, color: '#fef3c7', opacity: 0.5, r: '45% 55% 45% 55%/60% 40% 60% 40%' },
    { top: '30%', left: '60%', w: 180, h: 150, color: '#fbcfe8', opacity: 0.4, r: '50% 50% 50% 50%/40% 60% 40% 60%' },
  ]

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${pad} flex flex-col items-center justify-center text-center`}
      style={{
        background: 'white',
        minHeight: fullscreen ? '100vh' : '280px',
        fontFamily: '"Playfair Display", Georgia, serif',
      }}
    >
      {/* Watercolor blobs */}
      {blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute pointer-events-none"
          style={{
            top: blob.top,
            left: blob.left,
            right: blob.right,
            bottom: blob.bottom,
            width: fullscreen ? blob.w * 1.5 : blob.w,
            height: fullscreen ? blob.h * 1.5 : blob.h,
            background: blob.color,
            opacity: blob.opacity,
            borderRadius: blob.r,
            filter: 'blur(2px)',
          }}
        />
      ))}

      {/* Dots pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        {Array.from({ length: fullscreen ? 80 : 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 4,
              height: 4,
              background: accentColor,
              top: `${Math.sin(i * 2.1) * 45 + 50}%`,
              left: `${(i / (fullscreen ? 80 : 40)) * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Border */}
      <div
        className="absolute inset-4 rounded-xl border pointer-events-none"
        style={{ borderColor: `${accentColor}30`, borderStyle: 'dashed' }}
      />

      <div className="relative z-10 space-y-4 max-w-lg">
        <div className="flex justify-center">
          <div
            className="px-4 py-1 rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${safeAccentOnWhite}, #7e22ce)`, fontSize: fullscreen ? '0.875rem' : '0.65rem' }}
          >
            Fête des Mères 2026
          </div>
        </div>

        <h1 className={`${titleSize} italic font-bold leading-tight`} style={{ color: '#581c87' }}>
          À {recipientName || 'Maman'}<br />avec amour
        </h1>

        <div className="flex items-center gap-3 justify-center py-1">
          {['🌸', '🌼', '🌸'].map((f, i) => (
            <span key={i} style={{ fontSize: fullscreen ? '1.5rem' : '0.875rem' }}>{f}</span>
          ))}
        </div>

        <p
          className={`${msgSize} leading-relaxed`}
          style={{ color: '#374151', whiteSpace: 'pre-wrap', fontFamily: '"Lato", sans-serif' }}
        >
          {message || 'Je t\'aime de tout mon cœur.'}
        </p>

        <div className="pt-2 space-y-1">
          <p className={`${fullscreen ? 'text-2xl' : 'text-base'} font-script`} style={{ color: safeAccentOnWhite }}>
            {signature || 'Avec tout mon amour'}
          </p>
          {senderName && (
            <p className={`${smallText}`} style={{ color: '#4b5563', fontFamily: '"Lato", sans-serif' }}>
              — {senderName}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
