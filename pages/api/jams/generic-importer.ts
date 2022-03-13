import { GameEntry, GameEntryUser } from 'games/types'
import { ImportedData, Importer, ImporterOptions } from './types'

export default class GenericImporter implements Importer {
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
    return {
      entries: [],
      users: [],
    }
  }
}
