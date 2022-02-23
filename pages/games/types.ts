export type FoundFile = {
  fileName: string
  fullPath: string
  parentDirectory: string
}

type GameEntryLink = {
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

type GameEntryCommentUser = {
  id: number
  name: string
  avatarUrl: string
}

export type GameEntryComment = {
  id: number
  author: GameEntryCommentUser
  parent_id: number | null
  body: string
  created: Date
  updated?: Date
}

type GameEntryUser = {
  id: number
  name: string
  avatar: string
}

export type GameEntryColor = {
  css: string
}

type GameJamType = 'Ludum Dare' | 'LDJam' | 'Alakajam' | 'Global Game Jam'

export type GameEntryDivision = 'solo' | 'team'

export type GameEntryEvent = {
  id: number
  name: string
  theme: string
  date: string
  url: string
  eventType: GameJamType
}

export type GameEntry = {
  id: number
  game: GameEntryDetails
  event: GameEntryEvent
  path: string
  originalData: object
}

export type GameEntryImage = {
  url: string
}

export type GameImageData = {
  url: string
  path: string
}

export type GameEntryDetails = {
  id: number
  name: string
  description: string
  body: string
  url: string
  cover: string
  links: GameEntryLink[]
  results: GameEntryResults
  images: GameEntryImage[]
  comments: GameEntryComment[]
  users: GameEntryUser[]
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
