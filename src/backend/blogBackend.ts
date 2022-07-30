import { getFiles, readFileToJson } from '@backendlib/functions'
import { postPath } from '@lib/relative-path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { PostEntry, PostPageProps, PostsPageProps } from 'types/types-blog'

type PageParams = {
  slug: string[]
}

type SlugInfo = {
  yearSlug: string
  postSlug: string
}

const paramsToInfo = (params: PageParams): SlugInfo => {
  const { slug } = params

  const [yearSlug, postSlug] = slug
  return {
    yearSlug,
    postSlug,
  }
}

export const blogStaticSlugProps = () => async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<PostPageProps>> => {
  const files = getFiles('content/blog')

  const { yearSlug, postSlug } = paramsToInfo(params)

  const post = files.find((file) => file.parentDirectory === yearSlug && postPath(file) === postSlug)
  if (!post) {
    return {
      props: {
        error: "Couldn't find file!",
        post: null,
      },
    }
  }
  const postJSON = readFileToJson(post) as PostEntry
  return {
    props: {
      error: false,
      post: postJSON,
    },
  }
}

export const blogStaticSlugPaths = () => async (): Promise<GetStaticPathsResult<PageParams>> => {
  const files = getFiles('content/blog')

  const paths = {
    paths: files.map((file) => {
      const slg = { slug: [file.parentDirectory, postPath(file)] }
      return {
        params: slg,
      }
    }),
    fallback: false,
  }

  return paths
}

export const blogStaticProps = () => async (): Promise<GetStaticPropsResult<PostsPageProps>> => {
  const files = getFiles('content/blog')
  return {
    props: {
      error: false,
      posts: files,
    },
  }
}
