import LocationType from './location';
import UserType from './user';

export default interface JobSeekerType extends UserType {
  dateOfBirth?: string | null;
  phone?: string;
  gender?: string;
  nation?: string;
  salary?: string;
  aboutMe?: string;
  workingFormat?: string;
  profession?: string;
  location?: LocationType;
  education?: string;
  socialNetworks: string;
  verificationStatus: string;
  jobSearchStatus: string;
  accountType: string;
  profileImageId: string;
  address: string;
  locked: boolean;
}
