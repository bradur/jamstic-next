import axios from 'axios'
import { JamsticLogger } from './logger'

export const get = (url: string) => {
  JamsticLogger.log(`GET to url: ${url}`)
  return axios.get(url)
}
export const stream = (url: string) => {
  JamsticLogger.log(`STREAM to url: ${url}`)
  return axios({ url, responseType: 'stream' })
}
