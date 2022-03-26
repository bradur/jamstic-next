import { parseDate } from '@lib/date'
import { findImageUrls } from '@lib/md-helper'
import {
  GameEntry,
  GameEntryComment,
  GameEntryDetails,
  GameEntryEvent,
  GameEntryLink,
  GameEntryResults,
  GameEntryUser,
  GameImageType,
  SingleGameEntryResult,
} from 'games/types'
import { LDJamConnector } from './ldjam-connector'
import { LDJamComment, LDJamEntry, LDJamResults, LDJamTag, LDJamUser } from './types'

type TransformerOptions = {
  jamSlug: string
  entry: LDJamEntry
  platforms: LDJamTag[]
}

export default class LDJamTransformer {
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

  static transformUser({ id, name, meta: { avatar } }: LDJamUser): GameEntryUser {
    return {
      id,
      name,
      avatar: {
        originalUrl: avatar === undefined ? '' : LDJamConnector.staticUrl(avatar),
        pathType: GameImageType.AVATAR,
      },
      url: LDJamConnector.userUrl(name),
    }
  }

  _transformComments(): GameEntryComment[] {
    const { comments } = this.options.entry
    return comments.map(({ body, id, parent, author, created, modified }: LDJamComment) => {
      return {
        id,
        body: this._transformBody(body),
        author,
        parent_id: parent,
        created: parseDate(created).getTime(),
        updated: parseDate(modified).getTime(),
      }
    })
  }

  _transformGrades(): GameEntryResults {
    const results = this.options.entry.game.magic
    const all = []
    for (let index = 1; index < 8; index += 1) {
      const parsed = this._getRatingResult(results, index)
      if (parsed != null) {
        all.push(parsed)
      }
    }
    const overall = all.find((result) => result.title === 'Overall')
    return {
      all,
      overall: overall ?? { title: '', result: null, rating: 0 },
    }
  }

  static getRatingTitle = (index: number) =>
    ['Overall', 'Fun', 'Innovation', 'Theme', 'Graphics', 'Audio', 'Humor', 'Mood'][index - 1]

  _getRatingResult = (results: LDJamResults, index: number): SingleGameEntryResult | null => {
    if (results === undefined || results === null) {
      return null
    }
    const rankingKey = `grade-0${index}-result`
    const ratingKey = `grade-0${index}-average`
    if (Object.keys(results).includes(rankingKey) && Object.keys(results).includes(ratingKey)) {
      const rating = results[rankingKey]
      const result = results[ratingKey]
      return {
        title: LDJamTransformer.getRatingTitle(index),
        result: rating,
        rating: result,
      }
    }
    return null
  }

  _transformLinks(): GameEntryLink[] {
    const {
      game: { meta },
    } = this.options.entry

    const metaLinks = Object.entries(meta).filter(([key]) => key.includes('-tag'))
    const links: GameEntryLink[] = []
    metaLinks.forEach((link) => {
      if (link[1] === null) {
        return
      }
      const [linkBase] = link[0].split('-tag')
      const [tag] = link[1]
      const url = meta[linkBase] as string
      const platform = this.options.platforms.find((plat) => plat.id === tag)
      return {
        url,
        title: platform ? platform.name : '',
      }
    })
    return links
  }

  _transformEvent(): GameEntryEvent {
    const { id, path, name, meta, slug } = this.options.entry.event
    const theme = meta['event-theme']
    const date = meta['event-start']
    return {
      id,
      theme,
      name,
      slug,
      url: LDJamConnector.baseUrl(path),
      date: parseDate(date).getTime(),
      eventType: 'LDJam',
    }
  }

  _transformBody(body: string): string {
    let text = body
    findImageUrls(text).forEach((url) => {
      text = text.replace(url, LDJamConnector.staticUrl(url))
    })
    return text
  }

  _transformGame(): GameEntryDetails {
    const entry = this.options.entry
    const { id, name, body, slug, path, subsubtype, meta } = entry.game
    const division = subsubtype === 'jam' ? 'team' : 'solo'
    return {
      id,
      name,
      slug,
      body: this._transformBody(body),
      authors: meta.author,
      description: '',
      url: LDJamConnector.baseUrl(path),
      results: this._transformGrades(),
      links: this._transformLinks(),
      tags: [],
      cover: {
        originalUrl: LDJamConnector.staticUrl(meta.cover),
        pathType: GameImageType.COVER,
      },
      comments: this._transformComments(),
      division: division,
      coverColors: {
        css: '',
      },
    }
  }
}
