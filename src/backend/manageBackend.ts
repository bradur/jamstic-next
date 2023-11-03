import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'

type PageParams = {
  slug: string[]
}
type SlugInfo = {
  categorySlug: string
  slug: string
}

const paramsToInfo = (params: PageParams): SlugInfo => {
  const { slug } = params

  const [categorySlug, entrySlug] = slug
  return {
    categorySlug,
    slug: entrySlug,
  }
}

export type ManagePageProps = {
  error: boolean
  data: string
}
export const manageStaticSlug =
  () =>
    async ({
      params = { slug: [] },
    }: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<ManagePageProps>> => {
      const { categorySlug, slug } = paramsToInfo(params)
      return {
        props: {
          error: false,
          data: `Hello: ${categorySlug} + ${slug}`,
        },
      }
    }

export const manageStaticPathsSlug = () => async (): Promise<GetStaticPathsResult<PageParams>> => {
  return {
    paths: [],
    fallback: false,
  }
}

export const manageStaticProps = () => async (): Promise<GetStaticPropsResult<ManagePageProps>> => {
  return {
    props: {
      error: false,
      data: 'Hmm'
    },
  }
}
