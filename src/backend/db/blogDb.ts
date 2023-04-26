import { DBConnector } from '@backendlib/db'
import { PostEntry } from 'types/types-blog'

export class BlogDb extends DBConnector {
  static dbPath = 'databases/posts.sqlite3'
  sqlGetAll = 'SELECT id, title, body, date FROM posts ORDER BY date DESC;'
  sqlGetById = 'SELECT id, title, body, date FROM posts WHERE id = ?;'
  static sqlCreateTable = `
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    date INTEGER NOT NULL
    );
    `
  sqlInsertPosts = 'INSERT INTO posts (title, body, date) VALUES (?, ?, ?);'
  sqlRemovePost = 'DELETE FROM posts WHERE id = ?;'

  static async Initialize() {
    const dbcon = new BlogDb(this.dbPath)
    if (this.sqlCreateTable === '') {
      throw Error('[DB] sqlCreateTable must not be empty!')
    }
    await dbcon.sql(this.sqlCreateTable)
    return dbcon
  }

  async insertPost(post: PostEntry) {
    const { date, title, body } = post
    return this.sql(this.sqlInsertPosts, [title, body, date.getTime()])
  }

  async removePost(id: number) {
    return this.sql(this.sqlRemovePost, [id])
  }

  async getPostById(id: number) {
    const [post] = await this.sql(this.sqlGetById, [id])
    return post
  }

  async getAllPosts() {
    return this.sql(this.sqlGetAll)
  }
}
