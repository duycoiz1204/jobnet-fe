import BaseService from './baseService';

import type BenefitType from '../types/benefit';
import envConfig from '@/config';

class BenefitService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/benefits`;

  async getBenefits(props?: { search?: string }) {
    const params = new URLSearchParams();
    props?.search && params.append('search', props.search);

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<BenefitType[]>(res);
  }

  async createBenefit(req: object) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BenefitType>(res);
  }

  async updateBenefit(id: string, req: object) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BenefitType>(res);
  }

  async deleteBenefitById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, { method: 'DELETE' });

    this.checkResponseNotOk(res);
  }
}

const benefitService = new BenefitService();
export default benefitService;
