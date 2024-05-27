import envConfig from '@/config';
import BaseService from './baseService';

import CategoryType from '@/types/category';

class CategoryService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/categories`;

  async getCategories(props?: { search?: string }) {
    const params = new URLSearchParams();
    props?.search && params.append('search', props.search);

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<CategoryType[]>(res);
  }

  async createCategory(name: string, accessToken: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<CategoryType>(res);
  }

  async updateCategory(id: string, name: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<CategoryType>(res);
  }

  async deleteCategoryById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
  }
}

const categoryService = new CategoryService();
export default categoryService;
