import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { JamConfig } from 'games/types'

type JamConfigType = {
  jams: JamConfig[]
}
export const jamConfig: JamConfigType = {
  jams: [
    //{ title: 'LDJam', name: 'ldjam', importer: LDJamImporter },
    { name: 'Alakajam', slug: 'alakajam', importer: AlakajamImporter },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ],
}
