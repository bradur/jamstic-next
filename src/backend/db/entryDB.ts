import { DBConnector } from '@backendlib/db'
import { JamsticLogger } from '@backendlib/logger'
import { EntryImageType, EntryLink, GenericEntry, GenericEntryInDb } from 'types/types-custom'

export class EntryDb extends DBConnector {
  static dbPath = 'databases/entries.sqlite3'
  sqlGetAll = 'SELECT * FROM entries ORDER BY date DESC;'
  sqlGetById = 'SELECT * FROM entries WHERE id = ?;'
  sqlGetIdByNameAndDate = 'SELECT id FROM entries WHERE name = ? AND date = ?;'
  sqlGetBySlugAndCategorySlug = 'SELECT * FROM entries WHERE slug = ? AND categorySlug = ?;'
  sqlInsertEntries =
    'INSERT INTO entries (name, slug, description, body, url, css, date, categorySlug, coverImage, coverUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'
  sqlGetTagIdsByNames = 'SELECT id FROM tags WHERE name IN '
  sqlGetTagsByEntryId = `
  SELECT tags.name FROM entry_tags
  INNER JOIN tags ON tags.id = entry_tags.tag_id
  WHERE entry_tags.entry_id = ?;`
  sqlGetLinksByEntryId = 'SELECT title, url FROM entry_links WHERE entry_links.entry_id = ?;'
  sqlInsertTags = 'INSERT OR IGNORE INTO tags (name) VALUES '
  sqlInsertEntryTags = 'INSERT OR IGNORE INTO entry_tags (entry_id, tag_id) VALUES '
  sqlInsertLinks = 'INSERT INTO entry_links (entry_id, title, url) VALUES '
  sqlSelectTag = 'SELECT id, name FROM tags WHERE name = ?;'

  static sqlCreateTables = [
    `CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT NOT NULL,
    categorySlug TEXT NOT NULL,
    body TEXT NOT NULL,
    url TEXT NOT NULL,
    coverImage BLOB NOT NULL,
    coverUrl TEXT NOT NULL,
    css TEXT NOT NULL,
    date INTEGER NOT NULL,
    jamId INTEGER
  );`,
    `CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    UNIQUE(name)
  );`,
    `CREATE TABLE IF NOT EXISTS jams (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL
  )`,
    `CREATE TABLE IF NOT EXISTS entry_tags (
    entry_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    UNIQUE(entry_id, tag_id)
  );`,
    `CREATE TABLE IF NOT EXISTS entry_links (
    id INTEGER PRIMARY KEY,
    entry_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL
  );`,
    `CREATE TABLE IF NOT EXISTS entry_results (
    id INTEGER PRIMARY KEY,
    rating INTEGER,
    result TEXT NOT NULL,
    url TEXT NOT NULL
  );`,
    `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    external_id INTEGER,
    name TEXT NOT NULL
  );`,
  ]
  static async Initialize() {
    const dbcon = new EntryDb(this.dbPath)
    if (this.sqlCreateTables.length < 1) {
      throw Error('[DB] sqlCreateTable must not be empty!')
    }
    for (const sqlCreateTable of this.sqlCreateTables) {
      await dbcon.sql(sqlCreateTable)
    }
    return dbcon
  }

  async getEntry(slug: string, categorySlug: string) {
    const entries = await this.sql<GenericEntryInDb>(this.sqlGetBySlugAndCategorySlug, [slug, categorySlug])
    if (entries.length > 0) {
      return await this.processEntry(entries[0])
    }
    return null
  }

  async getAllEntries() {
    const entries = await this.sql<GenericEntryInDb>(this.sqlGetAll)
    const processedEntries = []
    for (const entry of entries) {
      processedEntries.push(await this.processEntry(entry))
    }
    return processedEntries
  }

  async processEntry({
    id,
    name,
    slug,
    description,
    categorySlug,
    body,
    url,
    css,
    date,
    coverImage,
    coverUrl,
  }: GenericEntryInDb): Promise<GenericEntry> {
    const fileType = coverUrl.split('.').slice(-1)
    const b64prefix = `data:image/${fileType};base64,`
    const processedEntry: GenericEntry = {
      name,
      slug,
      description,
      categorySlug,
      body,
      url,
      coverColors: { css: css },
      date,
      tags: await this.getTags(id),
      links: await this.getLinks(id),
      cover: {
        type: EntryImageType.COVER,
        originalUrl: coverUrl,
        base64: `${b64prefix}${coverImage.toString('base64')}`,
      },
    }
    console.log(processedEntry)
    return processedEntry
  }

  async getTag(tagName: string) {
    const foundTags = await this.sql<EntryTag>(this.sqlSelectTag, [tagName])
    if (foundTags.length > 0) {
      return foundTags[0]
    }
    return null
  }

  async insertTags(tags: string[]) {
    if (tags.length < 1) {
      return
    }
    const values = tags.map((tag) => `(?)`).join(',')
    await this.sql(`${this.sqlInsertTags} ${values};`, tags)
  }

  async getLinks(entryId: number) {
    return await this.sql<EntryLink>(this.sqlGetLinksByEntryId, [entryId])
  }
  async getTags(entryId: number) {
    const tags = await this.sql<{ name: string }>(this.sqlGetTagsByEntryId, [entryId])
    return tags.map(({ name }) => name)
  }
  async getTagIds(tags: string[]) {
    const values = tags.map((tag) => `?`).join(',')
    const tagIds = await this.sql<{ id: number }>(`${this.sqlGetTagIdsByNames} (${values});`, tags)
    return tagIds.map(({ id }) => id)
  }

  async insertLinks(entryId: number, links: EntryLink[]) {
    if (links.length < 1) {
      return
    }
    const linksAndTitles = links.map(({ title, url }) => [title, url]).flat()
    const values = links.map((link) => `(${entryId}, ?, ?)`).join(',')
    await this.sql(`${this.sqlInsertLinks} ${values};`, linksAndTitles)
  }

  async insertEntryTags(entryId: number, tags: string[]) {
    const tagIds = await this.getTagIds(tags)
    if (tagIds.length < 1) {
      return
    }
    const values = tagIds.map((tagId) => `(${entryId}, ?)`).join(',')
    await this.sql(`${this.sqlInsertEntryTags} ${values};`, tagIds)
  }

  async insertEntry(entry: GenericEntry) {
    const { name, slug, description, body, url, cover, coverColors, date, tags, links, categorySlug } = entry
    if (cover.base64 === undefined) {
      console.log('Error: No image base64.')
      return
    }
    const imageAsFile = Buffer.from(cover.base64, 'base64')
    await this.sql(this.sqlInsertEntries, [
      name,
      slug,
      description,
      body,
      url,
      coverColors.css,
      date,
      categorySlug,
      imageAsFile,
      cover.originalUrl,
    ])
    const inserted = await this.sql<GenericEntryInDb>(this.sqlGetIdByNameAndDate, [name, date])
    if (inserted.length > 0) {
      const [entry] = inserted
      await this.insertTags(tags)
      await this.insertEntryTags(entry.id, tags)
      await this.insertLinks(entry.id, links)
    } else {
      JamsticLogger.log('Something went wrong!')
    }
  }
}

type EntryTag = {
  id: number
  name: string
}
