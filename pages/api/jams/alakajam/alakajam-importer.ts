import config from '@config/config.json'
import { Alakajam } from '@lib/connector'
import { formatDate, parseAlakajamDate, parseDate } from '@lib/date'
import {
  cleanUpGamePath,
  createFolderIfItDoesntExist,
  createRelativeImagePath,
  downloadAndSaveImages,
  findGameCoverColors,
  join,
  readJson,
  resolve,
  writeJson,
} from '@lib/file-helper'
import { findImageUrls } from '@lib/md-helper'
import {
  GameEntry,
  GameEntryComment,
  GameEntryDetails,
  GameEntryDivision,
  GameEntryEvent,
  GameEntryResults,
  GameImageData,
  SingleGameEntryResult,
} from 'games/types'
import glob from 'glob'
import {
  AlakajamEntry,
  AlakajamEvent,
  AlakajamGame,
  AlakajamGameWithDetails,
  AlakajamProfile,
  AlakajamResults,
} from './types'

const findImages = ({ game, path, originalData }: GameEntry): GameImageData[] => {
  const images: GameImageData[] = []

  const entry = originalData as AlakajamEntry
  const [coverUrl] = entry.game.pictures.previews

  findImageUrls(game.body).forEach((url) => {
    images.push({ url, path })
  })
  console.log(Alakajam.staticUrl(coverUrl))
  images.push({ url: Alakajam.staticUrl(coverUrl), path })

  return images
}

const makeUrlsLocal = (rawUrl: string, gamePath: string) => {
  findImageUrls(rawUrl).forEach((url) => {
    rawUrl = rawUrl.replace(url, `(${createRelativeImagePath(url, gamePath)}`)
  })
  return rawUrl
}

const loadAllSavedGames = (): GameEntry[] =>
  glob
    .sync('content/games/**/*.json', {})
    .map((file) => readJson(file))
    .filter((game) => game.eventType === 'Alakajam')

const saveData = (games: GameEntry[]) => {
  games.forEach((game) => {
    const filePath = join(resolve('./content/games/'), cleanUpGamePath(game.path), 'game.json')
    createFolderIfItDoesntExist(filePath)
    writeJson(filePath, game)
  })
}

const getAlakajamRatingResult = (index: number, results: AlakajamResults): SingleGameEntryResult | null => {
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

const transformGrades = (game: AlakajamGameWithDetails): GameEntryResults => {
  const all = []
  const max_ratings = 6
  for (let index = 1; index <= max_ratings; index += 1) {
    const results = getAlakajamRatingResult(index, game.results)
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

const getLinks = (game: AlakajamGameWithDetails) => {
  return game.links.map((link) => ({
    url: link.url,
    title: link.label,
  }))
}

const transformComments = (game: AlakajamGameWithDetails, path: string): GameEntryComment[] => {
  return game.comments.map((comment) => {
    return {
      ...comment,
      body: makeUrlsLocal(comment.body, path),
      author: {
        id: comment.user_id,
        name: '',
        avatarUrl: '',
      },
      created: parseDate(comment.created_at),
      updated: parseDate(comment.updated_at),
    }
  })
}

const getPath = ({ event, game }: AlakajamEntry): string => `alakajam/${event.name}/${game.name}`

const transformData = async (entries: AlakajamEntry[]): Promise<GameEntry[]> => {
  return [...entries].reverse().map((entry) => {
    const { game, event } = entry
    const eventDate = parseAlakajamDate(event.display_dates)
    const theme = event.id === 29 ? 'Depth' : event.display_theme
    const gEvent: GameEntryEvent = {
      ...event,
      theme: theme,
      date: formatDate(eventDate),
      eventType: 'Alakajam',
    }
    const [coverUrl] = game.pictures.previews
    const gPath = getPath(entry)
    const gGame: GameEntryDetails = {
      ...game,
      results: transformGrades(game),
      links: getLinks(game),
      url: `games/${gPath}`,
      cover: createRelativeImagePath(coverUrl, gPath),
      images: [],
      comments: transformComments(game, gPath),
      division: game.division as GameEntryDivision,
      coverColors: {
        css: '',
      },
    }
    return {
      id: gGame.id,
      path: gPath,
      event: gEvent,
      game: gGame,
      originalData: { ...entry },
    }
  })
}

const fetchEntryDetails = async (game: AlakajamGame) => Alakajam.getEntry(game.id.toString())
const fetchEventDetails = async (game: AlakajamGame) => Alakajam.getEvent(game.event_id.toString())

const filterOutExistingGames = (oldGames: GameEntry[], data: AlakajamGame[]): AlakajamGame[] => {
  const oldGameIds = oldGames.map((game) => game.id)
  return data.filter((game: AlakajamGame) => {
    return !oldGameIds.includes(game.id)
  })
}

const fetchNewEntries = async (games: AlakajamGame[]): Promise<AlakajamEntry[]> => {
  const akjEntries: AlakajamEntry[] = []

  for (const akjGame of games) {
    const game = await fetchEntryDetails(akjGame)
    const event = await fetchEventDetails(akjGame)
    const { entries, ...eventWithoutEntries } = event.data
    akjEntries.push({ game: game.data as AlakajamGameWithDetails, event: eventWithoutEntries as AlakajamEvent })
  }
  return akjEntries
}

const downloadAll = async (games: GameEntry[]) => {
  const profileResponse = await Alakajam.getProfile(config.alakajam.profileName)
  const profile = profileResponse.data as AlakajamProfile
  const newGames = filterOutExistingGames(
    games,
    profile.entries.filter((entry) => entry.event_id !== null && entry.id === 80),
  )

  const newGameEntries: AlakajamEntry[] = await fetchNewEntries(newGames)
  const newGamesTransformed = await transformData(newGameEntries)

  const entries = [...games, ...newGamesTransformed]

  for (const gameEntry of entries) {
    const images = findImages(gameEntry)
    gameEntry.game.images = images.map((image) => ({
      url: createRelativeImagePath(image.url, gameEntry.path),
    }))
    await downloadAndSaveImages(images)
    gameEntry.game.coverColors = await findGameCoverColors(gameEntry)
  }

  saveData(entries)
  return entries
}

async function getAll(download: boolean): Promise<GameEntry[]> {
  let games = loadAllSavedGames()
  if (download) {
    games = await downloadAll(games)
  }
  return games
}

export { getAll }
export default { getAll }
