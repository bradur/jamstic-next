import { Alakajam } from '@lib/connector'
import {
  createFolderIfItDoesntExist,
  downloadAndSaveImages,
  findGameCoverColors,
  join,
  readJson,
  resolve,
  slugifyUrl,
  writeJson,
} from '@lib/file-helper'
import { findImageUrls } from '@lib/md-helper'
import { GameEntry, GameEntryImage, GameEntryUser } from 'games/types'
import glob from 'glob'
import AlakajamTransformer from './alakajam-transformer'
import {
  AlakajamEntry,
  AlakajamEvent,
  AlakajamGame,
  AlakajamGameWithDetails,
  AlakajamProfile,
  AlakajamUser,
  Importer,
} from './types'

type ImporterOptions = {
  profileName: string
  refetchOldEntries: boolean
  userCache: GameEntryUser[]
}

class AlakajamImporter implements Importer {
  //userCache: AlakajamUser[] = []
  userCache: GameEntryUser[] = []
  options: ImporterOptions
  userImages: GameEntryImage[]
  constructor(options: ImporterOptions) {
    this.options = options
    this.userCache = [...options.userCache]
    this.userImages = []
  }
  async import() {
    const oldEntries = this._loadAllSavedEntries()
    console.log(`Old entries: ${oldEntries.length}`)
    const newEntries = await this._getEntries(oldEntries)
    const transformedEntries = newEntries.map((entry) => {
      const transformer = new AlakajamTransformer({ entry, userCache: this.userCache })
      return transformer.transform()
    })
    const entries = [...oldEntries, ...transformedEntries]
    await this._findAndDownloadImages(entries)
    await this._determineGameCoverColors(entries)
    this._saveDataAsFile(entries)
    this._saveUserCacheAsFile()
    return entries
  }
  _saveUserCacheAsFile() {
    const filePath = join(resolve('./content/games/alakajam/'), 'users.json')
    writeJson(filePath, this.userCache)
  }
  _saveDataAsFile(entries: GameEntry[]) {
    entries.forEach((entry) => {
      const { event, game } = entry
      const { originalData, ...entryWithoutOriginalData } = entry
      if (originalData) {
        const originalDataFilePath = join(
          resolve('./content/debug/games/alakajam/jams'),
          slugifyUrl(event.name),
          slugifyUrl(game.name),
          'originalData.json',
        )
        createFolderIfItDoesntExist(originalDataFilePath)
        writeJson(originalDataFilePath, originalData)
      }
      const filePath = join(
        resolve('./content/games/alakajam/jams'),
        slugifyUrl(event.name),
        slugifyUrl(game.name),
        'game.json',
      )
      createFolderIfItDoesntExist(filePath)
      writeJson(filePath, entryWithoutOriginalData)
    })
  }
  _loadAllSavedEntries(): GameEntry[] {
    return glob.sync('content/games/alakajam/entries/**/*.json', {}).map((file) => readJson(file))
  }

  async _fetchUser(userId: number): Promise<AlakajamUser> {
    const user = await Alakajam.getProfile(userId)
    return user.data as AlakajamUser
  }

  async _saveUserToCache(user: AlakajamUser) {
    this.userCache.push(AlakajamTransformer.transformUser({ ...user }))
    if (user.avatar !== null) {
      this.userImages.push({
        url: Alakajam.staticUrl(user.avatar),
        path: `alakajam/user`,
      })
    }
  }

  async _fetchNewEntries(games: AlakajamGame[]): Promise<AlakajamEntry[]> {
    const akjEntries: AlakajamEntry[] = []

    for (const akjGame of games) {
      const game = (await Alakajam.getEntry(akjGame.id)).data as AlakajamGameWithDetails
      if (game.event_id === null) {
        continue
      }

      for (const gameComment of game.comments) {
        if (gameComment.user_id !== -1 && !this.userCache.find((user) => user.id === gameComment.user_id)) {
          const user = await this._fetchUser(gameComment.user_id)
          this._saveUserToCache(user)
        }
      }

      const event = await Alakajam.getEvent(akjGame.event_id)
      const { entries, ...eventWithoutEntries } = event.data
      akjEntries.push({ game, event: eventWithoutEntries as AlakajamEvent })
    }
    return akjEntries
  }

  async _getEntries(existingGames: GameEntry[]) {
    const profileResponse = await Alakajam.getProfile(this.options.profileName)
    const profile = profileResponse.data as AlakajamProfile
    if (!this.userCache.find((user) => user.id === profile.id)) {
      this._saveUserToCache(profile as AlakajamUser)
    }

    const newGames = this.options.refetchOldEntries
      ? profile.entries
      : this._filterOutExistingGames(
          existingGames,
          profile.entries.filter((entry) => entry.event_id !== null),
        )

    return this._fetchNewEntries(newGames)
  }

  async _determineGameCoverColors(entries: GameEntry[]) {
    for (const gameEntry of entries) {
      gameEntry.game.coverColors = await findGameCoverColors(gameEntry)
    }
  }

  async _findAndDownloadImages(entries: GameEntry[]) {
    for (const gameEntry of entries) {
      const images = this._findImages(gameEntry)
      await downloadAndSaveImages(images)
    }
  }

  _filterOutExistingGames(oldGames: GameEntry[], data: AlakajamGame[]): AlakajamGame[] {
    const oldGameIds = oldGames.map((game) => game.id)
    return data.filter((game: AlakajamGame) => {
      return !oldGameIds.includes(game.id)
    })
  }

  _findImages({ path, originalData }: GameEntry): GameEntryImage[] {
    const entry = originalData as AlakajamEntry
    const [coverUrl] = entry.game.pictures.previews

    const bodyUrls = findImageUrls(entry.game.body).map((url) => ({ url, path: `${path}/body` }))

    const commentImageUrls = entry.game.comments
      .map((comment) => findImageUrls(comment.body).map((url) => ({ url, path: `${path}/comment` })))
      .flat()

    return [
      ...bodyUrls,
      ...commentImageUrls,
      ...this.userImages,
      { url: Alakajam.staticUrl(coverUrl), path: `alakajam/entry` },
    ]
  }
}

export default AlakajamImporter
