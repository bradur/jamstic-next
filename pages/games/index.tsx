import config from '@config/config.json'
import { jamConfig } from '@config/jamConfig'
import {
  createFolderIfItDoesntExist,
  downloadAndSaveAvatars,
  downloadAndSaveFile,
  downloadAndSaveImages,
  findGameCoverColors,
  loadSavedEntries,
  writeJson,
} from '@lib/file-helper'
import { AbsolutePath } from '@lib/path-helper'
import { GamesPageProps, Jam } from 'api/jams/types'
import { GetStaticPropsResult } from 'next'
import { readFileFromPath } from '../lib/functions'
import { GamesPage } from './components/GamesPage'
import { ProfileConfig } from './types'

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
  const tags: string[] = []
  for (const jam of jamConfigs) {
    if (!jam.enabled) {
      continue
    }
    const jamSlug = jam.slug
    let users = readFileFromPath(AbsolutePath.UserCache(jamSlug))
    if (users.error) {
      users = []
    }

    const profile = Object.keys(profileConfig.profiles).find((profileJamSlug) => profileJamSlug === jamSlug)
    if (profile === undefined) {
      const error = `Couldn't find profile in config.json for '${jamSlug}'`
      return {
        props: {
          error,
          tags: [],
          jams: [],
        },
      }
    }
    const oldEntries = loadSavedEntries(jamSlug)
    const importer = new jam.importer({
      profileName: profileConfig.profiles[profile].profileName,
      refetchOldEntries: false,
      oldEntries,
      jamSlug,
      users,
    })
    const importedData = await importer.import()
    const defaultAvatarPath = AbsolutePath.DefaultAvatar(jamSlug)
    if (jam.defaultAvatarUrl !== null) {
      createFolderIfItDoesntExist(defaultAvatarPath)
      await downloadAndSaveFile(jam.defaultAvatarUrl, defaultAvatarPath)
    }
    await downloadAndSaveImages(importedData.entries)
    await downloadAndSaveAvatars(jamSlug, importedData.users)

    for (const entry of importedData.entries) {
      entry.game.coverColors = await findGameCoverColors(entry)
      entry.game.tags.push(entry.game.division)
      entry.game.tags.push(entry.jamSlug)
      for (const tag of entry.game.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag)
        }
      }
      const filePath = AbsolutePath.EntryDataFile(jamSlug, entry)
      createFolderIfItDoesntExist(filePath)
      writeJson(filePath, entry)
    }
    const userFilePath = AbsolutePath.UserCache(jamSlug)
    createFolderIfItDoesntExist(userFilePath)
    writeJson(userFilePath, importedData.users)
    jams.push({
      name: jam.name,
      slug: jam.slug,
      entries: [...importedData.entries],
    })
  }

  return {
    props: {
      error: false,
      tags,
      jams,
    },
  }
}

export default Games
