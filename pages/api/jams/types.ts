import { GameEntry, GameEntryUser } from 'games/types'

interface IImporter {
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

export type Jam = {
  name: string
  slug: string
  entries: GameEntry[]
}

export type JamConfig = {
  name: string
  slug: string
  defaultAvatarUrl: string | null
  importer: IImporter
  enabled: boolean
}

export type GamesPageProps = {
  error: boolean | string
  tags: string[]
  jams: Jam[]
}
