import axios from 'axios'

export const get = (url: string) => {
  console.log(`GET to url: ${url}`)
  return axios.get(url)
}
export const stream = (url: string) => {
  console.log(`STREAM to url: ${url}`)
  return axios({ url, responseType: 'stream' })
}
class LudumDare {
  static getProfile(name: string) {
    return get(`http://ludumdare.com/compo/author/${name}/`)
  }

  static getEntry(link: string) {
    return get(link)
  }
}

class GlobalGameJam {
  static _staticUrl() {
    return 'https://globalgamejam.org'
  }
  static getProfile(name: string) {
    return get(`${this._staticUrl()}/users/${name}/`)
  }

  static getEntry(link: string) {
    return get(link)
  }
}
