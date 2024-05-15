import BaseService from './baseService';

import ResumeType from '@/types/resume';
import envConfig from '@/config';

class ResumeService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/resumes`;

  async getResumesByAuth() {
    const res = await fetch(this.apiBaseUrl);

    this.checkResponseNotOk(res);
    return this.getResponseData<Array<ResumeType>>(res);
  }

  async getResumesById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`);

    this.checkResponseNotOk(res);
    return this.getResponseData<ResumeType>(res);
  }

  async getResumeFile(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/file`);

    this.checkResponseNotOk(res);
    return this.getResponseBlob(res);
  }

  async createResume(formData: FormData) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      body: formData,
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ResumeType>(res);
  }

  async updateResume(id: string, req: object) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<ResumeType>(res);
  }

  async deleteResumeById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`, { method: 'DELETE' });

    this.checkResponseNotOk(res);
  }
}

const resumeService = new ResumeService();
export default resumeService;
