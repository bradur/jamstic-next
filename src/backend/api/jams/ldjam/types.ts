export type LDJamUser = {
  id: number
  slug: string
  name: string
  body: string
  meta: {
    avatar: string
  }
}

export type LDJamProfile = LDJamUser & {
  url: string
  entries: LDJamGame[]
}

export type LDJamEvent = {
  id: number
  name: string
  slug: string
  meta: {
    'event-start': string
    'event-end': string
    'event-theme': string
  }
  path: string
  body: string
}

export type LDJamEntry = {
  event: LDJamEvent
  game: LDJamGame
  comments: LDJamComment[]
}

export type LDJamTag = {
  id: number
  name: string
  slug: string
}

export type LDJamGame = {
  id: number
  name: string
  slug: string
  path: string
  parent: number
  subsubtype: string
  meta: {
    cover: string
    author: number[]
    [key: string]: string | number[]
  }
  cover: string
  body: string
  magic: LDJamResults
}

export type LDJamResults = { [name: string]: number }

export type LDJamComment = {
  id: number
  author: number
  body: string
  parent: number
  created: string
  modified: string
}

export type LDJamLink = {
  label: string
  url: string
}

export type LDJamResponse = {
  status: number
  caller_id: number
  root: number
}

export type LDJamProfileResponse = LDJamResponse & {
  path: number[]
  extra: []
  node: number
}

export type LDJamFeed = {
  id: number
  modified: string
}

export type LDJamFeedResponse = LDJamResponse & {
  method: string[]
  types: string[]
  subtypes: string[]
  offset: number
  limit: number
  feed: LDJamFeed[]
}
