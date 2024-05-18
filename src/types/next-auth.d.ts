import { DefaultSession, Session } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";



declare module "next-auth" {
  interface Session extends DefaultSession {
    user: { // User in Session Callback
      role: string,
      name: string,
      id: string,
      email: string,
    },
    accessToken: string
    refreshToken: string
  }

  interface User extends DefaultUser { //Type of User in JWT callback
    role: string;
    accessToken: string
    refreshToken: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    }
    accessToken: string;
    refreshToken: string;
  }
}