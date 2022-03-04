import config from '@config/config.json'
import { jamConfig } from '@config/jamConfig'
import { AbsolutePath } from '@lib/path-helper'
import { GetStaticPropsResult } from 'next'
import { readFileFromPath } from '../lib/functions'
import { GamesPage } from './components/GamesPage'
import { GamesPageProps, Jam, ProfileConfig } from './types'

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

export const getStaticProps = async (): Promise<GetStaticPropsResult<GamesPageProps>> => {
  const jamConfigs = jamConfig.jams
  const profileConfig = config as ProfileConfig
  const jams: Jam[] = []
  for (const jam of jamConfigs) {
    const jamPath = jam.name
    let users = readFileFromPath(AbsolutePath.UserCache(jamPath))
    if (users.error) {
      users = []
    }

    const profile = Object.keys(profileConfig.profiles).find((jamName) => jamName === jamPath)
    if (profile === undefined) {
      const error = `Couldn't find profile in config.json for '${jamPath}'`
      return {
        props: {
          error,
          jams: [],
        },
      }
    }
    const importer = new jam.importer({
      profileName: profileConfig.profiles[profile].profileName,
      refetchOldEntries: false,
      userCache: users,
      path: jamPath,
    })
    const entries = await importer.import()
    jams.push({
      title: jam.title,
      name: jam.name,
      entries: [...entries].sort((entry, otherEntry) => otherEntry.event.date - entry.event.date),
    })
  }

  return {
    props: {
      error: false,
      jams,
    },
  }
}

export default Games
