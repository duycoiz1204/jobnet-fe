import envConfig from "@/config";
import BaseService from "@/services/baseService";
import UserType from "@/types/user";

class RegistrationService extends BaseService {
  private apiBaseUrl = `${envConfig.VITE_API_BASE_URL}/api/registration`
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
}

export default new RegistrationService()