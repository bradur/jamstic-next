import { get } from '@lib/connector'

export class AlakajamConnector {
  static _staticUrl() {
    return 'https://static.alakajam.com'
  }
  static _apiUrl() {
    return 'https://alakajam.com'
  }
  static _userUrl() {
    return 'https://alakajam.com/user'
  }
  static getProfile(id: string | number) {
    return get(`${this._apiUrl()}/api/user/${id}`)
  }
  static getEntry(entryId: number) {
    return get(`${this._apiUrl()}/api/entry/${entryId}`)
  }
  static getEvent(eventId: number) {
    return get(`${this._apiUrl()}/api/event/${eventId}`)
  }
  static staticUrl(url: string) {
    return `${this._staticUrl()}/${url}`
  }
  static userUrl(url: string) {
    return `${this._userUrl()}/${url}`
  }
}
