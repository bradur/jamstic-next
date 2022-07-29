import {
  createFolderIfItDoesntExist,
  findCoverColors,
  loadSavedGenericEntries,
  readJson,
  writeJson,
} from '@backendlib/file-helper'
import { AbsolutePath } from '@backendlib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { CustomEntryPageProps, CustomPageProps, GenericEntry } from 'types/types-custom'

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

export const customStaticSlug = () => async ({
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

export const customStaticPathsSlug = () => async (): Promise<GetStaticPathsResult<PageParams>> => {
  const entries = loadSavedGenericEntries('custom')
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

export const customStaticProps = () => async (): Promise<GetStaticPropsResult<CustomPageProps>> => {
  const entries = loadSavedGenericEntries('custom')
  return {
    props: {
      error: false,
      entries,
    },
  }
}
