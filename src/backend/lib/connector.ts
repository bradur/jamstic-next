import axios from 'axios'

export const get = (url: string) => {
  console.log(`GET to url: ${url}`)
  return axios.get(url)
}
export const stream = (url: string) => {
  console.log(`STREAM to url: ${url}`)
  return axios({ url, responseType: 'stream' })
}
