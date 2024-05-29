import BaseService from './baseService';

import PaginationType from '../types/pagination';
import RecruiterType, { FormUpdateProfileRCProps } from '../types/recruiter';
import envConfig from '@/config';

class RecruiterService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/recruiters`;

  async getRecruiters(props: {
    page?: number;
    pageSize?: number;
    sortBy?: string[];
    email?: string;
    name?: string;
    phone?: string;
    business?: string;
    accessToken: string;
  }) {
    const params = new URLSearchParams();
    props?.page && params.append('page', props.page.toString());
    props?.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.email && params.append('email', props.email);
    props?.name && params.append('name', props.name);
    props?.phone && params.append('phone', props.phone);
    props?.business && params.append('business', props.business);
    if (props?.sortBy) {
      props.sortBy.map((element) => {
        params.append('sortBy', element);
      });
    }
    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<PaginationType<RecruiterType>>(res);
  }

  async getRecruiterById(id: string, accessToken?: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<RecruiterType>(res);
  }

  async updateRecruiterProfile(
    id: string,
    data: FormUpdateProfileRCProps,
    accessToken: string
  ) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<RecruiterType>(res);
  }

  getRecruiterProfileImage(id: string | undefined) {
    const url = `${this.apiBaseUrl}/${id}/profileImage`;
    return url;
  }

  async uploadRecruiterProfileImage(
    recruiterId: string,
    formData: FormData,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${recruiterId}/profileImage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<RecruiterType>(res);
  }

  async deleteRecruiterById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
  }

  async openDeleteRecruiterById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/open`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
  }
}

const recruiterService = new RecruiterService();
export default recruiterService;
