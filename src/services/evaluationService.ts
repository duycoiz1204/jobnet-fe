import BaseService from './baseService';

import EvaluationType from '../types/evaluation';
import envConfig from '@/config';

class EvaluationService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/resumes`;

  async getEvaluationByResumeId(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/evaluations/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<EvaluationType>(res);
  }

  async getEvaluationByAuth(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/evaluations`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<EvaluationType[]>(res);
  }

  async createEvaluation(id: string, comment: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(comment),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<EvaluationType>(res);
  }

  async createComment(id: string, comment: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/evaluations/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(comment),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<EvaluationType>(res);
  }

  async deleteEvaluation(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/evaluations/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    this.checkResponseNotOk(res);
  }

  async deleteComment(
    evaluationId: string,
    commentId: string,
    accessToken: string
  ) {
    const res = await fetch(
      `${this.apiBaseUrl}/${evaluationId}/evaluations/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    this.checkResponseNotOk(res);
  }
}

const evaluationService = new EvaluationService();
export default evaluationService;
