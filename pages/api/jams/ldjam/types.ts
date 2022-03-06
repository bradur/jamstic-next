export type LDJamUser = {
  id: number
  name: string
  title: string
  avatar: string
}

export type LDJamProfile = LDJamUser & {
  url: string
  entries: LDJamGame[]
}

export type LDJamGame = {
  id: number
  name: string
}

export type LDJamEvent = {
  id: number
  name: string
}

export type LDJamEntry = {
  event: LDJamEvent
  game: LDJamGameWithDetails
}

export type LDJamGameWithDetails = LDJamGame & {
  comments: LDJamComment[]
  users: LDJamUser[]
  results: LDJamResults
  cover: string
  body: string
}

export type LDJamResults = { [name: string]: number }

export type LDJamComment = {
  id: number
  body: string
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