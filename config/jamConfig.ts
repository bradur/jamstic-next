import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { JamConfig } from 'games/types'

type JamConfigType = {
  jams: JamConfig[]
}
export const jamConfig: JamConfigType = {
  jams: [
    //{ name: "LDJam", games: ldjamGames },
    { title: 'Alakajam', name: 'alakajam', importer: AlakajamImporter },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ],
}
