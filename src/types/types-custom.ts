export enum EntryImageType {
  AVATAR = 'avatar',
  COVER = 'cover',
  BODY = 'body',
  COMMENT = 'comment',
}

export type EntryImage = {
  type: EntryImageType
  originalUrl: string
  base64?: string
}

export type EntryLink = {
  title: string
  url: string
}

export type RGBColor = [r: number, g: number, b: number]

export type EntryColor = {
  name: string
  rgb: RGBColor
  hex: string
}

export type EntryColorPalette = {
  colors: EntryColor[]
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
  coverColors: EntryColorPalette
  date: number
}

export type GenericEntryInDb = GenericEntry & {
  id: number
  coverUrl: string
  css: string
  coverImage: Buffer
}

export type CustomPageProps = {
  error: boolean | string
  entries: GenericEntry[]
}

export type CustomEntryPageProps = {
  error: boolean
  data: GenericEntry | string
}
