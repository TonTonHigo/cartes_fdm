import CardFloral from './cards/CardFloral'
import CardSunset from './cards/CardSunset'
import CardAquarelle from './cards/CardAquarelle'
import CardRoyal from './cards/CardRoyal'

const TEMPLATES = {
  floral: CardFloral,
  sunset: CardSunset,
  aquarelle: CardAquarelle,
  royal: CardRoyal,
}

export default function CardRenderer({ data, fullscreen = false }) {
  const Component = TEMPLATES[data?.template] || CardFloral
  return <Component data={data} fullscreen={fullscreen} />
}
