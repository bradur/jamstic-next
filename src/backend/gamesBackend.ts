import { AbsolutePath } from '@backendlib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { GameEntry, GameEntryUser, GamePageProps } from 'types/types-games'
import { GamesPageProps } from './api/jams/types'
import { importData } from './lib/entry-importer'
import { loadSavedEntries, readJson } from './lib/file-helper'
import { readFileFromPath } from './lib/functions'

export const gamesStaticProps = () => async (): Promise<GetStaticPropsResult<GamesPageProps>> => {
  const { jams, error } = await importData()

  return {
    props: {
      error,
      jams,
    },
  }
}

type PageParams = {
  slug: string[]
}

type SlugInfo = {
  gameName: string
  eventName: string
  jamFolder: string
}

const paramsToInfo = (params: PageParams): SlugInfo => {
  const { slug } = params

  const [eventType, eventName, gameName] = slug
  return {
    jamFolder: eventType.toLowerCase(),
    eventName,
    gameName,
  }
}

export const gamesStaticSlug = () => async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<GamePageProps>> => {
  const { jamFolder, eventName, gameName } = paramsToInfo(params)
  const entry = readJson(AbsolutePath.DataFile(jamFolder, eventName, gameName)) as GameEntry

  let usersJSON = readFileFromPath(AbsolutePath.UserCache(jamFolder))
  if (usersJSON.error) {
    usersJSON = []
  }

  if (!entry) {
    return {
      props: {
        error: true,
        data: "Couldn't find file!",
        users: [],
      },
    }
  }

  return {
    props: {
      error: false,
      data: entry,
      users: usersJSON as GameEntryUser[],
    },
  }
}

export const gamesStaticPathsSlug = () => async (): Promise<GetStaticPathsResult<PageParams>> => {
  const entries = loadSavedEntries('**')

  return {
    paths: entries.map((entry) => {
      const { game, event } = entry
      const slg = { slug: [entry.jamSlug, event.slug, game.slug] }
      return {
        params: slg,
      }
    }),
    fallback: false,
  }
}
