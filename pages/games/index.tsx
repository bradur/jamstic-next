import config from '@config/config.json'
import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { GetStaticPropsResult } from 'next'
import { getFiles, readFileToJson } from '../functions'
import { GamesPage } from './components/GamesPage'
import { GameEntry, GamesPageProps, Jam } from './types'

const Games = (props: GamesPageProps) => {
  if (props.error !== false) {
    return <p>{props.error}</p>
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
      const importer = new AlakajamImporter({
        profileName: config.alakajam.profileName,
        refetchOldEntries: true,
      })
      await importer.import()

      const files = getFiles(`content/games/${jam.name.toLowerCase()}`)

      for (const file of files) {
        jam.entries.push(readFileToJson(file) as GameEntry)
      }
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
