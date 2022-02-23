import axios from 'axios'

const get = (url: string) => {
  console.log(`GET to url: ${url}`)
  return axios.get(url)
}
const stream = (url: string) => {
  console.log(`STREAM to url: ${url}`)
  return axios({ url, responseType: 'stream' })
}

class LDJam {
  static _staticUrl() {
    return 'https://static.jam.vg/'
  }
  static apiUrl() {
    return 'https://api.ldjam.com/vx/'
  }
  static nodeUrl() {
    return `${this.apiUrl()}/node/`
  }
  static feedLimit() {
    return 50
  } // 50 is max limit in ldjam API. won't hit that in a while
  static getProfile(name) {
    return get(`${this.nodeUrl()}walk/1/users/${name}`)
  }

  static getFeed(id) {
    return get(`${this.nodeUrl()}feed/${id}/authors/item/game?limit=${this.feedLimit()}`)
  }

  static getNodes(nodeIds) {
    return get(`${this.apiUrl()}/node2/get/${nodeIds.join('+')}`)
  }

  static getPlatforms() {
    return get(`${this.apiUrl()}/tag/get/platform`)
  }

  static getComments(nodeId) {
    return get(`${this.apiUrl()}/comment/getbynode/${nodeId}`)
  }

  static staticUrl(url) {
    return `${this._staticUrl()}/${url}`
  }
}

class LudumDare {
  static getProfile(name) {
    return get(`http://ludumdare.com/compo/author/${name}/`)
  }

  static getEntry(link) {
    return get(link)
  }
}

class Alakajam {
  static _staticUrl() {
    return 'https://static.alakajam.com'
  }
  static _apiUrl() {
    return 'https://alakajam.com'
  }
  static getProfile(name: string) {
    return get(`${this._apiUrl()}/api/user/${name}`)
  }
  static getEntry(entryId: string) {
    return get(`${this._apiUrl()}/api/entry/${entryId}`)
  }
  static getEvent(eventId: string) {
    return get(`${this._apiUrl()}/api/event/${eventId}`)
  }
  static staticUrl(url: string) {
    return `${this._staticUrl()}/${url}`
  }
  static getRatingTitle(index: number) {
    return ['Overall', 'Graphics', 'Audio', 'Gameplay', 'Originality', 'Theme'][index - 1]
  }
}

class GlobalGameJam {
  static _staticUrl() {
    return 'https://globalgamejam.org'
  }
  static getProfile(name) {
    return get(`${this._staticUrl()}/users/${name}/`)
  }

  static getEntry(link) {
    return get(link)
  }
}

export { LDJam, LudumDare, Alakajam, GlobalGameJam, stream }
