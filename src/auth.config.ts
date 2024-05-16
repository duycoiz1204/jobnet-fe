import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials"

export default {
    providers: [
        Credentials({
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          credentials: {
            email: {},
            password: {},
          },
          authorize: async (credentials) => {
            let user = null
    
            // logic to verify if user exists
            const {email, password} = credentials
            
            let response = await fetch("http://localhost:8080/api/auth/login", {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({email, password})
            })     
            if(response.ok){
              const {user, accessToken, refreshToken} = await response.json()
              user.accessToken = accessToken
              user.refreshToken = refreshToken
              return user
            }
            // return user object with the their profile data
            return user
          },
        })
      ],
} satisfies NextAuthConfig
