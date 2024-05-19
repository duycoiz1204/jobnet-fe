export type UserRoleType = 'Admin' | 'Recruiter' | 'JobSeeker'

export default interface UserType {
  id: string
  email: string
  name: string
  role: 'Admin' | 'Recruiter' | 'JobSeeker'
}

export interface UserSessionType {
  role: string,
  name: string,
  id: string,
  email: string,
}


export interface JWTSessionType {
  user: {
    role: string,
    name: string,
    id: string,
    email: string,
  },
  accessToken: string,
  refreshToken: string
}