import BaseService from './baseService';
import ProfessionType from '../types/profession';
import envConfig from '@/config';

class ProfessionService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/professions`;

  async getProfessions(props?: { search?: string; categoryId?: string }) {
    const params = new URLSearchParams();
    props?.search && params.append('search', props.search);
    props?.categoryId && params.append('categoryId', props.categoryId);

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<ProfessionType[]>(res);
  }

  async createProfession(data: object, accessToken: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ProfessionType>(res);
  }

  async updateProfession(id: number, data: object, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ProfessionType>(res);
  }

  async deleteProfessionById(id: number, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    this.checkResponseNotOk(res);
  }
}

const professionService = new ProfessionService();
export default professionService;
