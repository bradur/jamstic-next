import fs, { PathLike } from 'fs'
import { GameEntry, GameEntryColor, GameEntryImage, GameEntryUser } from 'games/types'
import getColors from 'get-image-colors'
import glob from 'glob'
import imageType from 'image-type'
import path from 'path'
import { stream } from './connector'
import { findImageUrls } from './md-helper'
import { AbsolutePath, GameImageType } from './path-helper'

const jsonIndentLength = 4

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

export const loadSavedEntries = (jamType: string): GameEntry[] => {
  console.log('Load saved entries of ' + jamType)
  return glob.sync(AbsolutePath.SavedEntries(jamType), {}).map((file) => readJson(file) as GameEntry)
}
export const readFile = (filePath: string) => fs.readFileSync(filePath)

export const downloadAndSaveFile = (url: string, savePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(savePath)) {
      console.log(`'${savePath}' already exists, not downloading...`)
      resolve('')
    } else {
      stream(url).then((response) =>
        response.data
          .pipe(writeStream(savePath))
          .on('finish', () => resolve(''))
          .on('error', (error: any) => reject(error)),
      )
    }
  })
}

const findImages = (entry: GameEntry): GameEntryImage[] => {
  const images: GameEntryImage[] = []
  images.push(entry.game.cover)
  const commentImages = entry.game.comments
    .map((comment) =>
      findImageUrls(comment.body).map((url) => ({
        originalUrl: url,
        pathType: GameImageType.COMMENT,
      })),
    )
    .flat()
  images.push(...commentImages)
  const bodyImages = findImageUrls(entry.game.body).map((url) => ({
    originalUrl: url,
    pathType: GameImageType.BODY,
  }))
  images.push(...bodyImages)
  return images
}

export const downloadAndSaveImages = async (entries: GameEntry[]) => {
  console.log('Checking for new images...')
  for (const entry of entries) {
    let count = 0
    const images = findImages(entry)
    for (const image of images) {
      if (image.originalUrl === '') {
        continue
      }
      const imagePath = AbsolutePath.Image(entry, image)
      createFolderIfItDoesntExist(imagePath)
      console.log(`Saving image with url ${image.originalUrl} and path ${image.pathType} to ${imagePath}...`)
      count += 1
      await downloadAndSaveFile(image.originalUrl, imagePath)
    }
    if (count > 0) {
      console.log(`Done! Downloaded & saved ${count} images.`)
    } else {
      console.log('No new images detected.')
    }
  }
}

export const downloadAndSaveAvatars = async (jamSlug: string, users: GameEntryUser[]) => {
  console.log('Checking for new images...')
  let count = 0
  for (const user of users) {
    if (user.avatar.originalUrl === '') {
      continue
    }
    const imagePath = AbsolutePath.Avatar(jamSlug, user.avatar)
    if (createFolderIfItDoesntExist(imagePath)) {
      console.log(
        `Saving image with url ${user.avatar.originalUrl} and path ${user.avatar.pathType} to ${imagePath}...`,
      )
      count += 1
      await downloadAndSaveFile(user.avatar.originalUrl, imagePath)
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

export const findGameCoverColors = async (entry: GameEntry): Promise<GameEntryColor> => {
  const { game } = entry
  if (!game.cover) {
    console.log('Game cover empty, return default colors')
    return getDefaultColors()
  }
  console.log(JSON.stringify(game.cover))
  const coverPath = AbsolutePath.Image(entry, game.cover)

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
      .map(([name, color]) => `--${name}: ${color};`)
      .join(''),
  }
}
