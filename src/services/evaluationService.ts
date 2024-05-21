import BaseService from './baseService'

import EvaluationType from '../types/evaluation'
import envConfig from '@/config'

class EvaluationService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/resumes`

  async getEvaluationByResumeId(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/evaluations/${id}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    this.checkResponseNotOk(res)
    return this.getResponseData<EvaluationType>(res)
  }

  async getEvaluationByAuth(id: string, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}/evaluations`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    this.checkResponseNotOk(res)
    return this.getResponseData<EvaluationType[]>(res)
  }

  async createEvaluation(id: string, comment: string | undefined) {
    const res = await this.authAxios.post(
      `${this.apiBaseUrl}/${id}/evaluations`,
      JSON.stringify(comment),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<EvaluationType>(res)
  }

  async createComment(id: string, comment: string | undefined) {
    const res = await this.authAxios.post(
      `${this.apiBaseUrl}/evaluations/${id}`,
      JSON.stringify(comment),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<EvaluationType>(res)
  }

  async deleteEvaluation(id: string) {
    const res = await this.authAxios.delete(
      `${this.apiBaseUrl}/evaluations/${id}`
    )

    this.checkResponseNotOk(res)
  }

  async deleteComment(evaluationId: string, commentId: string) {
    const res = await this.authAxios.delete(
      `${this.apiBaseUrl}/${evaluationId}/evaluations/comments/${commentId}`
    )

    this.checkResponseNotOk(res)
  }
}

export default new EvaluationService()
