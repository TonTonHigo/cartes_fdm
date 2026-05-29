import { useState, useMemo } from 'react'
import CardRenderer from './CardRenderer'
import { encodeCard, getCardUrl } from '../utils/cardEncoder'
import { sendCardByEmail, isEmailJsConfigured } from '../utils/emailService'

const TEMPLATES = [
  {
    id: 'floral',
    name: 'Maman Fleurie',
    desc: 'Rose & Pétales',
    preview: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
    emoji: '🌸',
  },
  {
    id: 'sunset',
    name: 'Maman Soleil',
    desc: 'Coucher de Soleil',
    preview: 'linear-gradient(180deg, #1a1035 0%, #7c3aed 50%, #fbbf24 100%)',
    emoji: '🏔️',
  },
  {
    id: 'aquarelle',
    name: 'Maman Fruitée',
    desc: 'Pastels & Douceur',
    preview: 'linear-gradient(135deg, #fce7f3, #ede9fe, #d1fae5)',
    emoji: '🎨',
  },
  {
    id: 'royal',
    name: 'Maman Sportive',
    desc: 'Or & Mystère',
    preview: 'linear-gradient(145deg, #1e0a3c, #2d1557)',
    emoji: '👑',
  },
  {
    id: 'creole',
    name: 'Maman Créole',
    desc: 'Tradition & Chaleur',
    preview: 'linear-gradient(145deg, #6B1A0A, #D4652A, #E8A020)',
    emoji: '🌺',
  },
  {
    id: 'lontan',
    name: 'Maman Lontan',
    desc: 'Nostalgie & Douceur',
    preview: 'linear-gradient(160deg, #2C1A0E, #8B6340, #E8D5B0)',
    emoji: '🌿',
  },
  {
    id: 'nature',
    name: 'Maman Bronzette',
    desc: 'Jungle & Cascade',
    preview: 'linear-gradient(160deg, #071E0A, #1A7A3A, #0C5E6E)',
    emoji: '🌊',
  },
  {
    id: 'soleil',
    name: 'Maman Nature',
    desc: 'Plage & Lagon',
    preview: 'linear-gradient(180deg, #0C4A6E, #38BDF8, #F59E0B)',
    emoji: '🌿',
  },
  {
    id: 'hauts',
    name: 'Maman Étoile',
    desc: 'Ciel Étoilé',
    preview: 'linear-gradient(180deg, #0F1F14, #2D5A35, #B8CCB8)',
    emoji: '🌿',
  },
  {
    id: 'gourmande',
    name: 'Maman Gourmande',
    desc: 'Épices & Partage',
    preview: 'linear-gradient(145deg, #2C0F00, #C4501E, #F59E0B)',
    emoji: '🍲',
  },
]

const DEFAULT_DATA = {
  template: 'floral',
  recipientName: 'Maman',
  senderName: '',
  message: '',
  signature: 'Avec tout mon amour',
  accentColor: '#f43f5e',
}

const ACCENT_COLORS = [
  { value: '#f43f5e', label: 'Rose' },
  { value: '#ec4899', label: 'Fuchsia' },
  { value: '#a855f7', label: 'Violet' },
  { value: '#3b82f6', label: 'Bleu' },
  { value: '#047857', label: 'Émeraude' },
  { value: '#f59e0b', label: 'Or' },
]

const STEPS = ['Modèle', 'Personnaliser', 'Envoyer']

export default function CardEditor() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState(DEFAULT_DATA)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState(null)
  const [cardUrl, setCardUrl] = useState(null)
  const [copied, setCopied] = useState(false)

  const update = (field, value) => setData(prev => ({ ...prev, [field]: value }))

  const generateUrl = () => {
    const id = encodeCard(data)
    const url = getCardUrl(id)
    setCardUrl(url)
    return url
  }

  const handleNext = () => {
    if (step === 1) generateUrl()
    setStep(s => Math.min(s + 1, 2))
  }

  const handleSend = async () => {
    if (!email) return setError('Veuillez entrer l\'adresse email de votre maman.')
    setSending(true)
    setError(null)
    try {
      const url = cardUrl || generateUrl()
      await sendCardByEmail({
        toEmail: email,
        senderName: data.senderName || 'Quelqu\'un qui vous aime',
        recipientName: data.recipientName,
        cardUrl: url,
      })
      setSent(true)
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi. Vérifiez la configuration EmailJS.')
    } finally {
      setSending(false)
    }
  }

  const copyUrl = async () => {
    const url = cardUrl || generateUrl()
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const navButtons = (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-2">
        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 font-sans text-sm hover:bg-rose-50 transition-all"
          >
            ← Retour
          </button>
        )}
        {step === 2 && (
          <button
            onClick={() => { setStep(0); setData(DEFAULT_DATA); setCardUrl(null); setEmail('') }}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-700 font-sans text-sm hover:bg-rose-50 transition-all"
          >
            🎨 Nouvelle carte
          </button>
        )}
      </div>
      {step === 1 && (
        <button
          onClick={handleNext}
          className="px-5 py-2 rounded-xl text-white font-sans text-sm font-bold shadow-lg
            hover:opacity-90 active:scale-95 transition-all"
          style={{ background: '#be185d' }}
        >
          Suivant →
        </button>
      )}
    </div>
  )

  if (sent) return <SuccessScreen cardUrl={cardUrl} recipientName={data.recipientName} onReset={() => { setSent(false); setStep(0); setData(DEFAULT_DATA); setCardUrl(null) }} />

  return (
    <>
      {/* ── MOBILE : 1 écran fixe, pas de scroll ── */}
      <div className="md:hidden h-dvh flex flex-col overflow-hidden bg-gradient-to-br from-rose-50 via-white to-purple-50 px-4 pt-4 pb-[72px]">
        <CornerDecorations />
        <HeartBackground />
        <div className="flex-1 min-h-0 flex flex-col w-full" style={{ position: 'relative', zIndex: 1 }}>
          <div className="flex-shrink-0 text-center mb-2">
            <h1 className="text-xl font-serif-display font-bold text-rose-700 italic">Carte Fête des Mères</h1>
          </div>
          <div className="flex-shrink-0"><StepIndicator steps={STEPS} current={step} /></div>
          <div className="flex-1 min-h-0 mt-2">
            <div className="h-full flex flex-col bg-white rounded-2xl shadow-xl p-4 border border-rose-100">
              {step === 0 && (
                <div className="flex-1 min-h-0">
                  <StepTemplates templates={TEMPLATES} selected={data.template} onSelect={t => update('template', t)} onConfirm={() => setStep(1)} data={data} />
                </div>
              )}
              {step === 1 && (
                <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
                  <div className="card-preview-container rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <div className="card-preview-inner"><CardRenderer data={data} fullscreen={false} /></div>
                  </div>
                  <StepCustomize data={data} update={update} colors={ACCENT_COLORS} />
                </div>
              )}
              {step === 2 && (
                <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto">
                  <div className="card-preview-container rounded-xl overflow-hidden shadow-md flex-shrink-0">
                    <div className="card-preview-inner"><CardRenderer data={data} fullscreen={false} /></div>
                  </div>
                  <StepSend data={data} cardUrl={cardUrl} email={email} setEmail={setEmail} onSend={handleSend} onCopy={copyUrl} copied={copied} sending={sending} error={error} emailjsConfigured={isEmailJsConfigured()} />
                </div>
              )}
            </div>
          </div>
        </div>
        {step > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-rose-100 py-3 z-40 px-4">
            {navButtons}
          </div>
        )}
      </div>

      {/* ── DESKTOP : scroll normal ── */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 px-4 pt-4 pb-8">
        <CornerDecorations />
        <HeartBackground />
        <div className="mx-auto w-full max-w-xl sm:max-w-2xl lg:max-w-3xl" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-3">
            <h1 className="text-2xl font-serif-display font-bold text-rose-700 italic mb-1">Carte Fête des Mères</h1>
          </div>
          <StepIndicator steps={STEPS} current={step} />
          <div className="mt-3 bg-white rounded-2xl shadow-xl p-4 border border-rose-100">
            {step === 0 && (
              <StepTemplates templates={TEMPLATES} selected={data.template} onSelect={t => update('template', t)} onConfirm={() => setStep(1)} data={data} />
            )}
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div className="card-preview-container rounded-xl overflow-hidden shadow-md">
                  <div className="card-preview-inner"><CardRenderer data={data} fullscreen={false} /></div>
                </div>
                <StepCustomize data={data} update={update} colors={ACCENT_COLORS} />
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="card-preview-container rounded-xl overflow-hidden shadow-md">
                  <div className="card-preview-inner"><CardRenderer data={data} fullscreen={false} /></div>
                </div>
                <StepSend data={data} cardUrl={cardUrl} email={email} setEmail={setEmail} onSend={handleSend} onCopy={copyUrl} copied={copied} sending={sending} error={error} emailjsConfigured={isEmailJsConfigured()} />
              </div>
            )}
          </div>
          {step > 0 && (
            <div className="mt-4">{navButtons}</div>
          )}
        </div>
      </div>
    </>
  )
}

function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold font-sans transition-all duration-300 ${
                i === current
                  ? 'text-white shadow-lg scale-110'
                  : i < current
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
              style={i <= current ? { background: '#be185d' } : {}}
            >
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-sans ${i === current ? 'text-rose-700 font-bold' : 'text-gray-600'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-12 h-0.5 mb-4 rounded transition-all duration-300 ${i < current ? 'bg-rose-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function StepTemplates({ templates, selected, onSelect, onConfirm, data }) {
  return (
    <div className="h-full flex flex-col">
      <h2 className="flex-shrink-0 text-base font-serif-display font-bold text-gray-800 mb-1">
        Faites défiler et choisissez votre thème
      </h2>
      <p className="flex-shrink-0 text-xs text-gray-600 mb-2 font-sans">Tapez pour personnaliser</p>
      <div className="flex-1 min-h-0 overflow-y-auto px-2 pr-2 md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {templates.map(t => (
          <div key={t.id} className="pb-1">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-base">{t.emoji}</span>
              <span className="text-sm font-bold text-gray-700 font-serif-display">{t.name}</span>
              <span className="text-xs text-gray-500">· {t.desc}</span>
            </div>
            <div className="relative card-border-spin">
              <button
                onClick={() => { onSelect(t.id); onConfirm() }}
                className={`w-full rounded-2xl border-2 transition-all duration-200 ${
                  selected === t.id ? 'border-transparent shadow-xl' : 'border-transparent'
                }`}
                style={{ height: '260px', display: 'block', overflow: 'hidden' }}
              >
                <div style={{ height: '260px', overflow: 'hidden', borderRadius: '14px', position: 'relative' }} className="[&_.z-10]:!opacity-0">
                  <CardRenderer data={{ ...data, template: t.id, message: '', senderName: '' }} fullscreen={false} />
                  <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none rounded-b-2xl"
                    style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.4))' }} />
                </div>
              </button>
              {/* Indicateur de clic — flèche desktop, main tablette */}
              <img
                src="/images/arrow-pointer-solid-full.svg"
                alt=""
                className="hidden md:block absolute -bottom-3 right-1 w-6 h-6 pointer-events-none [filter:drop-shadow(0_1px_0_black)_drop-shadow(0_-1px_0_black)_drop-shadow(1px_0_0_black)_drop-shadow(-1px_0_0_black)]"
              />
              <img
                src="/images/hand-pointer-solid-full.svg"
                alt=""
                className="block md:hidden absolute -bottom-3 right-1 w-6 h-6 pointer-events-none [filter:drop-shadow(0_1px_0_black)_drop-shadow(0_-1px_0_black)_drop-shadow(1px_0_0_black)_drop-shadow(-1px_0_0_black)]"
              />
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

function StepCustomize({ data, update, colors }) {
  return (
    <div className="space-y-3">

      <Field label="Pour (prénom ou surnom)" required>
        <input
          type="text"
          value={data.recipientName}
          onChange={e => update('recipientName', e.target.value)}
          placeholder="Maman"
          className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
        />
      </Field>

      <Field label="De la part de">
        <input
          type="text"
          value={data.senderName}
          onChange={e => update('senderName', e.target.value)}
          placeholder="Votre prénom"
          className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
        />
      </Field>

      <Field label="Votre message" required>
        <textarea
          value={data.message}
          onChange={e => update('message', e.target.value.slice(0, 150))}
          rows={4}
          placeholder="Écrivez votre message du cœur..."
          className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
        />
        <p className={`text-xs mt-1 font-sans ${data.message.length >= 150 ? 'text-red-700 font-semibold' : 'text-gray-600'}`}>
          {data.message.length}/150 caractères
        </p>
      </Field>

      <Field label="Signature">
        <input
          type="text"
          value={data.signature}
          onChange={e => update('signature', e.target.value)}
          placeholder="Avec tout mon amour"
          className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
        />
      </Field>

    </div>
  )
}

function StepSend({ data, cardUrl, email, setEmail, onSend, onCopy, copied, sending, error, emailjsConfigured }) {
  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-base font-serif-display font-bold text-gray-800 mb-0.5">Envoyer la carte</h2>
      </div>

      {/* Card URL */}
      <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
        <p className="text-xs font-sans font-bold text-rose-700 uppercase tracking-wide mb-2">🔗 Lien unique de votre carte</p>
        <div className="flex gap-2">
          <input
            readOnly
            value={cardUrl || '(généré automatiquement)'}
            className="flex-1 text-xs bg-white border border-rose-200 rounded-lg px-3 py-2 font-mono text-gray-600 truncate"
          />
          <button
            onClick={onCopy}
            className="px-3 py-2 rounded-lg text-white text-xs font-bold font-sans transition-all active:scale-95"
            style={{ background: copied ? '#047857' : '#be185d' }}
          >
            {copied ? '✓ Copié !' : 'Copier'}
          </button>
        </div>
      </div>

      {/* Email section */}
      {emailjsConfigured ? (
        <div className="space-y-3">
          <Field label={`Email de ${data.recipientName || 'Maman'}`} required>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="maman@exemple.fr"
                className="flex-1 px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
              />
              <button
                onClick={onSend}
                disabled={sending || !email}
                className="flex-shrink-0 px-3 py-2.5 rounded-xl text-white font-bold font-sans text-sm shadow-lg
                  hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{ background: '#be185d' }}
              >
                {sending ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin block" />
                ) : '💌 Envoyer'}
              </button>
            </div>
          </Field>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-sans">
              ⚠️ {error}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-sans space-y-2">
          <p className="font-bold">⚙️ Configuration EmailJS requise</p>
          <p>Pour activer l'envoi par email :</p>
          <ol className="list-decimal ml-4 space-y-1 text-xs">
            <li>Créez un compte sur <strong>emailjs.com</strong></li>
            <li>Configurez un service email (Gmail, Outlook…)</li>
            <li>Créez un template avec <code className="bg-amber-100 px-1 rounded">{'{{card_url}}'}</code></li>
            <li>Copiez vos clés dans un fichier <code className="bg-amber-100 px-1 rounded">.env</code></li>
          </ol>
          <p className="text-xs">En attendant, copiez le lien ci-dessus et partagez-le manuellement.</p>
        </div>
      )}
    </div>
  )
}

function CornerDecorations() {
  const corners = [
    {
      top: 0, left: 0,
      position: '0% 0%',
      mask: 'radial-gradient(ellipse 100% 100% at top left, black 45%, transparent 80%)',
    },
    {
      top: 0, right: 0,
      position: '100% 0%',
      mask: 'radial-gradient(ellipse 100% 100% at top right, black 30%, transparent 75%)',
    },
    {
      bottom: 0, right: 0,
      position: '100% 100%',
      mask: 'radial-gradient(ellipse 100% 100% at bottom right, black 30%, transparent 75%)',
    },
  ]
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {corners.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: c.top, left: c.left, right: c.right, bottom: c.bottom,
            width: 520, height: 620,
            backgroundImage: 'url(/images/design_fond.avif)',
            backgroundSize: '1400px auto',
            backgroundPosition: c.position,
            backgroundRepeat: 'no-repeat',
            WebkitMaskImage: c.mask,
            maskImage: c.mask,
            opacity: 0.95,
          }}
        />
      ))}
    </div>
  )
}

function HeartBackground() {
  const hearts = useMemo(() => {
    const colors = ['#fda4af', '#f9a8d4', '#c084fc', '#fb923c', '#f43f5e', '#e879f9']
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.round(Math.random() * 92)}%`,
      size: Math.round(Math.random() * 20 + 10),
      color: colors[i % colors.length],
      duration: Math.round(Math.random() * 8 + 8),
      delay: Math.round(Math.random() * 8),
      sway: Math.round((Math.random() - 0.5) * 70),
      opacity: (Math.random() * 0.2 + 0.15).toFixed(2),
    }))
  }, [])

  const heartPath = 'M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z'

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {hearts.map(h => (
        <div
          key={h.id}
          className="heart-float"
          style={{
            left: h.left,
            width: h.size,
            height: h.size,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            '--op': h.opacity,
            '--sway': `${h.sway}px`,
          }}
        >
          <svg viewBox="0 0 24 24" width={h.size} height={h.size} fill={h.color}>
            <path d={heartPath} />
          </svg>
        </div>
      ))}
    </div>
  )
}

function Field({ label, children, required }) {
  return (
    <div>
      <label className="block text-sm font-sans font-semibold text-gray-700 mb-1.5">
        {label}{required && <span className="text-rose-700 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function SuccessScreen({ cardUrl, recipientName, onReset }) {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    await navigator.clipboard.writeText(cardUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 animate-[slideUp_0.6s_ease-out_forwards]">
        <div className="text-7xl">💌</div>
        <h1 className="text-3xl font-serif-display font-bold italic text-rose-700">
          Carte envoyée !
        </h1>
        <p className="text-gray-600 font-sans">
          {recipientName || 'Votre maman'} va recevoir votre carte avec amour.
          Vous pouvez aussi partager ce lien directement :
        </p>
        <div className="bg-white rounded-xl p-4 shadow-md border border-rose-100 space-y-3">
          <input
            readOnly
            value={cardUrl}
            className="w-full text-xs font-mono bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 text-gray-600 truncate"
          />
          <button
            onClick={copyUrl}
            className="w-full py-2.5 rounded-xl text-white font-bold font-sans transition-all active:scale-95"
            style={{ background: copied ? '#047857' : '#be185d' }}
          >
            {copied ? '✓ Lien copié !' : 'Copier le lien'}
          </button>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-rose-700 font-sans underline transition-colors"
        >
          Créer une nouvelle carte
        </button>
      </div>
    </div>
  )
}
