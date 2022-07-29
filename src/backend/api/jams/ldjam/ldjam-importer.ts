import GenericImporter from '../generic-importer'
import { ImportedData } from '../types'
import { LDJamConnector } from './ldjam-connector'
import LDJamTransformer from './ldjam-transformer'
import { LDJamComment, LDJamEntry, LDJamEvent, LDJamFeed, LDJamGame, LDJamTag, LDJamUser } from './types'

export default class LDJamImporter extends GenericImporter {
  async import(): Promise<ImportedData> {
    console.log(`Old entries: ${this.oldEntries.length}`)
    const platforms = (await LDJamConnector.getPlatforms()).data.tag as LDJamTag[]
    const newEntries = await this._getEntries()
    const transformedEntries = newEntries.map((entry) => {
      const transformer = new LDJamTransformer({ entry, jamSlug: this.jamSlug, platforms })
      return transformer.transform()
    })

    return {
      entries: this.refetchOldEntries ? [...transformedEntries] : [...this.oldEntries, ...transformedEntries],
      users: this.userCache,
    }
  }

  async _getEntries(): Promise<LDJamEntry[]> {
    const profileResponse = await LDJamConnector.getProfile(this.profileName)

    const {
      path: [firstId, userId],
    } = profileResponse

    await this._loadUsers([userId])

    const feedResponse = await LDJamConnector.getFeed(userId)

    const entryIdsToFetch = this.refetchOldEntries
      ? feedResponse.feed.map((feed) => feed.id)
      : this._filterOutExistingGames(feedResponse.feed)
    if (entryIdsToFetch.length > 0) {
      return this._fetchNewEntries(entryIdsToFetch)
    }
    return []
  }

  _filterOutExistingGames(data: LDJamFeed[]): number[] {
    const oldGameIds = this.oldEntries.map((entry) => entry.id)
    return data
      .filter((feed) => {
        return !oldGameIds.includes(feed.id)
      })
      .map((feed) => feed.id)
  }

  async _loadUsers(userIds: number[]) {
    const usersNotInCache = userIds.filter(
      (userId) => userId !== 0 && this.userCache.find((cachedUser) => cachedUser.id === userId) === undefined,
    )
    if (usersNotInCache.length > 0) {
      const response = await LDJamConnector.getProfileDetailsMultiple(usersNotInCache)
      const fetchedUsers = response.data.node as LDJamUser[]
      const transformedUsers = fetchedUsers.map(LDJamTransformer.transformUser)
      this.userCache.push(...transformedUsers)
    }
  }

  async _fetchNewEntries(entryIds: number[]): Promise<LDJamEntry[]> {
    const fetchedGames = await LDJamConnector.getNodes(entryIds)

    const games = fetchedGames.data.node as LDJamGame[]

    const eventIds = games.map((game) => game.parent)
    const fetchedEvents = await LDJamConnector.getNodes(eventIds)

    const events = fetchedEvents.data.node as LDJamEvent[]

    const entries: LDJamEntry[] = []
    const userIds = []
    for (const game of games) {
      const foundEvent = events.find((event) => event.id === game.parent)
      if (foundEvent === undefined) {
        continue
      }
      const comments = (await LDJamConnector.getComments(game.id)).data.comment as LDJamComment[]
      userIds.push(...[...comments.map((comment) => comment.author), ...game.meta.author])
      entries.push({ game, comments, event: foundEvent })
    }
    await this._loadUsers(userIds)
    return entries
  }
}
