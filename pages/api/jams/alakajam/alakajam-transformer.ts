import { Alakajam } from '@lib/connector'
import { parseAlakajamDate, parseDate } from '@lib/date'
import { createRelativeImagePath } from '@lib/file-helper'
import { findImageUrls } from '@lib/md-helper'
import { getEntryPath, getRelativePath, RelativePathType } from '@lib/path-helper'
import {
  GameEntry,
  GameEntryComment,
  GameEntryDetails,
  GameEntryDivision,
  GameEntryEvent,
  GameEntryLink,
  GameEntryResults,
  GameEntryUser,
  SingleGameEntryResult,
} from 'games/types'
import emoji from 'node-emoji'
import { DEFAULT_PROFILE_PIC } from './constants'
import { AlakajamEntry, AlakajamEvent, AlakajamGameWithDetails, AlakajamResults, AlakajamUser } from './types'

type TransformerOptions = {
  path: string
  entry: AlakajamEntry
  userCache: GameEntryUser[]
}
export default class AlakajamTransformer {
  options: TransformerOptions
  path: string
  userCache: GameEntryUser[]
  constructor(options: TransformerOptions) {
    this.options = options
    this.path = options.path
    this.userCache = this.options.userCache
  }

  transform(): GameEntry {
    const entry = this.options.entry
    const game = this._transformGame()
    return {
      id: game.id,
      path: this._getPath(entry),
      event: this._transformEvent(entry.event),
      authors: entry.game.users.map((user) => user.id),
      game: game,
      originalData: { ...entry },
    }
  }

  static transformUser({ id, name, avatar }: AlakajamUser, path: string): GameEntryUser {
    return {
      id,
      name,
      avatarUrl:
        avatar === null
          ? createRelativeImagePath(DEFAULT_PROFILE_PIC, path)
          : createRelativeImagePath(avatar, getRelativePath(path, RelativePathType.USER)),
      url: Alakajam.userUrl(name),
    }
  }

  _makeUrlsLocal(text: string, path: string) {
    let replacedText = text
    findImageUrls(replacedText).forEach((url) => {
      replacedText = replacedText.replace(url, `${createRelativeImagePath(url, path)}`)
    })
    return replacedText
  }

  _getPath({ event, game }: AlakajamEntry): string {
    return getEntryPath(this.path, event.name, game.name)
  }

  _transformComments(game: AlakajamGameWithDetails, path: string): GameEntryComment[] {
    return game.comments.map(({ id, parent_id, body, created_at, updated_at, user_id }) => {
      return {
        id,
        parent_id,
        body: this._transformBody(body, getRelativePath(path, RelativePathType.COMMENT)),
        author: user_id,
        created: parseDate(created_at).getTime(),
        updated: parseDate(updated_at).getTime(),
      }
    })
  }

  _transformBody(body: string, path: string): string {
    return emoji.emojify(this._makeUrlsLocal(body, path))
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
        title: Alakajam.getRatingTitle(index),
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
    const gPath = this._getPath(entry)
    const relativeEntryPath = getRelativePath(this.path, RelativePathType.ENTRY)
    return {
      id,
      description,
      url,
      body: this._transformBody(body, getRelativePath(gPath, RelativePathType.BODY)),
      name: title,
      results: this._transformGrades(entry),
      links: this._transformLinks(game),
      cover: {
        url: createRelativeImagePath(coverUrl, relativeEntryPath),
        path: relativeEntryPath,
      },
      images: [],
      comments: this._transformComments(game, gPath),
      division: division as GameEntryDivision,
      coverColors: {
        css: '',
      },
    }
  }
}
