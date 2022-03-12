import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { JamConfig } from 'api/jams/types'

type JamConfigType = {
  jams: JamConfig[]
}
export const jamConfig: JamConfigType = {
  jams: [
    //{ title: 'LDJam', name: 'ldjam', importer: LDJamImporter },
    {
      name: 'Alakajam',
      slug: 'alakajam',
      importer: AlakajamImporter,
      defaultAvatarUrl: 'https://static.alakajam.com/static/images/default-avatar.png',
    },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ],
}
