import { useState } from 'react'
import CardRenderer from './CardRenderer'
import { encodeCard, getCardUrl } from '../utils/cardEncoder'
import { sendCardByEmail, isEmailJsConfigured } from '../utils/emailService'

const TEMPLATES = [
  {
    id: 'floral',
    name: 'Jardin Fleuri',
    desc: 'Rose & Pétales',
    preview: 'linear-gradient(135deg, #fce7f3, #fdf2f8)',
    emoji: '🌸',
  },
  {
    id: 'sunset',
    name: 'Coucher de Soleil',
    desc: 'Nuit Étoilée',
    preview: 'linear-gradient(180deg, #1a1035 0%, #7c3aed 50%, #fbbf24 100%)',
    emoji: '🌙',
  },
  {
    id: 'aquarelle',
    name: 'Aquarelle',
    desc: 'Pastels & Douceur',
    preview: 'linear-gradient(135deg, #fce7f3, #ede9fe, #d1fae5)',
    emoji: '🎨',
  },
  {
    id: 'royal',
    name: 'Royale',
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
    name: 'Maman Nature',
    desc: 'Jungle & Cascade',
    preview: 'linear-gradient(160deg, #071E0A, #1A7A3A, #0C5E6E)',
    emoji: '🌊',
  },
  {
    id: 'soleil',
    name: 'Maman Soleil',
    desc: 'Plage & Lagon',
    preview: 'linear-gradient(180deg, #0C4A6E, #38BDF8, #F59E0B)',
    emoji: '☀️',
  },
  {
    id: 'hauts',
    name: 'Maman des Hauts',
    desc: 'Montagne & Brume',
    preview: 'linear-gradient(180deg, #0F1F14, #2D5A35, #B8CCB8)',
    emoji: '🏔️',
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
  message: 'Tu es la femme la plus merveilleuse du monde.\nChaque jour, je suis reconnaissant(e) de t\'avoir dans ma vie.\nJe t\'aime infiniment.',
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

  if (sent) return <SuccessScreen cardUrl={cardUrl} recipientName={data.recipientName} onReset={() => { setSent(false); setStep(0); setData(DEFAULT_DATA); setCardUrl(null) }} />

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-[slideUp_0.6s_ease-out_forwards]">
          <h1 className="text-4xl md:text-5xl font-serif-display font-bold text-rose-700 italic mb-2">
            Carte Fête des Mères 2026
          </h1>
          <p className="text-gray-600 font-sans">Créez une carte unique et envoyez-la avec amour</p>
        </div>

        {/* Step indicator */}
        <StepIndicator steps={STEPS} current={step} />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Editor */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-rose-100">
            {step === 0 && (
              <StepTemplates
                templates={TEMPLATES}
                selected={data.template}
                onSelect={t => update('template', t)}
              />
            )}
            {step === 1 && (
              <StepCustomize
                data={data}
                update={update}
                colors={ACCENT_COLORS}
              />
            )}
            {step === 2 && (
              <StepSend
                data={data}
                cardUrl={cardUrl}
                email={email}
                setEmail={setEmail}
                onSend={handleSend}
                onCopy={copyUrl}
                copied={copied}
                sending={sending}
                error={error}
                emailjsConfigured={isEmailJsConfigured()}
              />
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-6 pt-4 border-t border-rose-50">
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(s => Math.max(s - 1, 0))}
                  disabled={step === 0}
                  className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-700 font-sans text-sm
                    hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  ← Retour
                </button>
                {step === 2 && (
                  <button
                    onClick={() => { setStep(0); setData(DEFAULT_DATA); setCardUrl(null); setEmail('') }}
                    className="px-5 py-2.5 rounded-xl border border-rose-200 text-rose-700 font-sans text-sm hover:bg-rose-50 transition-all"
                  >
                    🎨 Nouvelle carte
                  </button>
                )}
              </div>
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl text-white font-sans text-sm font-bold shadow-lg
                    hover:opacity-90 active:scale-95 transition-all"
                  style={{ background: 'linear-gradient(135deg, #be185d, #7e22ce)' }}
                >
                  Suivant →
                </button>
              ) : null}
            </div>
          </div>

          {/* Right: Live preview */}
          <div className="sticky top-8">
            <p className="text-center text-sm text-gray-600 mb-3 font-sans uppercase tracking-wide">
              Aperçu de la carte
            </p>
            <div className="shadow-2xl rounded-2xl overflow-hidden card-hover">
              <CardRenderer data={data} fullscreen={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
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
              style={i <= current ? { background: 'linear-gradient(135deg, #be185d, #7e22ce)' } : {}}
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

function StepTemplates({ templates, selected, onSelect }) {
  return (
    <div>
      <h2 className="text-xl font-serif-display font-bold text-gray-800 mb-1">Choisissez votre modèle</h2>
      <p className="text-sm text-gray-600 mb-5 font-sans">4 designs exclusifs pour la Fête des Mères</p>
      <div className="grid grid-cols-2 gap-3">
        {templates.map(t => (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`relative rounded-xl p-4 text-left transition-all duration-200 border-2 ${
              selected === t.id
                ? 'border-rose-500 shadow-lg scale-[1.02]'
                : 'border-transparent hover:border-rose-200 hover:scale-[1.01]'
            }`}
            style={{ background: t.preview }}
          >
            {selected === t.id && (
              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
            <div className="text-2xl mb-2">{t.emoji}</div>
            <div className="font-serif-display font-bold text-white text-shadow" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              {t.name}
            </div>
            <div className="text-xs mt-0.5 font-sans" style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {t.desc}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function StepCustomize({ data, update, colors }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-serif-display font-bold text-gray-800 mb-1">Personnalisez votre carte</h2>
        <p className="text-sm text-gray-600 font-sans">Les modifications s'affichent en temps réel</p>
      </div>

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

      <Field label="Couleur accent">
        <div className="flex gap-2 flex-wrap">
          {colors.map(c => (
            <button
              key={c.value}
              title={c.label}
              onClick={() => update('accentColor', c.value)}
              className={`w-8 h-8 rounded-full transition-all duration-150 ${
                data.accentColor === c.value ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
              }`}
              style={{ background: c.value }}
            />
          ))}
          <label className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-rose-400 transition-all" title="Couleur personnalisée">
            <span className="text-gray-600 text-xs">+</span>
            <input
              type="color"
              value={data.accentColor}
              onChange={e => update('accentColor', e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
      </Field>
    </div>
  )
}

function StepSend({ data, cardUrl, email, setEmail, onSend, onCopy, copied, sending, error, emailjsConfigured }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-serif-display font-bold text-gray-800 mb-1">Envoyer la carte</h2>
        <p className="text-sm text-gray-600 font-sans">Partagez l'amour avec votre maman 💕</p>
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
            style={{ background: copied ? '#047857' : 'linear-gradient(135deg, #be185d, #7e22ce)' }}
          >
            {copied ? '✓ Copié !' : 'Copier'}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 font-sans">
          Vous pouvez aussi envoyer ce lien directement par message ou réseaux sociaux.
        </p>
      </div>

      {/* Email section */}
      {emailjsConfigured ? (
        <div className="space-y-3">
          <Field label={`Email de ${data.recipientName || 'Maman'}`} required>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="maman@exemple.fr"
              className="w-full px-4 py-2.5 rounded-xl border border-rose-200 font-sans text-sm bg-rose-50/30 transition-all"
            />
          </Field>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 font-sans">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={onSend}
            disabled={sending || !email}
            className="w-full py-3.5 rounded-xl text-white font-bold font-sans text-base shadow-lg
              hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            style={{ background: 'linear-gradient(135deg, #be185d, #7e22ce)' }}
          >
            {sending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Envoi en cours…
              </span>
            ) : (
              '💌 Envoyer la carte par email'
            )}
          </button>
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
            style={{ background: copied ? '#047857' : 'linear-gradient(135deg, #be185d, #7e22ce)' }}
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
