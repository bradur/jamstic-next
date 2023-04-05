import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import slugify from 'slugify'
import { PostPageProps, PostsPageProps } from 'types/types-blog'
import { BlogDb } from './db/blogDb'

type PageParams = {
  slug: string[]
}

type SlugInfo = {
  yearSlug: string
  postSlug: string
  id: number
}

const paramsToInfo = (params: PageParams): SlugInfo => {
  const { slug } = params

  const [yearSlug, postSlug, id] = slug
  return {
    yearSlug,
    postSlug,
    id: parseInt(id, 10),
  }
}

export const blogStaticSlugProps = () => async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<PostPageProps>> => {
  const { id } = paramsToInfo(params)
  const db = await BlogDb.Initialize()
  const post = await db.getPostById(id)
  return {
    props: {
      error: false,
      post: post,
    },
  }
}

export const blogStaticSlugPaths = () => async (): Promise<GetStaticPathsResult<PageParams>> => {
  const db = await BlogDb.Initialize()
  const posts = await db.getAllPosts()

  const paths = {
    paths: posts.map((post) => {
      const date = new Date(post.date)
      const slg = { slug: [`${date.getFullYear()}`, slugify(post.title), `${post.id}`] }
      return {
        params: slg,
      }
    }),
    fallback: false,
  }

  return paths
}

export const blogStaticProps = () => async (): Promise<GetStaticPropsResult<PostsPageProps>> => {
  const db = await BlogDb.Initialize()
  const posts = await db.getAllPosts()
  return {
    props: {
      error: false,
      posts: posts,
    },
  }
}
