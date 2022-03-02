export type AlakajamUser = {
  id: number
  name: string
  title: string
  avatar: string | null
  is_mod: boolean
  is_admin: boolean | null
}

export type AlakajamProfile = AlakajamUser & {
  url: string
  entries: AlakajamGame[]
}

export type AlakajamGame = {
  id: number
  event_id: number
  event_name: string
  name: string
  title: string
  description: string
  links: AlakajamLink[]
  pictures: AlakajamPictures
  comment_count: number
  karma: string
  division: string
}

export type AlakajamEvent = {
  id: number
  name: string
  title: string
  display_dates: string
  display_theme: string
  status: string
  status_theme: string
  status_entry: string
  status_results: string
  countdown_config: {
    message: string
    link: string
    date: string
    phrase: string
    enabled: boolean
  }
  url: string
}

export type AlakajamEntry = {
  event: AlakajamEvent
  game: AlakajamGameWithDetails
}

export type AlakajamGameWithDetails = AlakajamGame & {
  url: string
  body: string
  comments: AlakajamComment[]
  users: AlakajamUser[]
  results: AlakajamResults
  rating_count: number
  optouts: []
}

export type AlakajamResults = { [name: string]: number }

export type AlakajamComment = {
  id: number
  user_id: number
  parent_id: number | null
  body: string
  created_at: string
  updated_at: string
}

export type AlakajamLink = {
  label: string
  url: string
}

export type AlakajamPictures = {
  previews: string[]
  thumbnail: string
  icon: string
}

export interface Importer {
  import: () => void
}
