import { GameEntry, GameEntryUser, GameImageType } from 'games/types'

export const EMPTY_GAME_ENTRY: GameEntry = {
  id: -1,
  event: {
    id: -1,
    name: '',
    slug: '',
    theme: '',
    date: -1,
    url: '',
    eventType: '',
  },
  jamSlug: 'ggj',
  game: {
    comments: [],
    coverColors: {
      css: '',
    },
    division: 'solo',
    authors: [],
    id: -1,
    name: '',
    slug: '',
    description: '',
    body: '',
    links: [],
    results: {
      all: [],
      overall: {
        title: '',
        rating: 0,
        result: 0,
      },
    },
    tags: [],
    cover: {
      originalUrl: '',
      pathType: GameImageType.COVER,
    },
    url: '',
  },
}

export const EMPTY_GAME_ENTRY_USER: GameEntryUser = {
  id: -1,
  name: '',
  avatar: {
    originalUrl: '',
    pathType: GameImageType.AVATAR,
  },
  url: '',
}
