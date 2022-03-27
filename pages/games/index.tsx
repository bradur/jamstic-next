import { importData } from '@lib/entry-importer'
import { GamesPageProps } from 'api/jams/types'
import { GetStaticPropsResult } from 'next'
import { GamesPage } from './components/GamesPage'

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

export const getStaticProps = async (): Promise<GetStaticPropsResult<GamesPageProps>> => {
  const { jams, error } = await importData()

  return {
    props: {
      error,
      jams,
    },
  }
}

export default Games
