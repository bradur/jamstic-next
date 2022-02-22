import config from './../../config/config'
import { getCleanUrls, findImageUrls } from './md-helper'
import glob from 'glob'
import _ from 'lodash'
import {
  writeJson,
  readJson,
  createFolderIfItDoesntExist,
  join,
  resolve,
  createLocalImagePath,
  cleanUpGamePath,
  downloadAndSaveImages,
  findGameCoverColors
} from './file-helper'
import { Alakajam } from './connector'
import { ago, format, parseAlakajamDate } from './date'

const cleanUpUrl = url => url.replace(/\/\/\//g, '')

const findImages = (data) => {
  const images = []
  data.forEach(game => {
    images.push(...findImageUrls(game.body))
    images.push({ url: Alakajam.staticUrl(cleanUpUrl(game.cover)), path: game.path })
  })
  return images
}

const findCommentImages = (data) => {
  const images = []
  data.forEach(game => {
    game.comments.forEach(comment => {
      images.push(...getCleanUrls(comment.body).map(url => ({
        url: LDJam.staticUrl(url), path: game.path
      })))
    })
  })
  return images
}

const makeUrlsLocal = (string, gamePath) => {
  findImageUrls(string).forEach(url => {
    string = string.replace(url, `(${createLocalImagePath(url, gamePath)}`)
  })
  return string
}

const loadAllSavedGames = () => glob
  .sync('content/games/**/*.json', {})
  .map(file => readJson(file))
  .filter(game => game.eventType === 'Alakajam')

const saveData = (games) => {
  games.forEach(game => {
    const filePath = join(resolve('./content/games/'), cleanUpGamePath(game.path), 'game.json')
    createFolderIfItDoesntExist(filePath)
    writeJson(filePath, game)
  })
}

const downloadAndSaveComments = async (games) => {
  for (const game of games) {
    let comments = await LDJam.getComments(game.id)
    comments = _.get(comments, 'data.note', []).map(comment => ({
      ...comment,
      timestamp: date.format(comment.created),
      ago: date.ago(comment.created)
    }))
    game.comments = comments
  }
}

const transformGrades = (game) => {
  const all = []
  const max_ratings = 6
  for (let index = 1; index <= max_ratings; index += 1) {
    const result = _.get(game.results, `ranking_${index}`, '')
    const rating = _.get(game.results, `rating_${index}`, '')
    if (result === '' && rating === '') {
      continue
    }
    all.push({
      title: Alakajam.getRatingTitle(index),
      result: result,
      rating: rating
    })
  }
  const overall = all.find(result => result.title === 'Overall')
  const data = {
    all,
    overall: _.isUndefined(overall) ? { title: '', result: null } : overall
  };
  return data
}


const getLinks = (game) => {
  return game.links.map(link => ({
    url: link.url,
    title: link.label
  }))
}

const transformData = async (data) => {

  return data.reverse().map(game => {
    game.comments.forEach(comment => {
      comment.body = makeUrlsLocal(comment.body, game.path)
    })
    if (game.event.id === 29) {
      game.event.display_theme = 'Depth'
    }

    const eventDate = parseAlakajamDate(game.event.display_dates)
    return {
      ...game,
      timestamp: format(eventDate),
      subsubtype: game.division,
      ago: ago(eventDate),
      results: transformGrades(game),
      body: game.body,
      eventName: game.event.title,
      cover: createLocalImagePath(game.cover, game.path),
      url: join('games/', cleanUpGamePath(game.path)),
      links: getLinks(game),
      eventType: 'Alakajam',
      name: game.title,
      theme: game.event.display_theme
    }
  })
}

const findCoverColors = async games => {
  for (let index = 0; index < games.length; index++) {
    const game = games[index]
    game.cover = createLocalImagePath(game.cover, game.path)
    game.coverColors = await findGameCoverColors(game)
  }
}

const fetchDetails = async (newGameEntries) => {
  const newEntries = []
  for (const newGameEntry of newGameEntries) {
    if (newGameEntry.event_id !== null) {
      const fetchedEntry = await fetchEntryDetails(newGameEntry)
      newEntries.push({ ...newGameEntry, ...fetchedEntry.data })
    }
  }
  return newEntries
}

const fetchEntryDetails = async (entry) => {
  return await Alakajam.getEntry(entry.id)
}

const fetchEvents = async (entries) => {
  for (let index = 0; index < entries.length; index++) {
    const entry = entries[index]
    let fetchedEvent = await fetchEventDetails(entry)
    fetchedEvent = fetchedEvent.data
    delete fetchedEvent.entries
    entry.event = fetchedEvent
  }
}

const fetchEventDetails = async (entry) => {
  return await Alakajam.getEvent(entry.event_id)
}


const setUpGamePaths = entries => {
  entries.forEach(entry => {
    entry.path = `alakajam/${entry.event_name}/${entry.name}`
    entry.cover = entry.pictures.previews[0]
  })
}

const filterOutExistingGames = (oldGames, data) => {
  const oldGameIds = oldGames.map(game => game.id)
  return data.filter(game => {
    return !oldGameIds.includes(game.id)
  })
}

const downloadAll = async (games) => {
  const profile = await Alakajam.getProfile(config.alakajam.profileName)
  const newGameEntries = filterOutExistingGames(games, profile.data.entries)
  let data = [...games]
  if (newGameEntries.length > 0) {
    const newGames = await fetchDetails(newGameEntries)
    setUpGamePaths(newGames)
    data = data.concat(newGames)
    const images = findImages(data)
    await downloadAndSaveImages(images)
  }
  await findCoverColors(data)
  await fetchEvents(data)
  data = await transformData(data)
  saveData(data)
  return data
}

async function getAll(download) {
  let games = loadAllSavedGames()
  if (download) {
    games = await downloadAll(games)
  }
  return games
}

export { getAll }
export default { getAll }
