import {
  GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult
} from 'next'
import { getFiles, readFileToJson } from '../functions'
import { GamePage } from './components/GamePage'
import { GameEntry, GamePageProps } from './types'

const Game = (props: GamePageProps) => {
  if (props.error !== false) {
    return <p>{props.error}</p>
  }
  return (
    <>
      <GamePage {...props} />
    </>
  )
}
const content = {
  pages: {},
}

type PageParams = {
  slug: string
}

export const getStaticProps = async ({
  params = { slug: '' },
}: GetStaticPropsContext<PageParams>): Promise<
  GetStaticPropsResult<GamePageProps>
> => {
  
  const files = getFiles('content/games')
  
  const { slug } = params
  /*const resPath = path.resolve(
    path.join('content/games/', gamePath.join(path.sep), '/game.json'),
  )
  const posts = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('posts', filename),
      'utf-8',
    )
    const { data: frontMatter } = matter(markdownWithMeta)
    return {
      frontMatter,
      slug: filename.split('.')[0],
    }
  })*/
  const game = files.find((file) => file.parentDirectory === slug)
  if (!game) {
    return {
      props: {
        error: true,
        data: "Couldn't find file!",
      },
    }
  }
  const gameJSON = readFileToJson(game) as GameEntry
  //console.log(gameJSON)
  return {
    props: {
      error: false,
      data: gameJSON,
    },
  }
}

export const getStaticPaths = async ({}): Promise<
  GetStaticPathsResult<PageParams>
> => {
  const files = getFiles('content/games')
  
  /*for (const file of files) {
    file
  }*/
  /*path.resolve(
    path.join('content/games/', gamePath.join(path.sep), '/game.json'),
  )*/
  return {
    paths: files.map((file) => ({
      params: { slug: `${file.parentDirectory}` },
    })),
    fallback: false,
  }
}

export default Game
