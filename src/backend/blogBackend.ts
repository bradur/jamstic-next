import { getFiles, readFileToJson } from '@backendlib/functions'
import { postPath } from '@lib/relative-path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { PostEntry, PostPageProps, PostsPageProps } from 'types/types-blog'

type PageParams = {
  slug: string[]
}

type SlugInfo = {
  yearSlug: string
  monthSlug: string
  postSlug: string
}

const paramsToInfo = (params: PageParams): SlugInfo => {
  const { slug } = params

  const [yearSlug, monthSlug, postSlug] = slug
  return {
    yearSlug,
    monthSlug,
    postSlug,
  }
}

export const blogStaticSlugProps = () => async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<PostPageProps>> => {
  console.log('staticslugprops')
  const files = getFiles('content/blog')

  const { yearSlug, monthSlug, postSlug } = paramsToInfo(params)

  const post = files.find((file) => file.parentDirectory === monthSlug && file.fileName === postSlug)
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
  console.log('wtf')
  const files = getFiles('content/blog')

  return {
    paths: files.map((file) => {
      const slg = { slug: ['2022', file.parentDirectory, postPath(file)] }
      return {
        params: slg,
      }
    }),
    fallback: false,
  }
}

export const blogStaticProps = () => async (): Promise<GetStaticPropsResult<PostsPageProps>> => {
  console.log('staticprops')
  const files = getFiles('content/blog')
  console.log(files)
  return {
    props: {
      error: false,
      posts: files,
    },
  }
}
