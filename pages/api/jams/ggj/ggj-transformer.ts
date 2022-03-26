import { slugifyPath } from '@lib/path-helper'
import { GameEntry, GameEntryDetails, GameEntryEvent, GameEntryUser, GameImageType } from 'games/types'
import { JSDOM } from 'jsdom'
import { GGJConnector } from './ggj-connector'

type TransformerOptions = {
  jamSlug: string
  entry: string
  authors: GameEntryUser[]
}

const themes: { [key: number]: string } = {
  2009: 'As long as we have each other, we will never ,run out of problems',
  2010: 'Deception',
  2011: 'Extinction',
  2012: 'An image of Ouroboros.',
  2013: 'Sound of a Heartbeat',
  2014: "We don't see things as they are, we see them ,as we are.",
  2015: 'What do we do now?',
  2016: 'Ritual',
  2017: 'Waves',
  2018: 'Transmission',
  2019: 'What home means to you',
  2020: 'Repair',
  2021: 'Lost and Found',
  2022: 'Duality',
}
export class GGJTransformer {
  options: TransformerOptions
  document: Document
  constructor(options: TransformerOptions) {
    this.options = options
    const dom = new JSDOM(options.entry)
    this.document = dom.window.document
  }

  transform(): GameEntry {
    const game = this._transformGame()
    return {
      id: game.id,
      jamSlug: this.options.jamSlug,
      game: game,
      event: this._transformEvent(),
    }
  }

  static transformUser = (profilePage: string): GameEntryUser => {
    const dom = new JSDOM(profilePage)
    const document = dom.window.document

    const shortlink = document.querySelector('link[rel=shortlink]')?.getAttribute('href')
    const userId = shortlink?.split('user/').pop()
    return {
      id: userId ? parseInt(userId, 10) : -1,
      name: document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? '',
      url: document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? '',
      avatar: {
        originalUrl:
          document
            .querySelector('.field--name-field-user-image source[media="(min-width: 1220px)"]')
            ?.getAttribute('srcset') ?? '',
        pathType: GameImageType.AVATAR,
      },
    }
  }

  static findAuthors(entryPage: string): string[] {
    const dom = new JSDOM(entryPage)
    const document = dom.window.document
    return Array.from(document.querySelectorAll('.view-game-users a.username')).map(
      (userElement) => userElement.getAttribute('href')?.split('/users/').pop() ?? '',
    )
  }

  static getEntryUrls(profilePage: string): string[] {
    const dom = new JSDOM(profilePage)
    const document = dom.window.document
    const entryUrls: string[] = []
    const gameElements = Array.from(document.querySelectorAll('.game'))
    for (const gameElement of gameElements) {
      const anchorElem = gameElement.querySelector('.game-image a')
      if (anchorElem === null) {
        continue
      }
      const href = anchorElem.getAttribute('href')
      if (href && !entryUrls.includes(href)) {
        entryUrls.push(href)
      }
    }
    return entryUrls
  }

  _findImageUrls(): string[] {
    const imageUrls: string[] = []
    this.document.querySelectorAll('.field--type-image img').forEach((image) => {
      const imgUrl = image?.getAttribute('srcset')?.split('?')[0]
      if (imgUrl) {
        imageUrls.push(this._processImageUrl(imgUrl))
      }
    })
    return imageUrls
  }

  _transformGame(): GameEntryDetails {
    const shortlink = this.document.querySelector('link[rel=shortlink]')?.getAttribute('href')
    const gameId = shortlink?.split('node/').pop()
    const url = this.document.querySelector('meta[property="og:url"]')?.getAttribute('content') ?? ''
    const slug = url.split('/').pop() ?? ''
    const name = this.document.querySelector('meta[property="og:title"]')?.getAttribute('content') ?? ''
    const imageUrls = this._findImageUrls()
    const [rating] = this.document.querySelector('.rate-heart-info')?.textContent?.trim().split(' Hearts') ?? ['0']
    const division = this.options.authors.length > 1 ? 'team' : 'solo'
    return {
      id: gameId ? parseInt(gameId, 10) : -1,
      name,
      body: this._transformBody(name, imageUrls),
      links: this._transformLinks(),
      coverColors: {
        css: '',
      },
      division,
      authors: this.options.authors.map((author) => author.id),
      results: {
        all: [
          {
            title: 'Hearts',
            rating: 0,
            result: parseInt(rating, 10),
          },
        ],
        overall: {
          title: '',
          rating: 0,
          result: null,
        },
      },
      tags: [],
      comments: [],
      url,
      slug,
      description: '',
      cover: {
        originalUrl: this._findCoverUrl(imageUrls),
        pathType: GameImageType.COVER,
      },
    }
  }

  _processImageUrl = (url: string) => {
    const processedUrl = new URL(url.replace('game_sidebar_normal', 'media_responsive_widest'))
    return `${processedUrl.origin}${processedUrl.pathname}`
  }

  _findCoverUrl(imageUrls: string[]): string {
    let originalCoverUrl = ''
    const coverImageSrc =
      this.document.querySelector('.views-field-field-game-featured-image img')?.getAttribute('srcset')?.trim() ?? ''
    if (coverImageSrc !== '') {
      originalCoverUrl = this._processImageUrl(coverImageSrc)
    } else {
      if (imageUrls.length > 0) {
        originalCoverUrl = imageUrls[0]
      }
    }
    return originalCoverUrl
  }

  _transformLinks() {
    const links = Array.from(this.document.querySelectorAll('.field--type-link-field')).map((link) => {
      const linkTitle = link.querySelector('.field__label')?.textContent ?? ''
      const url = link.querySelector('a')?.getAttribute('href') ?? ''
      return {
        title: linkTitle.trim(),
        url: url.trim(),
      }
    })

    this.document.querySelectorAll('.field--type-file').forEach((fileLink) => {
      fileLink.querySelectorAll('a').forEach((link) => {
        if (link === null) {
          return
        }
        links.push({
          title: link.textContent ?? '',
          url: link.getAttribute('href') ?? '',
        })
      })
    })

    return links
  }

  _transformEvent(): GameEntryEvent {
    const eventDateString =
      this.document.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ?? ''
    const eventDate = new Date(eventDateString)
    const year = eventDate.getFullYear()
    const eventName = `Global Game Jam ${year}`
    const eventNameSlug = slugifyPath(eventName)

    return {
      id: year,
      slug: eventNameSlug,
      name: eventName,
      theme: themes[year],
      date: eventDate.getTime(),
      url: GGJConnector.eventUrl(year),
      eventType: 'Global Game Jam',
    }
  }

  _transformBody(name: string, imageUrls: string[]) {
    const texts: string[] = []
    const textElements = [
      ...this.document.querySelectorAll('.field--type-text-long'),
      ...this.document.querySelectorAll('.field--type-list-text'),
      ...this.document.querySelectorAll('.field--type-entityreference'),
    ]
    textElements.forEach((element) => {
      let textTitle = element.querySelector('.field__label')?.textContent?.trim() ?? ''
      if (textTitle === '') {
        textTitle = name
      }
      const items = element.querySelector('.field__items')?.textContent?.trim() ?? ''
      texts.push(`# ${textTitle}\n\n${items}`)
    })
    return [...texts, ...imageUrls.map((imageUrl) => `![](${imageUrl})`)].join('\n\n')
  }
}
