import envConfig from "@/config";
import BaseService from "@/services/baseService";
import UserType from "@/types/user";

class RegistrationService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/registration`
  async registerJobSeeker(req: object) {
    console.log("URLasds: ", this.apiBaseUrl);

    const res = await fetch(
      `${this.apiBaseUrl}/jobSeeker`,
      {
        body: JSON.stringify(req),
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST"
      }
    )

    this.checkResponseNotOk(res)
    return this.getResponseData<UserType>(res)
  }
  async verifyUser(req: object) {
    const res = await fetch(
      `${this.apiBaseUrl}/verify`,
      {
        body: JSON.stringify(req),
        headers: {
          'Content-Type': 'application/json',
        },
        method: "POST"
      }
    )

    this.checkResponseNotOk(res)
  }
  async registerRecruiterWithNewBusiness(req: object) {
    const res = await fetch(
      `${this.apiBaseUrl}/recruiter/newBusiness`,
      {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    await this.checkResponseNotOk(res)
    return this.getResponseData<UserType>(res)
  }
  async registerRecruiterWithSelectedBusiness(req: object) {
    const res = await fetch(
      `${this.apiBaseUrl}/recruiter/selectedBusiness`,
      {
        method: "POST",
        body: JSON.stringify(req),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    await this.checkResponseNotOk(res)
    return this.getResponseData<UserType>(res)
  }
}

export default new RegistrationService()