import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { getFiles, readFileToJson } from '../lib/functions'
import { PostPageProps } from './types'

const Post = (props: PostPageProps) => {
  if (props.error !== false) {
    return <div>{props.error}</div>
  }
  return (
    <>
      <PostPage {...props} />
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
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<GamePageProps>> => {
  const files = getFiles('content/blog')

  const { slug } = params

  const game = files.find((file) => file.parentDirectory === slug)
  if (!game) {
    return {
      props: {
        error: "Couldn't find file!",
      },
    }
  }
  const gameJSON = readFileToJson(game) as GameEntry
  return {
    props: {
      error: false,
      data: gameJSON,
    },
  }
}

export const getStaticPaths = async ({}): Promise<GetStaticPathsResult<PageParams>> => {
  const files = getFiles('content/blog')

  return {
    paths: files.map((file) => ({
      params: { slug: `${file.parentDirectory}` },
    })),
    fallback: false,
  }
}

export default Post
