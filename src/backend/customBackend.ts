import { createFolderIfItDoesntExist, findCoverColors, writeJson } from '@backendlib/file-helper'
import { JamsticLogger } from '@backendlib/logger'
import { AbsolutePath } from '@backendlib/path-helper'
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { CustomEntryPageProps, CustomPageProps } from 'types/types-custom'
import { EntryDb } from './db/entryDB'

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

export const customStaticSlug =
  () =>
  async ({
    params = { slug: [] },
  }: GetStaticPropsContext<PageParams>): Promise<GetStaticPropsResult<CustomEntryPageProps>> => {
    const { categorySlug, slug } = paramsToInfo(params)
    const entry = await loadEntry(slug, categorySlug)
    if (entry !== null) {
      if (entry.coverColors === undefined || entry.coverColors.css === '') {
        entry.coverColors = await findCoverColors(
          AbsolutePath.Image('custom', entry.categorySlug, entry.slug, entry.cover),
        )
        JamsticLogger.log('wanna save covercolors!')
      }
    }
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
  const entries = await loadEntries()
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
  const entries = await loadEntries()
  return {
    props: {
      error: false,
      entries,
    },
  }
}

const loadEntry = async (slug: string, categorySlug: string) => {
  const db = await EntryDb.Initialize()
  return await db.getEntry(slug, categorySlug)
}

const loadEntries = async () => {
  const db = await EntryDb.Initialize()
  return await db.getAllEntries()
}
