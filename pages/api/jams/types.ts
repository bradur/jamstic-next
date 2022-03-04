import { GameEntry, GameEntryUser } from 'games/types'

export interface IImporter {
  new (options: ImporterOptions): Importer
}

export interface Importer {
  import: () => Promise<GameEntry[]>
}

export type ImporterOptions = {
  path: string
  profileName: string
  refetchOldEntries: boolean
  userCache: GameEntryUser[]
}
