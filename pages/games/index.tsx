import config from '@config/config.json'
import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { GetStaticPropsResult } from 'next'
import { getFiles, readFileFromPath, readFileToJson } from '../lib/functions'
import { GamesPage } from './components/GamesPage'
import { GameEntry, GamesPageProps, Jam } from './types'

const Games = (props: GamesPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <>
      <GamesPage {...props} />
    </>
  )
}
const content = {
  pages: {},
}

type PageParams = {
  slug: string
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<GamesPageProps>> => {
  const jams: Jam[] = [
    //{ name: "LDJam", games: ldjamGames },
    { name: 'Alakajam', entries: [] },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ]
  for (const jam of jams) {
    if (jam.name === 'Alakajam') {
      let users = readFileFromPath(`content/games/${jam.name.toLowerCase()}/users.json`)
      if (users.error) {
        users = []
      }
      const importer = new AlakajamImporter({
        profileName: config.alakajam.profileName,
        refetchOldEntries: false,
        userCache: users,
      })
      await importer.import()

      const files = getFiles(`content/games/${jam.name.toLowerCase()}/jams`)

      const entries: GameEntry[] = files
        .map((file) => readFileToJson(file) as GameEntry)
        .sort((entry, otherEntry) => otherEntry.event.date - entry.event.date)

      jam.entries = entries
    }
  }

  return {
    props: {
      error: false,
      jams,
    },
  }
}

export default Games
