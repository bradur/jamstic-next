import alakajamImporter from 'api/jams/alakajam/alakajam-importer'
import { GetStaticPropsResult } from 'next'
import { getFiles, readFileToJson } from '../functions'
import { GamesPage } from './components/GamesPage'
import { GameEntry, GamesPageProps, Jam } from './types'

const Games = (props: GamesPageProps) => {
  if (props.error !== false) {
    return <p>{props.error}</p>
  }

  return (
    <>
      <GamesPage {...props} />
    </>
  )
}
const content = {
  pages: {},
}

type PageParams = {
  slug: string
}

export const getStaticProps = async (): Promise<GetStaticPropsResult<GamesPageProps>> => {
  const jams: Jam[] = [
    //{ name: "LDJam", games: ldjamGames },
    { name: 'Alakajam', entries: [] },
    //{ name: "Ludum Dare", games: ludumDareGames },
    //{ name: "Global Game Jam", games: ggjGames }
  ]
  for (const jam of jams) {
    console.log('Fetching...')
    const gameEntries = await alakajamImporter.getAll(true)
    console.log('Fetch successful!')
    const files = getFiles(`content/games/${jam.name.toLowerCase()}`)
    console.log(files)
    for (const file of files) {
      jam.entries.push(readFileToJson(file) as GameEntry)
    }
  }
  console.log(jams)
  return {
    props: {
      error: false,
      jams,
    },
  }
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
  /*
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
  }*/
}

export default Games
