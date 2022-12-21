import fs from 'fs'
import { Database } from 'sqlite3'
import { PostEntry } from 'types/types-blog'
import { createFolderIfItDoesntExist } from './file-helper'

type AllowedValues = string | number

export class DBConnector {
  dbPath = 'databases/posts.sqlite3'
  sqlGetAll = `SELECT id, title, body, date FROM posts;`
  sqlGetById = `SELECT id, title, body, date FROM posts WHERE id = ?;`
  static sqlCreateTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date INTEGER NOT NULL
    );
    `
  sqlInsertPosts = `INSERT INTO posts (title, body, date)
  VALUES (?, ?, ?);`

  constructor() {
    createFolderIfItDoesntExist(this.dbPath)
    if (!fs.existsSync(this.dbPath)) {
      console.log('could not find file, creating...')
      fs.writeFileSync(this.dbPath, '', { flag: 'wx' })
      console.log('created!')
    }
  }

  static async Initialize() {
    const dbcon = new DBConnector()
    await dbcon.sql(this.sqlCreateTable)
    return dbcon
  }

  async sql(sql: string, parameters: AllowedValues[] = []): Promise<PostEntry[]> {
    return new Promise((resolve, reject) => {
      const db = new Database(this.dbPath)
      const results: PostEntry[] = []
      db.all(sql, parameters, (error: Error | null, rows: any[]) => {
        if (error) {
          console.log('error:')
          console.log(error)
          reject()
          return
        }
        for (const row of rows) {
          results.push(row as PostEntry)
        }
        console.log(JSON.stringify(results))
        resolve(results)
        db.close()
      })
    })
  }

  async insertPost(post: PostEntry) {
    const { date, title, body } = post
    return this.sql(this.sqlInsertPosts, [title, body, date.getTime()])
  }

  async getPostById(id: number) {
    const [post] = await this.sql(this.sqlGetById, [id])
    return post
  }

  async getAllPosts() {
    return this.sql(this.sqlGetAll)
  }
}
