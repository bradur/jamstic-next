export enum EntryImageType {
  AVATAR = 'avatar',
  COVER = 'cover',
  BODY = 'body',
  COMMENT = 'comment',
}

export type EntryImage = {
  type: EntryImageType
  originalUrl: string
}

export type EntryLink = {
  title: string
  url: string
}

export type EntryColor = {
  css: string
}

export type GenericEntry = {
  name: string
  slug: string
  categorySlug: string
  description: string
  body: string
  url: string
  tags: string[]
  cover: EntryImage
  links: EntryLink[]
  coverColors: EntryColor
  date: number
}

export type GenericEntryInDb = GenericEntry & {
  id: number
  coverUrl: string
  css: string
}

export type CustomPageProps = {
  error: boolean | string
  entries: GenericEntry[]
}

export type CustomEntryPageProps = {
  error: boolean
  data: GenericEntry | string
}
