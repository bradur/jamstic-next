export type FoundFile = {
  fileName: string
  fullPath: string
  parentDirectory: string
}

type GameEntryLink = {
  title: string
  url: string
}

type SingleGameEntryResult = {
  title: string
  average: number
  result: number | null
}
type GameEntryResults = {
  all: SingleGameEntryResult[]
  overall: SingleGameEntryResult
}

type GameEntryCommentUser = {
  id: number
  name: string
}

type GameEntryComment = {
  id: number
  author: GameEntryCommentUser
  parent_id: number | null
  body: string
  ago: string
  timestamp: string
  updated_ago: string
  updated_at: string
}

type GameEntryUser = {
  id: number
  name: string
  avatar: string
}

type GameEntryColor = {
  css: string
}

type GameJamType = 'Ludum Dare' | 'LDJam' | 'Alakajam' | 'Global Game Jam'

type GameEntryDivision = 'solo' | 'team'

type GameEntryEvent = {
  id: number
  name: string
  theme: string
  date: string
  ago: string
  url: string
  eventType: GameJamType
}

export type GameEntry = {
  id: number
  game: GameEntryDetails
  event: GameEntryEvent
}

export type GameEntryImage = {
  url: string
}

export type GameEntryDetails = {
  id: number
  name: string
  description: string
  body: string
  url: string
  path: string
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
