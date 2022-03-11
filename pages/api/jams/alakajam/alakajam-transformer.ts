import { parseAlakajamDate, parseDate } from '@lib/date'
import { slugifyPath } from '@lib/path-helper'
import {
  GameEntry,
  GameEntryComment,
  GameEntryDetails,
  GameEntryDivision,
  GameEntryEvent,
  GameEntryImage,
  GameEntryLink,
  GameEntryResults,
  GameEntryUser,
  GameImageType,
  SingleGameEntryResult,
} from 'games/types'
import emoji from 'node-emoji'
import { AlakajamConnector } from './alakajam-connector'
import { AlakajamEntry, AlakajamEvent, AlakajamGameWithDetails, AlakajamResults, AlakajamUser } from './types'

type TransformerOptions = {
  jamSlug: string
  entry: AlakajamEntry
  userCache: GameEntryUser[]
}

export default class AlakajamTransformer {
  options: TransformerOptions
  images: GameEntryImage[]
  userCache: GameEntryUser[]
  constructor(options: TransformerOptions) {
    this.options = options
    this.images = []
    this.userCache = this.options.userCache
  }

  transform(): GameEntry {
    const entry = this.options.entry
    const game = this._transformGame()
    return {
      id: game.id,
      event: this._transformEvent(entry.event),
      game: game,
      jamSlug: this.options.jamSlug,
    }
  }

  static transformUser({ id, name, avatar }: AlakajamUser): GameEntryUser {
    return {
      id,
      name,
      avatar: {
        originalUrl: avatar === null ? '' : AlakajamConnector.staticUrl(avatar),
        pathType: GameImageType.AVATAR,
      },
      url: AlakajamConnector.userUrl(name),
    }
  }

  _transformComments(game: AlakajamGameWithDetails): GameEntryComment[] {
    return game.comments.map(({ id, parent_id, body, created_at, updated_at, user_id }) => {
      return {
        id,
        parent_id,
        body: emoji.emojify(body),
        author: user_id,
        created: parseDate(created_at).getTime(),
        updated: parseDate(updated_at).getTime(),
      }
    })
  }

  _transformGrades(entry: AlakajamEntry): GameEntryResults {
    const all = []
    const max_ratings = 6
    for (let index = 1; index <= max_ratings; index += 1) {
      const results = this._getRatingResult(entry.game.results, index)
      if (results !== null) {
        all.push(results)
      }
    }
    const overall = all.find((result) => result.title === 'Overall')
    return {
      all,
      overall: overall ?? { title: '', rating: 0, result: null },
    }
  }

  static getRatingTitle(index: number) {
    return ['Overall', 'Graphics', 'Audio', 'Gameplay', 'Originality', 'Theme'][index - 1]
  }

  _getRatingResult = (results: AlakajamResults, index: number): SingleGameEntryResult | null => {
    if (results === undefined || results === null) {
      return null
    }
    const rankingKey = `ranking_${index}`
    const ratingKey = `rating_${index}`
    if (Object.keys(results).includes(rankingKey) && Object.keys(results).includes(ratingKey)) {
      const rating = results[rankingKey]
      const result = results[ratingKey]
      return {
        title: AlakajamTransformer.getRatingTitle(index),
        result: rating,
        rating: result,
      }
    }
    return null
  }

  _transformLinks(game: AlakajamGameWithDetails): GameEntryLink[] {
    return game.links.map((link) => ({
      url: link.url,
      title: link.label,
    }))
  }

  _transformEvent({ id, display_dates, display_theme, title, url }: AlakajamEvent): GameEntryEvent {
    return {
      id,
      url,
      name: title,
      slug: slugifyPath(title),
      theme: id === 29 ? 'Depth' : display_theme,
      date: parseAlakajamDate(display_dates).getTime(),
      eventType: 'Alakajam',
    }
  }

  _transformGame(): GameEntryDetails {
    const entry = this.options.entry
    const { game } = entry
    const { id, title, body, url, description, pictures, division } = game
    const [coverUrl] = pictures.previews
    return {
      id,
      description,
      url,
      authors: game.users.map((user) => user.id),
      body: emoji.emojify(body),
      name: title,
      slug: slugifyPath(title),
      results: this._transformGrades(entry),
      links: this._transformLinks(game),
      cover: {
        originalUrl: AlakajamConnector.staticUrl(coverUrl),
        pathType: GameImageType.COVER,
      },
      comments: this._transformComments(game),
      division: division as GameEntryDivision,
      coverColors: {
        css: '',
      },
    }
  }
}
