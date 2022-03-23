export enum GameImageType {
  AVATAR = 'avatar',
  COVER = 'cover',
  BODY = 'body',
  COMMENT = 'comment',
}

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
  author: number
  parent_id: number | null
  body: string
  created: number
  updated?: number
}

export type GameEntryUser = {
  id: number
  name: string
  avatar: GameEntryImage
  url: string
}

export type GameEntryColor = {
  css: string
}

export type GameEntryDivision = 'solo' | 'team'

export type GameEntryEvent = {
  id: number
  name: string
  slug: string
  theme: string
  date: number
  url: string
  eventType: string
}

export type GameEntry = {
  id: number
  game: GameEntryDetails
  event: GameEntryEvent
  jamSlug: string
}

export type GameEntryImage = {
  originalUrl: string
  pathType: GameImageType
}

export type GameEntryDetails = {
  id: number
  name: string
  slug: string
  description: string
  body: string
  url: string
  tags: string[]
  cover: GameEntryImage
  links: GameEntryLink[]
  results: GameEntryResults
  comments: GameEntryComment[]
  coverColors: GameEntryColor
  division: GameEntryDivision
  authors: number[]
}

export type GamePageProps = {
  error: boolean
  data: GameEntry | string
  users: GameEntryUser[]
}

type ProfileInfo = { profileName: string }
type Profiles = { [jamName: string]: ProfileInfo }
export type ProfileConfig = {
  profiles: Profiles
  repository: string
  deploy: {
    branch: string
    repo: string
    user: {
      name: string
      email: string
    }
  }
}
