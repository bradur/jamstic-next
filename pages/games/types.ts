export type FoundFile = {
  fileName: string
  fullPath: string
  parentDirectory: string
}

export type GameEntryLink = {
  title: string
  url: string
}

export type SingleGameEntryResult = {
  title: string
  rating: number
  result: number | null
}
export type GameEntryResults = {
  all: SingleGameEntryResult[]
  overall: SingleGameEntryResult
}

export type GameEntryComment = {
  id: number
  author: GameEntryUser
  parent_id: number | null
  body: string
  created: number
  updated?: number
}

export type GameEntryUser = {
  id: number
  name: string
  avatarUrl: string
  url: string
}

export type GameEntryColor = {
  css: string
}

export type GameJamType = 'Ludum Dare' | 'LDJam' | 'Alakajam' | 'Global Game Jam'

export type GameEntryDivision = 'solo' | 'team'

export type GameEntryEvent = {
  id: number
  name: string
  theme: string
  date: number
  url: string
  eventType: GameJamType
}

export type GameEntry = {
  id: number
  game: GameEntryDetails
  event: GameEntryEvent
  authors: GameEntryUser[]
  path: string
  originalData: object
}

export type GameEntryImage = {
  url: string
  path: string
}

export type GameEntryDetails = {
  id: number
  name: string
  description: string
  body: string
  url: string
  cover: GameEntryImage
  links: GameEntryLink[]
  results: GameEntryResults
  images: GameEntryImage[]
  comments: GameEntryComment[]
  coverColors: GameEntryColor
  division: GameEntryDivision
}

export type GamePageProps = {
  error: boolean
  data: GameEntry | string
}

export type Jam = {
  name: string
  entries: GameEntry[]
}

export type GamesPageProps = {
  error: boolean | string
  jams: Jam[]
}
