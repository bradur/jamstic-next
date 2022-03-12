import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { getFiles, readFileToJson } from '../lib/functions'
import { PostPage } from './components/PostPage'
import { PostEntry, PostPageProps } from './types'

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

type PageParams = {
  slug: string
}

export const getStaticProps = async ({
  params = { slug: '' },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<PostPageProps>> => {
  const files = getFiles('content/blog')

  const { slug } = params

  const game = files.find((file) => file.parentDirectory === slug)
  if (!game) {
    return {
      props: {
        error: true,
        post: "Couldn't find file!",
      },
    }
  }
  const postJSON = readFileToJson(game) as PostEntry
  return {
    props: {
      error: false,
      post: postJSON,
    },
  }
}

export const getStaticPaths = async (): Promise<GetStaticPathsResult<PageParams>> => {
  const files = getFiles('content/blog')

  return {
    paths: files.map((file) => ({
      params: { slug: `${file.parentDirectory}` },
    })),
    fallback: false,
  }
}

export default Post
