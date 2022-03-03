import fs from 'fs'
import path from 'path'
import { FoundFile } from '../games/types'

class FileFinder {
  files: FoundFile[] = []

  getFilesRecursively(directoryPath: string) {
    const filesInDirectory = fs.readdirSync(directoryPath)
    for (const file of filesInDirectory) {
      const absolute = path.join(directoryPath, file)
      if (fs.statSync(absolute).isDirectory()) {
        this.getFilesRecursively(absolute)
      } else {
        this.files.push({
          fileName: file,
          fullPath: absolute,
          parentDirectory: path.basename(path.dirname(absolute)),
        })
      }
    }
  }
}

export const getFiles = (directoryPath: string) => {
  const finder = new FileFinder()
  finder.getFilesRecursively(directoryPath)
  return finder.files
}

export const readFileFromPath = (filePath: string) => {
  let fileContents
  try {
    fileContents = fs.readFileSync(filePath, 'utf-8')
  } catch (err) {
    return { error: true }
  }
  return JSON.parse(fileContents)
}

export const readFileToJson = (file: FoundFile): object => {
  return readFileFromPath(file.fullPath)
}
