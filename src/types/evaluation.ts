export default interface EvaluationType {
  id: string
  recruiter: RecruiterType
  resumeId: string
  comments: Array<CommentType>
}

export interface CommentType {
  id: string
  content: string
  createdAt: string
}

type RecruiterType = {
  id: string
  name: string
  profileImageId: string
}
