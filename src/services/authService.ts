export interface AuthRequest {
    email: string
    password: string
}

class AuthService {
    // private apiBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/auth`

    // async login(credentials: AuthRequest) {
    //     const res = await this.axios.post(
    //         `${this.apiBaseUrl}/login`,
    //         JSON.stringify(credentials),
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         }
    //     )

    //     this.checkResponseNotOk(res)
    //     return this.getResponseData<AuthType>(res)
    // }
}

export default new AuthService()