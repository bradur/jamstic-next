import { GameEntry, GameEntryUser } from 'games/types'

export interface IImporter {
  new (options: ImporterOptions): Importer
}

export interface Importer {
  import: () => Promise<ImportedData>
}

export type ImportedData = {
  entries: GameEntry[]
  users: GameEntryUser[]
}

export type ImporterOptions = {
  jamSlug: string
  profileName: string
  refetchOldEntries: boolean
  users: GameEntryUser[]
  oldEntries: GameEntry[]
}
