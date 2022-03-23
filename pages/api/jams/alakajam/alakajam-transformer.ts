import { parseDate } from '@lib/date'
import { slugifyPath } from '@lib/path-helper'
import {
  GameEntry,
  GameEntryComment,
  GameEntryDetails,
  GameEntryDivision,
  GameEntryEvent,
  GameEntryLink,
  GameEntryResults,
  GameEntryUser,
  GameImageType,
  SingleGameEntryResult,
} from 'games/types'
import { AlakajamConnector } from './alakajam-connector'
import { AlakajamEntry, AlakajamGameWithDetails, AlakajamResults, AlakajamUser } from './types'

type TransformerOptions = {
  jamSlug: string
  entry: AlakajamEntry
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export default class AlakajamTransformer {
  options: TransformerOptions
  constructor(options: TransformerOptions) {
    this.options = options
  }

  transform = (): GameEntry => ({
    id: this.options.entry.game.id,
    event: this._transformEvent(),
    game: this._transformGame(),
    jamSlug: this.options.jamSlug,
  })

  static transformUser = ({ id, name, avatar }: AlakajamUser): GameEntryUser => ({
    id,
    name,
    avatar: {
      originalUrl: avatar === null ? '' : AlakajamConnector.staticUrl(avatar),
      pathType: GameImageType.AVATAR,
    },
    url: AlakajamConnector.userUrl(name),
  })

  _transformComments = (game: AlakajamGameWithDetails): GameEntryComment[] =>
    game.comments.map(({ id, parent_id, body, created_at, updated_at, user_id }) => ({
      id,
      parent_id,
      body,
      author: user_id,
      created: parseDate(created_at).getTime(),
      updated: parseDate(updated_at).getTime(),
    }))

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

  static getRatingTitle = (index: number) =>
    ['Overall', 'Graphics', 'Audio', 'Gameplay', 'Originality', 'Theme'][index - 1]

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

  _transformLinks = (game: AlakajamGameWithDetails): GameEntryLink[] =>
    game.links.map((link) => ({
      url: link.url,
      title: link.label,
    }))

  _transformEvent(): GameEntryEvent {
    const { id, display_dates, display_theme, title, url } = this.options.entry.event
    return {
      id,
      url,
      name: title,
      slug: slugifyPath(title),
      theme: id === 29 ? 'Depth' : display_theme,
      date: this._parseEventDate(display_dates).getTime(),
      eventType: 'Alakajam',
    }
  }

  _parseEventDate = (timestamp: string): Date => {
    const dateSplit = timestamp.split(' ')
    let day = dateSplit[dateSplit.length - 3].trim()
    if (day.includes('-')) {
      day = day.split('-')[1].trim()
    }
    let monthName = dateSplit[dateSplit.length - 2].trim()
    if (monthName === 'Nov.') {
      monthName = 'November'
    }
    const month = monthNames.indexOf(monthName) + 1
    const year = dateSplit[dateSplit.length - 1].trim()
    return new Date(`${year}-${month}-${day}`)
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
      body,
      authors: game.users.map((user) => user.id),
      name: title,
      slug: slugifyPath(title),
      results: this._transformGrades(entry),
      links: this._transformLinks(game),
      tags: [division],
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
