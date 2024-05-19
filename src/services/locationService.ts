import envConfig from '@/config';
import BaseService from './baseService';

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
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/location`;

  async getLocations() {
    const res = await fetch(`${this.apiBaseUrl}/provinces`);
    this.checkResponseNotOk(res);
    return this.getResponseData<APILocationType[]>(res);
  }
}

const locationService = new LocationService();

export default locationService;
