import { RelativePath } from '@lib/relative-path-helper'
import path, { join, resolve } from 'path'
import { EntryImage } from 'types/types-custom'
import { GameEntry, GameEntryImage, GameImageType } from 'types/types-games'
import { findImageUrls } from '../../frontend/lib/md-helper'

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
const DEFAULT_PROFILE_PIC = 'default-avatar.png'

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
      RelativePath.ImageFromGame(entry, {
        originalUrl: url,
        pathType: imageType,
      }),
    )
  })
  return replacedText
}

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
  static CustomDataFile = (jamSlug: string, categorySlug: string, slug: string) => {
    return absPath(CONTENT_FOLDER, jamSlug, categorySlug, `${slug}.json`)
  }
  static CustomEntries = (jamSlug: string) =>
    absPath(CONTENT_FOLDER, jamSlug, ANY_FOLDERS_IN_BETWEEN_WILDCARD, '*.json')
  static SavedEntries = (jamSlug: string) => {
    return absPath(jamsPath(jamSlug), ANY_FOLDERS_IN_BETWEEN_WILDCARD, DATA_FILE_NAME)
  }
  static ImageFromGame = (entry: GameEntry, image: GameEntryImage) => {
    const imagePath = imgPath(image, entry.jamSlug, entry.event.slug, entry.game.slug)
    return absPath(IMAGE_PATH, ...imagePath)
  }
  static Image = (jamSlug: string, categorySlug: string, slug: string, image: EntryImage) => {
    return absPath(IMAGE_PATH, jamSlug, categorySlug, slug, image.originalUrl)
  }
  static Avatar = (jamSlug: string, image: GameEntryImage) => {
    return absPath(IMAGE_PATH, ...imgPath(image, jamSlug))
  }
  static DefaultAvatar = (jamSlug: string) => {
    return absPath(IMAGE_PATH, jamSlug, DEFAULT_PROFILE_PIC)
  }
}
