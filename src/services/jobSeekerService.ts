import envConfig from '@/config';
import BaseService from './baseService';

import JobSeekerType from '@/types/jobSeeker';
import PaginationType from '@/types/pagination';

class JobSeekerService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/jobSeekers`;

  async getJobSeekers(props: {
    page?: number;
    pageSize?: number;
    sortBy?: string[];
    email?: string;
    name?: string;
    phone?: string;
    verificationStatus?: string;
    accountType?: string;
    accessToken: string;
  }): Promise<PaginationType<JobSeekerType>> {
    const params = new URLSearchParams();
    props?.page && params.append('page', props.page.toString());
    props?.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.email && params.append('email', props.email);
    props?.name && params.append('name', props.name);
    props?.phone && params.append('phone', props.phone);
    props?.verificationStatus &&
      params.append('verificationStatus', props.verificationStatus);
    props?.accountType && params.append('accountType', props.accountType);

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
    return this.getResponseData<PaginationType<JobSeekerType>>(res);
  }

  async getJobSeekerById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<JobSeekerType>(res);
  }

  async updateJobSeekerAboutMe(id: string, req: object, accessToken: string) {
    const url = `${this.apiBaseUrl}/${id}/aboutMe`;

    return this.updateJobSeekerInfo(url, req, accessToken);
  }

  async updateJobSeekerPersonalInfo(
    id: string,
    req: object,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/personalInfo`;

    return this.updateJobSeekerInfo(url, req, accessToken);
  }

  async updateJobSeekerProfessionInfo(
    id: string,
    req: object,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/professionInfo`;

    return this.updateJobSeekerInfo(url, req, accessToken);
  }

  async updateJobSeekerEducation(id: string, req: object, accessToken: string) {
    const url = `${this.apiBaseUrl}/${id}/education`;

    return this.updateJobSeekerInfo(url, req, accessToken);
  }

  async updateJobSeekerSocialNetworks(
    id: string,
    req: object,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/socialNetworks`;

    return this.updateJobSeekerInfo(url, req, accessToken);
  }

  private async updateJobSeekerInfo(
    url: string,
    req: object,
    accessToken: string
  ) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<JobSeekerType>(res);
  }

  async deleteJobSeekerById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    this.checkResponseNotOk(res);
  }

  async openDeleteJobSeekerById(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/open`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    this.checkResponseNotOk(res);
  }

  getJobSeekerProfileImage(id: string) {
    const url = `${this.apiBaseUrl}/${id}/profileImage`;
    return url;
  }

  async uploadJobSeekerProfileImage(
    id: string,
    formData: FormData,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/profileImage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<JobSeekerType>(res);
  }

  async updateJobSeekerBusinessFollowed(
    id: string,
    req: object,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/follow`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<JobSeekerType>(res);
  }
}

const jobSeekerService = new JobSeekerService();
export default jobSeekerService;
