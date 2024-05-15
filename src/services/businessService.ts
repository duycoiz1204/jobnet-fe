import BaseService from './baseService';

import BusinessType, { EBusinessStatus } from '@/types/business';
import PaginationType from '../types/pagination';
import envConfig from '@/config';

class BusinessService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/businesses`;

  async getBusinesses(props?: {
    page?: number;
    pageSize?: number;
    sortBy?: string[];
    name?: string;
    phone?: string;
    status?: string;
    isDeleted?: boolean | string;
  }) {
    const params = new URLSearchParams();
    props?.page && params.append('page', props.page.toString());
    props?.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.name && params.append('name', props.name);
    props?.phone && params.append('phone', props.phone);
    props?.status && params.append('status', props.status);
    props?.isDeleted && params.append('isDeleted', props.isDeleted.toString());

    if (props?.sortBy) {
      props.sortBy.map((element) => {
        params.append('sortBy', element);
      });
    }

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<PaginationType<BusinessType>>(res);
  }

  async getBusinessById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`);

    this.checkResponseNotOk(res);
    return this.getResponseData<BusinessType>(res);
  }

  async updateBusinessGeneralInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/generalInfo`;
    return this.updateBusinessInfo(url, req);
  }

  async updateBusinessIntroductionInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/introductionInfo`;
    return this.updateBusinessInfo(url, req);
  }

  async updateBusinessContactInfo(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/contactInfo`;
    return this.updateBusinessInfo(url, req);
  }

  async updateBusinessStatus(id: string, status: EBusinessStatus) {
    const url = `${this.apiBaseUrl}/${id}/status`;
    return this.updateBusinessInfo(url, { status });
  }

  private async updateBusinessInfo(url: string, req: object) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BusinessType>(res);
  }

  async deleteBusinessById(id: string | undefined) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, { method: 'DELETE' });

    this.checkResponseNotOk(res);
  }

  async openDeleteBusinessById(id: string | undefined) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/open`, {
      method: 'DELETE',
    });

    this.checkResponseNotOk(res);
  }

  getBusinessProfileImage(id: string) {
    const url = `${this.apiBaseUrl}/${id}/profileImage`;
    return url;
  }

  async uploadBusinessProfileImage(id: string, formData: FormData) {
    const url = `${this.apiBaseUrl}/${id}/profileImage`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BusinessType>(res);
  }

  getBusinessBackgroundImage(id: string) {
    const url = `${this.apiBaseUrl}/${id}/backgroundImage`;
    return url;
  }

  async uploadBusinessBackgroundImage(id: string, formData: FormData) {
    const url = `${this.apiBaseUrl}/${id}/backgroundImage`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BusinessType>(res);
  }

  async updateBusinessFollowers(id: string, req: object) {
    const url = `${this.apiBaseUrl}/${id}/follow`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<BusinessType>(res);
  }
}

const businessService = new BusinessService();
export default businessService;
