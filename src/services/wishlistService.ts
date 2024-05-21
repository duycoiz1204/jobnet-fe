import envConfig from '@/config'
import BaseService from './baseService'
import PaginationType from '@/types/pagination'
import WishlistType from '@/types/wishlist'


class WishlistService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/wishlists`

  async getWishlists(props: {
    page?: number
    pageSize?: number
    sortBy?: string
    accessToken: string
  }) {
    const params = new URLSearchParams()
    props.page && params.append('page', props.page.toString())
    props.pageSize && params.append('pageSize', props.pageSize.toString())
    props?.sortBy && params.append('sortBy', props.sortBy)

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl

    const res = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.accessToken}`
      },
    })

    this.checkResponseNotOk(res)
    return this.getResponseData<PaginationType<WishlistType>>(res)
  }

  async existsWishlist(postId: string, accessToken: string) {
    const params = new URLSearchParams()
    params.append('postId', postId)

    const url = `${this.apiBaseUrl}/exists?${params.toString()}`
    const res = await fetch(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<boolean>(res)
  }

  async createWishlist(postId: string, accessToken: string) {
    const res = await fetch(
      this.apiBaseUrl,
      {
        body: JSON.stringify(postId),
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<WishlistType>(res)
  }

  async deleteWishlist(postId: string, accessToken: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(postId),
    })
    this.checkResponseNotOk(res)
  }
}

export default new WishlistService()
