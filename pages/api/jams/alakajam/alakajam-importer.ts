import { Alakajam } from '@lib/connector'
import {
  cleanUpGamePath,
  createFolderIfItDoesntExist,
  downloadAndSaveImages,
  findGameCoverColors,
  join,
  readJson,
  resolve,
  writeJson,
} from '@lib/file-helper'
import { findImageUrls } from '@lib/md-helper'
import { GameEntry, GameEntryImage } from 'games/types'
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
}

class AlakajamImporter implements Importer {
  userCache: AlakajamUser[] = []
  options: ImporterOptions
  constructor(options: ImporterOptions) {
    this.options = options
  }
  async import() {
    let entries = this._loadAllSavedEntries()
    entries = await this._getEntries(entries)
    this._saveData(entries)
    return entries
  }
  _saveData(entries: GameEntry[]) {
    entries.forEach((entry) => {
      const filePath = join(resolve('./content/games/'), cleanUpGamePath(entry.path), 'game.json')
      createFolderIfItDoesntExist(filePath)
      writeJson(filePath, entry)
    })
  }
  _loadAllSavedEntries = (): GameEntry[] =>
    glob
      .sync('content/games/**/*.json', {})
      .map((file) => readJson(file))
      .filter((game) => game.eventType === 'Alakajam')

  async _fetchNewEntries(games: AlakajamGame[]): Promise<AlakajamEntry[]> {
    const akjEntries: AlakajamEntry[] = []

    for (const akjGame of games) {
      const game = (await Alakajam.getEntry(akjGame.id)).data as AlakajamGameWithDetails
      if (game.event_id === null) {
        continue
      }

      for (const gameComment of game.comments) {
        if (gameComment.user_id === -1) {
          this.userCache.push({
            id: -1,
            name: 'Anonymous',
            title: 'Anonymous',
            is_mod: false,
            is_admin: null,
            avatar: null,
          })
        }
        let cachedUser = this.userCache.find((user) => user.id === gameComment.user_id)
        if (cachedUser === undefined) {
          const fetchedUser = await Alakajam.getProfile(gameComment.user_id)
          const { entries, ...userWithoutEntries } = fetchedUser.data
          cachedUser = userWithoutEntries as AlakajamUser
          this.userCache.push(cachedUser)
        }
        gameComment.user = cachedUser
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
    const { profileEntries, ...profileWithoutEntries } = profileResponse.data
    this.userCache.push(profileWithoutEntries as AlakajamUser)

    const newGames = this.options.refetchOldEntries
      ? this._filterOutExistingGames(
          existingGames,
          profile.entries.filter((entry) => entry.event_id !== null),
        )
      : profile.entries

    const newGameEntries: AlakajamEntry[] = await this._fetchNewEntries(newGames)
    const newGamesTransformed = newGameEntries.map((entry) => {
      const transformer = new AlakajamTransformer({ entry })
      return transformer.transform()
    })

    const entries = [...existingGames, ...newGamesTransformed]

    for (const gameEntry of entries) {
      const images = this._findImages(gameEntry)
      await downloadAndSaveImages(images)
      gameEntry.game.coverColors = await findGameCoverColors(gameEntry)
    }
    return entries
  }

  _filterOutExistingGames(oldGames: GameEntry[], data: AlakajamGame[]): AlakajamGame[] {
    const oldGameIds = oldGames.map((game) => game.id)
    return data.filter((game: AlakajamGame) => {
      return !oldGameIds.includes(game.id)
    })
  }

  _findImages({ game, path, originalData }: GameEntry): GameEntryImage[] {
    const entry = originalData as AlakajamEntry
    const [coverUrl] = entry.game.pictures.previews

    const bodyUrls = findImageUrls(game.body).map((url) => ({ url, path: `${path}/body` }))

    const commentImageUrls = game.comments
      .map((comment) => findImageUrls(comment.body).map((url) => ({ url, path: `${path}/comment` })))
      .flat()
    const userAvatarUrls = this.userCache
      .filter((user) => user.avatar !== null)
      .map((user) => ({
        url: user.avatar !== null ? Alakajam.staticUrl(user.avatar) : '',
        path: `alakajam/user`,
      }))

    return [
      ...bodyUrls,
      ...commentImageUrls,
      ...userAvatarUrls,
      { url: Alakajam.staticUrl(coverUrl), path: `alakajam/entry` },
    ]
  }
}

export default AlakajamImporter
