import { get } from '@lib/connector'
import { LDJamFeedResponse, LDJamProfileResponse } from './types'

export class LDJamConnector {
  static _staticUrl() {
    return 'https://static.jam.vg/'
  }
  static _baseUrl() {
    return 'https://ldjam.com/'
  }
  static _userUrl() {
    return `${this._baseUrl()}/users/`
  }
  static apiUrl() {
    return 'https://api.ldjam.com/vx/'
  }
  static nodeUrl() {
    return `${this.apiUrl()}node/`
  }
  static node2Url() {
    return `${this.apiUrl()}node2/get/`
  }
  static feedLimit() {
    return 50
  } // 50 is max limit in ldjam API. won't hit that in a while
  static async getProfile(name: string): Promise<LDJamProfileResponse> {
    const response = await get(`${this.nodeUrl()}walk/1/users/${name}`)
    return response.data as LDJamProfileResponse
  }

  static async getProfileDetails(id: number) {
    return this.getProfileDetailsMultiple([id])
  }

  static async getProfileDetailsMultiple(ids: number[]) {
    return get(`${this.node2Url()}${ids.join('+')}`)
  }

  static async getProfileById(id: number) {
    return get(`${this.nodeUrl()}walk/1/users/${id}`)
  }

  static async getFeed(id: number): Promise<LDJamFeedResponse> {
    const response = await get(`${this.nodeUrl()}feed/${id}/authors/item/game?limit=${this.feedLimit()}`)
    return response.data as LDJamFeedResponse
  }

  static async getNodes(nodeIds: number[]) {
    return get(`${this.apiUrl()}/node2/get/${nodeIds.join('+')}`)
  }

  static async getPlatforms() {
    return get(`${this.apiUrl()}/tag/get/platform`)
  }

  static async getComments(nodeId: number) {
    return get(`${this.apiUrl()}/comment/getbynode/${nodeId}`)
  }

  static staticUrl(url: string) {
    return `${this._staticUrl()}/${url}`
  }
  static userUrl(url: string) {
    return `${this._userUrl()}/${url}`
  }
  static baseUrl(path: string) {
    return `${this._baseUrl}${path}`
  }
}
