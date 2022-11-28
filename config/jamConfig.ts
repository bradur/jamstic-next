import AlakajamImporter from 'backend/api/jams/alakajam/alakajam-importer'
import GGJImporter from 'backend/api/jams/ggj/ggj-importer'
import LDJamImporter from 'backend/api/jams/ldjam/ldjam-importer'
import { JamConfig } from 'backend/api/jams/types'

type JamConfigType = {
  jams: JamConfig[]
}

export const jamConfig: JamConfigType = {
  jams: [
    {
      name: 'LDJam',
      slug: 'ldjam',
      importer: LDJamImporter,
      defaultAvatarUrl: 'https://static.jam.vg/other/dummy/user64.png',
      enabled: true,
    },
    {
      name: 'Alakajam',
      slug: 'alakajam',
      importer: AlakajamImporter,
      defaultAvatarUrl: 'https://static.alakajam.com/static/images/default-avatar.png',
      enabled: true,
    },
    {
      name: 'Global Game Jam',
      slug: 'ggj',
      importer: GGJImporter,
      defaultAvatarUrl: 'https://static.alakajam.com/static/images/default-avatar.png',
      enabled: true,
    },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ],
}
