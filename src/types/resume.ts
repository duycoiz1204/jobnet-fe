import JobseekerType from './jobSeeker';

export type ResumeAccessPermission =
  | 'Private'
  | 'Public'
  | 'OnlyRegisteredEmployers'
  | 'OnlyVerifiedRecruiters';

export type ResumeSupportPermission = 'Enable' | 'Disable' | 'UnderReview';

export default interface ResumeType {
  id: string;
  jobSeeker: JobseekerType;
  fileId: string;
  accessPermission: ResumeAccessPermission;
  supportPermission: ResumeSupportPermission;
  createdAt: string;
  totalViews: number;
  viewerIds: Array<string>;
}
