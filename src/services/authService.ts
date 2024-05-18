import envConfig from "@/config"
import BaseService from "@/services/baseService"
import { JWTSessionType } from "@/types/user"

export interface AuthRequest {
    email: string
    password: string
}

class AuthService extends BaseService{
    private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/auth`

    async refresh(refreshToken: string) {
        const res = await fetch(
            `${this.apiBaseUrl}/refresh`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                },
            }
        )

        this.checkResponseNotOk(res)
        return this.getResponseData<JWTSessionType>(res)
    }
}

export default new AuthService()