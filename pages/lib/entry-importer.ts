import config from '@config/config.json'
import { jamConfig } from '@config/jamConfig'
import { ImportedData, Jam, JamConfig } from 'api/jams/types'
import { GameEntry, GameEntryUser, ProfileConfig } from 'games/types'
import {
  createFolderIfItDoesntExist,
  downloadAndSaveAvatars,
  downloadAndSaveFile,
  downloadAndSaveImages,
  findGameCoverColors,
  loadSavedEntries,
  writeJson,
} from './file-helper'
import { readFileFromPath } from './functions'
import { AbsolutePath } from './path-helper'

const REFETCH_OLD_ENTRIES = false

const saveUserData = (jamSlug: string, users: GameEntryUser[]) => {
  const userFilePath = AbsolutePath.UserCache(jamSlug)
  createFolderIfItDoesntExist(userFilePath)
  writeJson(userFilePath, users)
}

const findTags = (entry: GameEntry) => {
  const tags = entry.game.tags
  tags.push(entry.game.division)
  tags.push(entry.jamSlug)
  return tags
}

const downloadAvatarsAndImages = async (jamSlug: string, jam: JamConfig, importedData: ImportedData) => {
  const defaultAvatarPath = AbsolutePath.DefaultAvatar(jamSlug)
  if (jam.defaultAvatarUrl !== null) {
    createFolderIfItDoesntExist(defaultAvatarPath)
    await downloadAndSaveFile(jam.defaultAvatarUrl, defaultAvatarPath)
  }
  await downloadAndSaveImages(importedData.entries)
  await downloadAndSaveAvatars(jamSlug, importedData.users)
}

const structuredClone = (entry: GameEntry) => {
  return JSON.parse(JSON.stringify(entry))
}

const processEntries = async (entries: GameEntry[]) => {
  const processedEntries: GameEntry[] = entries.map(structuredClone)
  for (const entry of processedEntries) {
    entry.game.coverColors = await findGameCoverColors(entry)
    entry.game.tags = findTags(entry)
  }
  return processedEntries
}

const saveEntryData = (jamSlug: string, entries: GameEntry[]) => {
  for (const entry of entries) {
    const filePath = AbsolutePath.EntryDataFile(jamSlug, entry)
    createFolderIfItDoesntExist(filePath)
    writeJson(filePath, entry)
  }
}

type ImportDataReturn = { jams: Jam[]; error: boolean | string }
export const importData = async (): Promise<ImportDataReturn> => {
  const jamConfigs = jamConfig.jams
  const profileConfig = config as ProfileConfig
  const jams: Jam[] = []
  let error: boolean | string = false
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
      error = `Couldn't find profile in config.json for '${jamSlug}'`
      break
    }
    const oldEntries = loadSavedEntries(jamSlug)
    const importer = new jam.importer({
      profileName: profileConfig.profiles[profile].profileName,
      refetchOldEntries: REFETCH_OLD_ENTRIES,
      oldEntries,
      jamSlug,
      users,
    })
    const importedData = await importer.import()
    await downloadAvatarsAndImages(jamSlug, jam, importedData)

    const processedEntries = await processEntries(importedData.entries)
    saveEntryData(jamSlug, processedEntries)
    saveUserData(jamSlug, importedData.users)
    jams.push({
      name: jam.name,
      slug: jam.slug,
      entries: processedEntries,
    })
  }
  return { jams, error }
}
