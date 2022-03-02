import { slugifyUrl } from '@lib/file-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { getFiles, readFileFromPath, readFileToJson } from '../functions'
import { GamePage } from './components/GamePage'
import { GameEntry, GameEntryUser, GamePageProps } from './types'

const Game = (props: GamePageProps) => {
  if (props.error !== false) {
    return <p>{props.error}</p>
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
  const files = getFiles('content/games')

  const { slug } = params

  const [eventType, eventName, gameName] = slug
  const game = files.find((file) => {
    return file.parentDirectory === gameName
  })

  let usersJSON = readFileFromPath(`content/games/alakajam/users.json`)
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
  const files = getFiles('content/games')

  return {
    paths: files
      .filter((file) => file.fileName === 'game.json')
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
