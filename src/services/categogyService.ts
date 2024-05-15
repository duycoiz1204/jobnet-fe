import BaseService from './baseService'

import CategoryType from '../types/category'
import envConfig from '@/config'

class CategoryService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/categories`

  async getCategories(props?: { search?: string }) {
    const params = new URLSearchParams()
    props?.search && params.append('search', props.search)

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl
    const res = await fetch(url)

    this.checkResponseNotOk(res)
    return this.getResponseData<CategoryType[]>(res)
  }

  async createCategory(name: string) {
    const res = await fetch(
      this.apiBaseUrl,
      {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    this.checkResponseNotOk(res)
    return this.getResponseData<CategoryType>(res)
  }

  async updateCategory(id: string, name: string) {
    const res = await fetch(
      `${this.apiBaseUrl}/${id}`,
      {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<CategoryType>(res)
  }

  async deleteCategoryById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: "DELETE"
    })

    this.checkResponseNotOk(res)
  }
}

export default new CategoryService()
