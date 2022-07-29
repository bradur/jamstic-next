import {
  createFolderIfItDoesntExist,
  findCoverColors,
  loadSavedGenericEntries,
  readJson,
  writeJson,
} from '@lib/file-helper'
import { AbsolutePath } from '@lib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Head from 'next/head'
import { CustomEntryPage } from './components/CustomEntryPage'
import { CustomEntryPageProps, GenericEntry } from './types'

const CustomEntry = (props: CustomEntryPageProps) => {
  console.log('customEntry')
  if (props.error !== false) {
    return <div>{props.error}</div>
  }
  return (
    <>
      <Head>
        <title>jamsticnext - {(props.data as GenericEntry).name}</title>
      </Head>
      <CustomEntryPage {...(props.data as GenericEntry)} />
    </>
  )
}

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

const saveEntryData = (jamSlug: string, categorySlug: string, slug: string, data: object) => {
  const filePath = AbsolutePath.CustomDataFile(jamSlug, categorySlug, slug)
  createFolderIfItDoesntExist(filePath)
  writeJson(filePath, data)
}

export const getStaticProps = async ({
  params = { slug: [] },
}: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<CustomEntryPageProps>> => {
  const { categorySlug, slug } = paramsToInfo(params)
  const entry = readJson(AbsolutePath.CustomDataFile('custom', categorySlug, slug)) as GenericEntry
  if (entry.coverColors === undefined || entry.coverColors.css === '') {
    entry.coverColors = await findCoverColors(AbsolutePath.Image('custom', entry.categorySlug, entry.slug, entry.cover))
    saveEntryData('custom', entry.categorySlug, entry.slug, entry)
  }
  console.log(AbsolutePath.CustomDataFile('custom', categorySlug, slug))
  console.log(entry)
  if (!entry) {
    return {
      props: {
        error: true,
        data: "Couldn't find file!",
      },
    }
  }

  return {
    props: {
      error: false,
      data: entry,
    },
  }
}

export const getStaticPaths = async (): Promise<GetStaticPathsResult<PageParams>> => {
  console.log('static paths')
  const entries = loadSavedGenericEntries('custom')
  console.log(
    JSON.stringify(
      entries.map((entry) => {
        const slg = { slug: [entry.categorySlug, entry.slug] }
        return {
          params: slg,
        }
      }),
    ),
  )
  return {
    paths: entries.map((entry) => {
      const slg = { slug: [entry.categorySlug, entry.slug] }
      return {
        params: slg,
      }
    }),
    fallback: false,
  }
}

export default CustomEntry
