import { gamesStaticPathsSlug, gamesStaticSlug } from 'backend/gamesBackend'
import Head from 'next/head'
import { GamePage } from '../../frontend/games/components/GamePage'
import { GameEntry, GamePageProps } from '../../types/types-games'

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

export default Game

export const getStaticProps = gamesStaticSlug()

export const getStaticPaths = gamesStaticPathsSlug()
