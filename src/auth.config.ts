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
            role: {}
          },
          authorize: async (credentials) => {
            let user = null
    
            // logic to verify if user exists
            const {email, password, role} = credentials
            
            let response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({email, password})
            })     
            console.log(response);
            
            if(response.ok){
              const {user, accessToken, refreshToken} = await response.json()
              if (user.role == role) {
                user.accessToken = accessToken
                user.refreshToken = refreshToken
                return user
              }
            }
            // return user object with the their profile data
            return user
          },
        })
      ],
} satisfies NextAuthConfig
