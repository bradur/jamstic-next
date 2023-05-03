import fs from 'fs'
import { Database } from 'sqlite3'
import { createFolderIfItDoesntExist } from './file-helper'
import { JamsticLogger } from './logger'

type AllowedValues = string | number | Buffer

export class DBConnector {
  dbPath = ''
  static sqlCreateTables: string[] = []

  constructor(dbPath = '') {
    if (dbPath !== '') {
      this.dbPath = dbPath
    }
    if (this.dbPath === '') {
      throw Error('[DB] Dbpath must not be empty!')
    }
    createFolderIfItDoesntExist(this.dbPath)
    if (!fs.existsSync(this.dbPath)) {
      JamsticLogger.log(`[DB] could not find file, creating '${this.dbPath}'...`)
      fs.writeFileSync(this.dbPath, '', { flag: 'wx' })
      JamsticLogger.log(`[DB] '${this.dbPath}' created!`)
    }
  }

  async sql<T>(sql: string, parameters: AllowedValues[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
      const db = new Database(this.dbPath)
      const results: T[] = []
      db.all(sql, parameters, (error: Error | null, rows: any[]) => {
        if (error) {
          JamsticLogger.log(`[DB] ERROR: ${error}`)
          reject()
          return
        }
        for (const row of rows) {
          results.push(row as T)
        }
        resolve(results)
        db.close()
      })
    })
  }
}
