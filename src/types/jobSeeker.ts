import LocationType from './location';
import UserType from './user';

export default interface JobSeekerType extends UserType {
  dateOfBirth?: string | null;
  phone?: string;
  gender?: string;
  nation?: string;
  salary?: string;
  workingFormat?: string;
  profession?: string;
  location?: LocationType;
  verificationStatus: string;
  jobSearchStatus: string;
  accountType: string;
  profileImageId: string;
  address: string;
  locked: boolean;
}
