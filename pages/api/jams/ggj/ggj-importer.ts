import { GameEntryUser } from 'games/types'
import GenericImporter from '../generic-importer'
import { ImportedData } from '../types'
import { GGJConnector } from './ggj-connector'
import { GGJTransformer } from './ggj-transformer'

export default class GGJImporter extends GenericImporter {
  async import(): Promise<ImportedData> {
    console.log(`Old entries: ${this.oldEntries.length}`)

    const userPage = await this._fetchProfilePage(this.profileName)
    const entryUrls = GGJTransformer.getEntryUrls(userPage.data)
    const newEntries = await this._getEntries(entryUrls)
    const transformedEntries = []
    for (const entry of newEntries) {
      const authors = GGJTransformer.findAuthors(entry)
      const transformedAuthors = []
      for (const author of authors) {
        const transformedAuthor = await this._saveUserToCache(author)
        if (transformedAuthor !== null) {
          transformedAuthors.push(transformedAuthor)
        }
      }
      const transformer = new GGJTransformer({ entry, jamSlug: this.jamSlug, authors: transformedAuthors })
      const transformedEntry = transformer.transform()
      transformedEntries.push(transformedEntry)
    }

    return {
      entries: this.refetchOldEntries ? [...transformedEntries] : [...this.oldEntries, ...transformedEntries],
      users: this.userCache,
    }
  }

  _fetchProfilePage = async (userName: string) => GGJConnector.getProfile(userName)

  async _saveUserToCache(userName: string): Promise<GameEntryUser | null> {
    if (userName === '') {
      return null
    }
    const profileUrl = GGJConnector.profileUrl(userName)
    let user = this.userCache.find((cachedUser) => cachedUser.url === profileUrl)
    if (user) {
      return user
    }
    const userPage = await this._fetchProfilePage(userName)
    user = GGJTransformer.transformUser(userPage.data)
    this.userCache.push(user)
    return user
  }

  async _getEntries(entryUrls: string[]): Promise<string[]> {
    const entries: string[] = []

    const oldGameUrls = this.oldEntries.map((entry) => entry.game.url)
    console.log(oldGameUrls)
    const urlsToFetch = this.refetchOldEntries
      ? entryUrls
      : entryUrls.filter((entryUrl) => !oldGameUrls.includes(GGJConnector.url(entryUrl)))
    for (const entryUrl of urlsToFetch) {
      console.log(entryUrl)
      const entryPage = await GGJConnector.getUrl(entryUrl)
      entries.push(entryPage.data)
    }

    return entries
  }
}
