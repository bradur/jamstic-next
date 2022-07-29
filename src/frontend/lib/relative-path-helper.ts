import slugify from 'slugify'
import { EntryImage } from 'types/types-custom'
import { FoundFile, GameEntry, GameEntryImage, GameImageType } from 'types/types-games'

const joinPath = (...args: string[]) => args.join('/')
const RELATIVE_IMAGE_PATH = '/images/'
const DEFAULT_PROFILE_PIC = 'default-avatar.png'

const fileNameFromUrl = (url: string) => {
  let processedUrl
  try {
    processedUrl = new URL(url)
  } catch (error) {
    console.log(`Error trying to parse url: ${url}`)
    return 'error'
  }
  const pathname = processedUrl.pathname
  const pathSplit = pathname.split('/')
  return pathSplit.length > 0 ? pathSplit.at(-1) ?? pathname : pathname
}

export const slugifyPath = (url: string) => slugify(url, { lower: true, remove: /[*+,~.()'"!:@]/g })

const imgPath = (image: GameEntryImage, jamSlug: string, eventSlug = '', gameSlug = '') => {
  const imagePath = [jamSlug]
  console.log(`Determining img path: ${gameSlug} ${image.pathType} ${image.originalUrl}`)
  if ([GameImageType.BODY, GameImageType.COMMENT].includes(image.pathType)) {
    imagePath.push(...[eventSlug, gameSlug])
  }
  imagePath.push(...[image.pathType, fileNameFromUrl(image.originalUrl)])
  return imagePath
}

export class RelativePath {
  static EntryFromGame = (entry: GameEntry) => joinPath(entry.jamSlug, entry.event.slug, entry.game.slug)
  static Entry = (jamSlug: string, categorySlug: string, slug: string) => joinPath(jamSlug, categorySlug, slug)
  static Image = (jamSlug: string, categorySlug: string, slug: string, image: EntryImage) => {
    return joinPath(RELATIVE_IMAGE_PATH, jamSlug, categorySlug, slug, image.originalUrl)
  }
  static ImageFromGame = (entry: GameEntry, image: GameEntryImage) => {
    if (image.pathType === GameImageType.AVATAR && image.originalUrl === '') {
      return this.DefaultAvatar(entry.jamSlug)
    }
    const imagePath = imgPath(image, entry.jamSlug, entry.event.slug, entry.game.slug)
    return joinPath(RELATIVE_IMAGE_PATH, ...imagePath)
  }
  static DefaultAvatar = (jamSlug: string) => {
    return joinPath(RELATIVE_IMAGE_PATH, jamSlug, DEFAULT_PROFILE_PIC)
  }
}

//export const postPath = (file: FoundFile) => slugifyPath(`${file.fileName.replaceAll('.json', '')}`)
export const postPath = (file: FoundFile) => file.fileName
