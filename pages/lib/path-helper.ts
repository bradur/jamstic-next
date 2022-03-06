import { GameEntry, GameEntryImage } from 'games/types'
import path, { join, resolve } from 'path'
import slugify from 'slugify'
import { findImageUrls } from './md-helper'

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
const IMAGE_PATH = 'public/images/'
const RELATIVE_IMAGE_PATH = '/images/'
const DEFAULT_PROFILE_PIC = 'default-avatar.png'

const joinPosix = path.posix.join

export enum GameImageType {
  AVATAR = 'avatar',
  COVER = 'cover',
  BODY = 'body',
  COMMENT = 'comment',
}

const debugJamsPath = (jamSlug: string) => join(DEBUG_PATH, jamSlug, JAMS_FOLDER)
const jamsPath = (jamSlug: string) => join(GAMES_PATH, jamSlug, JAMS_FOLDER)
const absPath = (...pathArgs: string[]) => resolve(process.cwd(), ...pathArgs)
const fileNameFromUrl = (url: string) => {
  let processedUrl
  try {
    processedUrl = new URL(url)
  } catch (error) {
    console.log(`Error trying to parse url: ${url}`)
    return 'error'
  }
  return path.basename(processedUrl.pathname)
}
const imgPath = (image: GameEntryImage, jamSlug: string, eventSlug = '', gameSlug = '') => {
  const imagePath = [jamSlug]
  console.log(`Determining img path: ${gameSlug} ${image.pathType} ${image.originalUrl}`)
  if ([GameImageType.BODY, GameImageType.COMMENT].includes(image.pathType)) {
    imagePath.push(...[eventSlug, gameSlug])
  }
  imagePath.push(...[image.pathType, fileNameFromUrl(image.originalUrl)])
  return imagePath
}

export const makeImageUrlsLocal = (entry: GameEntry, text: string, imageType: GameImageType) => {
  let replacedText = text
  findImageUrls(replacedText).forEach((url) => {
    replacedText = replacedText.replace(
      url,
      RelativePath.Image(entry, {
        originalUrl: url,
        pathType: imageType,
      }),
    )
  })
  return replacedText
}

export const slugifyPath = (url: string) => slugify(url, { lower: true, remove: /[*+,~.()'"!:@]/g })
export class AbsolutePath {
  static UserCache = (jamSlug: string) => absPath(GAMES_PATH, jamSlug, USER_CACHE_FILE_NAME)

  static DebugDataFile = (jamSlug: string, entry: GameEntry) => {
    return absPath(debugJamsPath(jamSlug), entry.event.slug, entry.game.slug, DEBUG_DATA_FILE_NAME)
  }
  static EntryDataFile = (jamSlug: string, entry: GameEntry) => {
    return this.DataFile(jamSlug, entry.event.slug, entry.game.slug)
  }
  static DataFile = (jamSlug: string, eventName: string, gameName: string) => {
    return absPath(jamsPath(jamSlug), eventName, gameName, DATA_FILE_NAME)
  }
  static SavedEntries = (jamSlug: string) => {
    return absPath(jamsPath(jamSlug), ANY_FOLDERS_IN_BETWEEN_WILDCARD, DATA_FILE_NAME)
  }
  static Image = (entry: GameEntry, image: GameEntryImage) => {
    const imagePath = imgPath(image, entry.jamSlug, entry.event.slug, entry.game.slug)
    return absPath(IMAGE_PATH, ...imagePath)
  }
  static Avatar = (jamSlug: string, image: GameEntryImage) => {
    return absPath(IMAGE_PATH, ...imgPath(image, jamSlug))
  }
}

export class RelativePath {
  static Entry = (entry: GameEntry) => joinPosix(entry.jamSlug, entry.event.slug, entry.game.slug)
  static Image = (entry: GameEntry, image: GameEntryImage) => {
    if (image.pathType === GameImageType.AVATAR && image.originalUrl === '') {
      return this.DefaultAvatar(entry)
    }
    const imagePath = imgPath(image, entry.jamSlug, entry.event.slug, entry.game.slug)
    return joinPosix(RELATIVE_IMAGE_PATH, ...imagePath)
  }
  static DefaultAvatar = (entry: GameEntry) => {
    return joinPosix(RELATIVE_IMAGE_PATH, entry.jamSlug, DEFAULT_PROFILE_PIC)
  }
}
