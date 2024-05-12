import BaseService from './baseService';

import ProfessionType from '@/types/profession';
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
    return this.getResponseData<Array<ProfessionType>>(res);
  }

  async createProfession(name: string, category: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, categoryId: category }),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ProfessionType>(res);
  }

  async updateProfession(id: number, name: string, category: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name, categoryId: category }),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ProfessionType>(res);
  }

  async deleteProfessionById(id: number) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, { method: 'DELETE' });
    this.checkResponseNotOk(res);
  }
}

const professionService = new ProfessionService();
export default professionService;
