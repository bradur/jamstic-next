import { GameEntry } from 'games/types'
import { join, resolve } from 'path'
import { slugifyUrl } from './file-helper'

const CONTENT_FOLDER = 'content'
const DEBUG_FOLDER = 'debug'
const GAMES_FOLDER = 'games'
const JAMS_FOLDER = 'jams'
const DATA_FILE_NAME = 'game.json'
const USER_CACHE_FILE_NAME = 'users.json'
const DEBUG_DATA_FILE_NAME = 'originalData.json'
const ANY_FOLDERS_IN_BETWEEN_WILDCARD = '**'
const DEBUG_PATH = join(CONTENT_FOLDER, DEBUG_FOLDER, GAMES_FOLDER)
const GAMES_PATH = join(CONTENT_FOLDER, GAMES_FOLDER)

export enum RelativePathType {
  USER = 'user',
  ENTRY = 'entry',
  BODY = 'body',
  COMMENT = 'comment',
}

const absPath = (...pathArgs: string[]) => resolve(process.cwd(), ...pathArgs)
export class AbsolutePath {
  static UserCache = (jamFolder: string) => absPath(GAMES_PATH, jamFolder, USER_CACHE_FILE_NAME)

  static DebugDataFile = (jamFolder: string, entry: GameEntry) => {
    return absPath(
      RelativePath.Debug(jamFolder),
      slugifyUrl(entry.event.name),
      slugifyUrl(entry.game.name),
      DEBUG_DATA_FILE_NAME,
    )
  }
  static EntryDataFile = (jamFolder: string, entry: GameEntry) => {
    return this.DataFile(jamFolder, slugifyUrl(entry.event.name), slugifyUrl(entry.game.name))
  }
  static DataFile = (jamFolder: string, eventName: string, gameName: string) => {
    return absPath(RelativePath.Games(jamFolder), eventName, gameName, DATA_FILE_NAME)
  }
  static SavedEntries = (jamFolder: string) => {
    return absPath(RelativePath.Games(jamFolder), ANY_FOLDERS_IN_BETWEEN_WILDCARD, DATA_FILE_NAME)
  }
}

export class RelativePath {
  static Entry = (jamName: string, eventName: string, entryName: string) => join(jamName, eventName, entryName)
  static Games = (jamName: string) => join(GAMES_PATH, jamName, JAMS_FOLDER)
  static Debug = (jamName: string) => join(DEBUG_PATH, jamName, JAMS_FOLDER)
  static ByType = (jamFolder: string, pathType: RelativePathType) => join(jamFolder, pathType)
}
