import BaseService from './baseService';

export interface ParseCVResponse {
  name: string;
  email: string;
  birthday: string;
  phone: string;
  address: string;
  nation: string;
  profession: string;
  socialNetworks: Array<string>;
  aboutMe: string;
  education: string;
  skills: Array<string>;
  certifications: Array<string>;
}

class PyHelperService extends BaseService {
  private pyhelperBaseUrl = 'http://localhost:9201';
  private pdfParserUrl = this.pyhelperBaseUrl + '/api/pdf-parser';

  async parseCV(formData: FormData, filename: string) {
    const url = `${this.pdfParserUrl}/${filename}`;
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    this.checkResponseNotOk(res);
    return this.getResponseData<ParseCVResponse>(res);
  }
}

const pyhelperService = new PyHelperService();
export default pyhelperService;
