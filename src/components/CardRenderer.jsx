import CardFloral from './cards/CardFloral'
import CardSunset from './cards/CardSunset'
import CardAquarelle from './cards/CardAquarelle'
import CardRoyal from './cards/CardRoyal'
import CardCreole from './cards/CardCreole'
import CardLontan from './cards/CardLontan'
import CardNature from './cards/CardNature'
import CardSoleil from './cards/CardSoleil'
import CardHauts from './cards/CardHauts'
import CardGourmande from './cards/CardGourmande'

const TEMPLATES = {
  floral: CardFloral,
  sunset: CardSunset,
  aquarelle: CardAquarelle,
  royal: CardRoyal,
  creole: CardCreole,
  lontan: CardLontan,
  nature: CardNature,
  soleil: CardSoleil,
  hauts: CardHauts,
  gourmande: CardGourmande,
}

export default function CardRenderer({ data, fullscreen = false }) {
  const Component = TEMPLATES[data?.template] || CardFloral
  return <Component data={data} fullscreen={fullscreen} />
}
