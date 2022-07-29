import { GamesPageProps } from '../../backend/api/jams/types'
import { gamesStaticProps } from '../../backend/gamesBackend'
import { GamesPage } from '../../frontend/games/components/GamesPage'

const Games = (props: GamesPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }

  return (
    <>
      <GamesPage {...props} />
    </>
  )
}

export default Games

export const getStaticProps = gamesStaticProps()
