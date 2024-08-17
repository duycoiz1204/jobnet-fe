import ProfessionType from './profession';
import { BusinessPostType } from './business';
import LevelType from './level';
import BenefitType from './benefit';
import RecruiterType from './recruiter';
import LocationType from './location';
import DegreeType from './degree';

export type PostActiveStatus =
  | 'Pending'
  | 'Opening'
  | 'Closed'
  | 'Stopped'
  | 'Blocked'
  | 'Rejected';

export default interface PostType {
  id: string;
  title: string;
  profession: ProfessionType | undefined;
  minSalary: string | number;
  minSalaryString: string;
  maxSalary:  number; 
  maxSalaryString: string;
  level: LevelType;
  locations: Array<LocationType>;
  workingFormat: string;
  benefits: Array<BenefitType>;
  description: string;
  yearsOfExperience: string;
  // degrees: Array<DegreeType>
  otherRequirements: string;
  requisitionNumber: number;
  // internalContact: string
  applicationDeadline: string;
  jdId: string | null;
  recruiterId: RecruiterType | null;
  business: BusinessPostType;
  activeStatus: PostActiveStatus;
  totalViews: number;
  createdAt: string;
}

export interface GeneratePostType {
  minSalary: string | undefined;
  maxSalary: string | undefined;
  otherRequirements: string | undefined;
  requireNumber: string | undefined;
  yearExp: string | undefined;
  workType: string | undefined;
  degrees: string[] | undefined;
  title: string | undefined;
  profession: string | undefined;
  levels: string[] | undefined;
  benefits: string[] | undefined;
  locations: string[] | undefined;
}

export interface PostPreviewType {
  applicationDeadline: string;
  minSalaryString: string;
  maxSalaryString: string;
  requisitionNumber: string;
  yearsOfExperience: string;
  title: string;
  description: string;
  profession: ProfessionType | undefined;
}
export interface PostInputs {
  minSalary: string | undefined;
  maxSalary: string | undefined;
  otherRequirements: string | undefined;
  requireNumber: string | undefined;
  yearExp: number | undefined;
  workType: string | undefined;
  title: string | undefined;
}
