import fs from 'fs'
import { Database } from 'sqlite3'
import { PostEntry } from 'types/types-blog'
import { createFolderIfItDoesntExist } from './file-helper'

type AllowedValues = string | number

export class DBConnector {
  dbPath = ''
  static sqlCreateTable = ''

  constructor(dbPath = '') {
    if (dbPath !== '') {
      this.dbPath = dbPath
    }
    if (this.dbPath === '') {
      throw Error('[DB] Dbpath must not be empty!')
    }
    createFolderIfItDoesntExist(this.dbPath)
    if (!fs.existsSync(this.dbPath)) {
      console.log(`[DB] could not find file, creating '${this.dbPath}'...`)
      fs.writeFileSync(this.dbPath, '', { flag: 'wx' })
      console.log(`[DB] '${this.dbPath}' created!`)
    }
  }

  async sql(sql: string, parameters: AllowedValues[] = []): Promise<PostEntry[]> {
    return new Promise((resolve, reject) => {
      const db = new Database(this.dbPath)
      const results: PostEntry[] = []
      db.all(sql, parameters, (error: Error | null, rows: any[]) => {
        if (error) {
          console.log(`[DB] ERROR: ${error}`)
          reject()
          return
        }
        for (const row of rows) {
          results.push(row as PostEntry)
        }
        resolve(results)
        db.close()
      })
    })
  }
}
