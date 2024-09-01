import JobseekerType from './jobSeeker';
import PostType from './post';
import ResumeType from './resume';

export type ApplicationStatus = 'Submitted' | 'Reviewed' | 'Rejected' | 'Hired' | 'Canceled';

export default interface ApplicationType {
  id: string;
  post: PostType;
  jobSeeker: JobseekerType;
  resume: ResumeType;
  createdAt: string;
  applicationStatus: ApplicationStatus;
}
