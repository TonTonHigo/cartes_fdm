import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { decodeCard } from '../utils/cardEncoder'
import CardRenderer from '../components/CardRenderer'

export default function CardPage() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const cardRef = useRef(null)

  useEffect(() => {
    const decoded = decodeCard(id)
    if (decoded && decoded.template) {
      setData(decoded)
      setTimeout(() => setShowActions(true), 1200)
    } else {
      setError(true)
    }
  }, [id])

  const downloadCard = async () => {
    if (!cardRef.current) return
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        scale: 2,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = 'carte-fete-des-meres.png'
      link.href = canvas.toDataURL()
      link.click()
    } catch {
      alert('Téléchargement non disponible, faites une capture d\'écran.')
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 p-6 text-center">
        <div className="text-6xl mb-4">🥀</div>
        <h1 className="text-2xl font-serif-display font-bold text-rose-700 mb-2">Carte introuvable</h1>
        <p className="text-gray-600 font-sans mb-6">Ce lien semble invalide ou corrompu.</p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-white font-bold font-sans shadow-lg hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #be185d, #7e22ce)' }}
        >
          Créer une carte
        </Link>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50">
        <div className="text-center space-y-4 animate-pulse">
          <div className="text-5xl">💐</div>
          <p className="text-rose-700 font-serif-display text-xl italic">Chargement de votre carte…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      <div ref={cardRef}>
        <CardRenderer data={data} fullscreen={true} />
        {/* Logo IFR */}
        <div className="absolute bottom-4 right-4 z-20 opacity-80">
          <img src="/images/logo_ifr.png" alt="IFR" style={{ width: 72, height: 'auto' }} />
        </div>
      </div>

      {/* Floating action bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ${
          showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="flex gap-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-rose-100">
          <ActionButton onClick={downloadCard} icon="⬇️" label="Télécharger" />
          <ActionButton
            onClick={() => navigator.share?.({ url: window.location.href, title: 'Ma carte Fête des Mères' }).catch(() => {})}
            icon="📤"
            label="Partager"
          />
        </div>
      </div>
    </div>
  )
}

function ActionButton({ onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors group"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-xs font-sans text-gray-600 group-hover:text-rose-700">{label}</span>
    </button>
  )
}
