import NextAuth from "next-auth"
import authConfig from "@/auth.config"


export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
  callbacks: {
    async session({session, token, user}){
      return {
        ...session,
        user: {
          ...session.user,
          ...token.user
        },
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
    },
    async jwt({token, user, session, trigger}){ // only return user signIn
      
      if(trigger === "update" && session){
        return {
          ...token,
          ...session,
          user: {
            ...token.user,
            ...session.user
          },
          name: (session.user?.name ? session.user?.name : token.name),
          email: (session.user?.email ? session.user?.email : token.email)
        }
      }
      if(user){        
        return {
          ...token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name 
          },
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }  
      }
      return token
    }
  },
  session: {strategy: "jwt"},
  ...authConfig
})