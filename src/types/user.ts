export type UserRoleType = 'Admin' | 'Recruiter' | 'JobSeeker'

export default interface UserType {
  id: string
  email: string
  name: string
  role: 'Admin' | 'Recruiter' | 'JobSeeker'
}
