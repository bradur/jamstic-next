import { GameEntry } from 'games/types'
import { join, resolve, slugifyUrl } from './file-helper'

export const getUserCachePath = (jamPath: string) => {
  return join(resolve(`./content/games/${jamPath}/`), 'users.json')
}

export const GAMES_PATH = 'content/games'
export const DATA_FILE_NAME = 'game.json'

export const getOriginalDataFilePath = (jamPath: string, entry: GameEntry) => {
  return join(
    resolve(`./content/debug/games/${jamPath}/jams`),
    slugifyUrl(entry.event.name),
    slugifyUrl(entry.game.name),
    'originalData.json',
  )
}

export const getDataFilePath = (jamPath: string, entry: GameEntry) => {
  return join(
    resolve(`./content/games/${jamPath}/jams`),
    slugifyUrl(entry.event.name),
    slugifyUrl(entry.game.name),
    'game.json',
  )
}

export const getEntryFilePath = (jamPath: string) => `content/games/${jamPath}/jams`

export const getSavedEntriesPath = (jamPath: string) => {
  return `content/games/${jamPath}/entries/**/*.json`
}

export enum RelativePathType {
  USER = 'user',
  ENTRY = 'entry',
  BODY = 'body',
  COMMENT = 'comment',
}

export const getRelativePath = (jamPath: string, pathType: RelativePathType) => {
  return `${jamPath}/${pathType}`
}

export const getEntryPath = (jamName: string, eventName: string, entryName: string) => {
  return `${jamName}/${eventName}/${entryName}`
}
