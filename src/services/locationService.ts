import BaseService from '@/services/baseService';
import locations from '../../public/data/locations.json';

export interface APILocationType {
  id?: string;
  name: string;
  slug?: string;
  type?: string;
  code: number;
  deleted?: boolean;
  name_with_type?: string;
}

class LocationService extends BaseService {
  getLocations() {
    return locations;
  }
}

const locationService = new LocationService();
export default locationService;
