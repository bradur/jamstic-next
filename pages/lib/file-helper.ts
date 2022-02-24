import fs, { PathLike } from 'fs'
import { GameEntry, GameEntryColor, GameImageData } from 'games/types'
import getColors from 'get-image-colors'
import imageType from 'image-type'
import path from 'path'
import slugify from 'slugify'
import { stream } from './connector'

export const IMAGE_PATH = './public/images/'
export const RELATIVE_IMAGE_PATH = './images/'
const jsonIndentLength = 4

export const slugifyUrl = (url: string) => slugify(url, { lower: true, remove: /[*+,~.()'"!:@]/g })
export const writeStream = (savePath: PathLike) => fs.createWriteStream(savePath)
export const createFolderIfItDoesntExist = (folderPath: PathLike) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(path.dirname(folderPath.toString()), { recursive: true })
    return true
  }
  return false
}
export const writeJson = (filePath: PathLike, data: object) =>
  fs.writeFileSync(filePath, JSON.stringify(data, null, jsonIndentLength))
export const readJson = (filePath: PathLike) => {
  if (!fs.existsSync(filePath)) {
    return null
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}
export const readFile = (filePath: string) => fs.readFileSync(filePath)
export const join = path.posix.join
export const resolve = path.resolve
export const cleanUpGamePath = (gamePath: string) => gamePath.replace('/events/', '')

export const createLocalImagePath = (url: string, gamePath: string, imagePath = '') => {
  return join(imagePath, cleanUpGamePath(gamePath), path.basename(url))
}
export const createRelativeImagePath = (url: string, imagePath: string) => {
  return '/' + join(RELATIVE_IMAGE_PATH, imagePath, path.basename(url))
}

export const downloadAndSaveFile = (url: string, savePath: string) =>
  stream(url).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(writeStream(savePath))
          .on('finish', () => resolve(''))
          .on('error', (error: any) => reject(error))
      }),
  )

export const downloadAndSaveImages = async (images: GameImageData[]) => {
  console.log('Checking for new images...')
  let count = 0
  for (const image of images) {
    console.log(`Saving image with url ${image.url} and path ${image.path}...`)
    const imagePath = createLocalImagePath(image.url, image.path, resolve(IMAGE_PATH))
    if (createFolderIfItDoesntExist(imagePath)) {
      count += 1
      await downloadAndSaveFile(image.url, imagePath)
    }
  }
  if (count > 0) {
    console.log(`Done! Downloaded & saved ${count} images.`)
  } else {
    console.log('No new images detected.')
  }
}

const defaultColors = ['#ccc', '#ff3e00', 'green', 'cyan', 'black']

const getDefaultColors = () => ({
  colors: defaultColors,
  css: Object.entries({
    one: defaultColors[0],
    two: defaultColors[1],
    three: defaultColors[2],
    four: defaultColors[3],
    five: defaultColors[4],
  })
    .map((entry) => `--${entry[0]}: ${entry[1]};`)
    .join(''),
})

export const findGameCoverColors = async ({ game, path }: GameEntry): Promise<GameEntryColor> => {
  if (!game.cover) {
    console.log('Game cover empty, return default colors')
    return getDefaultColors()
  }
  const coverPath = createLocalImagePath(game.cover.url, game.cover.path, resolve(IMAGE_PATH))
  //const coverPath = game.cover.url
  console.log(`Attempting to read colors from ${coverPath}...`)
  const imgFile = readFile(coverPath)
  const imgType = imageType(imgFile)
  if (imgType === null) {
    console.log(`Couldn't find image type for ${imgFile}`)
    return {
      css: '',
    }
  }
  let colorsRGBA: string[] = []

  const colors = await getColors(imgFile, imgType.mime)

  colorsRGBA = colors.map((color) => color.css())

  return {
    css: Object.entries({
      one: colorsRGBA[0],
      two: colorsRGBA[1],
      three: colorsRGBA[2],
      four: colorsRGBA[3],
      five: colorsRGBA[4],
    })
      .map((entry) => `--${entry[0]}: ${entry[1]};`)
      .join(''),
  }

  /*return {
    colors: colors,
    css: Object.entries({
      one: colorsRGBA[0],
      two: colorsRGBA[1],
      three: colorsRGBA[2],
      four: colorsRGBA[3],
      five: colorsRGBA[4],
    })
      .map((entry) => `--${entry[0]}: ${entry[1]};`)
      .join(''),
  }*/
}
