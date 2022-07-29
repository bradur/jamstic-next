import { get } from '@backendlib/connector'

export class GGJConnector {
  static _baseUrl() {
    return 'https://globalgamejam.org'
  }
  static profileUrl(profileName: string): string {
    return `${this._baseUrl()}/users/${profileName}`
  }
  static url(urlPart: string) {
    return `${this._baseUrl()}${urlPart}`
  }
  static async getProfile(profileName: string) {
    return get(this.profileUrl(profileName))
  }
  static async getUrl(urlPart: string) {
    return get(`${this._baseUrl()}${urlPart}`)
  }
  static eventUrl(eventYear: number) {
    return `${this._baseUrl}/${eventYear}/games`
  }
}
