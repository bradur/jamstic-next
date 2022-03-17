import { loadSavedEntries, readJson } from '@lib/file-helper'
import { AbsolutePath } from '@lib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { readFileFromPath } from '../lib/functions'
import { GamePage } from './components/GamePage'
import { GameEntry, GameEntryUser, GamePageProps } from './types'

const Game = (props: GamePageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }
  return (
    <>
      <Head>
        <title>jamsticnext - {(props.data as GameEntry).game.name}</title>
      </Head>
      <GamePage {...props} />
    </>
  )
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

export const getStaticProps = async ({
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

export const getStaticPaths = async (): Promise<GetStaticPathsResult<PageParams>> => {
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

export default Game
