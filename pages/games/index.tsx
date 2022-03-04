import config from '@config/config.json'
import { AbsolutePath } from '@lib/path-helper'
import AlakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { GetStaticPropsResult } from 'next'
import { readFileFromPath } from '../lib/functions'
import { GamesPage } from './components/GamesPage'
import { GamesPageProps, Jam } from './types'

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
    const jamPath = jam.name.toLowerCase()
    let users = readFileFromPath(AbsolutePath.UserCache(jamPath))
    if (users.error) {
      users = []
    }

    if (jam.name === 'Alakajam') {
      const importer = new AlakajamImporter({
        profileName: config.alakajam.profileName,
        refetchOldEntries: false,
        userCache: users,
        path: jamPath,
      })
      const entries = await importer.import()
      jam.entries = [...entries].sort((entry, otherEntry) => otherEntry.event.date - entry.event.date)
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
