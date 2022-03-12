import { GameEntry, GameEntryUser } from 'games/types'
import { ImportedData, Importer, ImporterOptions } from '../types'
import { AlakajamConnector } from './alakajam-connector'
import AlakajamTransformer from './alakajam-transformer'
import {
  AlakajamEntry,
  AlakajamEvent,
  AlakajamGame,
  AlakajamGameWithDetails,
  AlakajamProfile,
  AlakajamUser,
} from './types'

export default class AlakajamImporter implements Importer {
  userCache: GameEntryUser[] = []
  refetchOldEntries: boolean
  profileName: string
  jamSlug: string
  oldEntries: GameEntry[] = []
  constructor(options: ImporterOptions) {
    this.refetchOldEntries = options.refetchOldEntries
    this.userCache = [...options.users]
    this.oldEntries = [...options.oldEntries]
    this.profileName = options.profileName
    this.jamSlug = options.jamSlug
  }
  async import(): Promise<ImportedData> {
    console.log(`Old entries: ${this.oldEntries.length}`)
    const newEntries = await this._getEntries()
    const transformedEntries = []
    for (const entry of newEntries) {
      const transformer = new AlakajamTransformer({ entry, jamSlug: this.jamSlug })
      const transformedEntry = transformer.transform()
      transformedEntries.push(transformedEntry)
    }
    return {
      entries: [...this.oldEntries, ...transformedEntries],
      users: this.userCache,
    }
  }

  async _getEntries() {
    const profileResponse = await AlakajamConnector.getProfile(this.profileName)
    const profile = profileResponse.data as AlakajamProfile
    this._saveUserToCache(profile.id)

    const newGames = this.refetchOldEntries
      ? profile.entries
      : this._filterOutExistingGames(profile.entries.filter((entry) => entry.event_id !== null))

    return this._fetchNewEntries(newGames)
  }

  async _fetchUser(userId: number): Promise<AlakajamUser> {
    const user = await AlakajamConnector.getProfile(userId)
    return user.data as AlakajamUser
  }

  async _saveUserToCache(userId: number) {
    if (userId === -1 || this.userCache.find((cachedUser) => cachedUser.id === userId)) {
      return
    }
    const user = await this._fetchUser(userId)
    this.userCache.push(AlakajamTransformer.transformUser({ ...user }))
  }

  async _fetchNewEntries(games: AlakajamGame[]): Promise<AlakajamEntry[]> {
    const akjEntries: AlakajamEntry[] = []

    for (const akjGame of games) {
      const game = (await AlakajamConnector.getEntry(akjGame.id)).data as AlakajamGameWithDetails
      if (game.event_id === null) {
        continue
      }
      for (const author of game.users) {
        await this._saveUserToCache(author.id)
      }

      for (const gameComment of game.comments) {
        await this._saveUserToCache(gameComment.user_id)
      }

      const event = await AlakajamConnector.getEvent(akjGame.event_id)
      const { entries, ...eventWithoutEntries } = event.data
      akjEntries.push({ game, event: eventWithoutEntries as AlakajamEvent })
    }
    return akjEntries
  }

  _filterOutExistingGames(data: AlakajamGame[]): AlakajamGame[] {
    const oldGameIds = this.oldEntries.map((game) => game.id)
    return data.filter((game: AlakajamGame) => {
      return !oldGameIds.includes(game.id)
    })
  }
}
