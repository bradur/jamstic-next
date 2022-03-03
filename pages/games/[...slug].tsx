import { slugifyUrl } from '@lib/file-helper'
import { DATA_FILE_NAME, GAMES_PATH, getUserCachePath } from '@lib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { getFiles, readFileFromPath, readFileToJson } from '../lib/functions'
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
const content = {
  pages: {},
}

type PageParams = {
  slug: string[]
}

export const getStaticProps = async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<GamePageProps>> => {
  const files = getFiles(GAMES_PATH)

  const { slug } = params

  const [eventType, eventName, gameName] = slug
  const game = files.find((file) => {
    return file.parentDirectory === gameName
  })

  let usersJSON = readFileFromPath(getUserCachePath(eventType.toLowerCase()))
  if (usersJSON.error) {
    usersJSON = []
  }

  if (!game) {
    return {
      props: {
        error: true,
        data: "Couldn't find file!",
        users: [],
      },
    }
  }
  const gameJSON = readFileToJson(game) as GameEntry
  return {
    props: {
      error: false,
      data: gameJSON,
      users: usersJSON as GameEntryUser[],
    },
  }
}

export const getStaticPaths = async (): Promise<GetStaticPathsResult<PageParams>> => {
  const files = getFiles(GAMES_PATH)

  return {
    paths: files
      .filter((file) => file.fileName === DATA_FILE_NAME)
      .map((file) => {
        const { game, event } = readFileToJson(file) as GameEntry
        const slg = { slug: [slugifyUrl(event.eventType), slugifyUrl(event.name), slugifyUrl(game.name)] }
        return {
          params: slg,
        }
      }),
    fallback: false,
  }
}

export default Game
