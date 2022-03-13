import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import LDJamImporter from 'api/jams/ldjam/ldjam-importer'
import { JamConfig } from 'api/jams/types'

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
    },
    {
      name: 'Alakajam',
      slug: 'alakajam',
      importer: AlakajamImporter,
      defaultAvatarUrl: 'https://static.alakajam.com/static/images/default-avatar.png',
    },
    /*{
      name: 'Alakajam',
      slug: 'alakajam',
      importer: AlakajamImporter,
      defaultAvatarUrl: 'https://static.alakajam.com/static/images/default-avatar.png',
    },*/
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ],
}
