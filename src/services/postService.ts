import { format } from 'date-fns';

import BaseService from './baseService';

import PostType, { PostActiveStatus } from '@/types/post';
import envConfig from '@/config';
import PaginationType from '@/types/pagination';

type GetProps = {
  page?: number;
  pageSize?: number;
  sortBy?: string[];
  search?: string;
  categoryId?: string;
  professionId?: string;
  minSalary?: number;
  maxSalary?: number;
  provinceName?: string;
  workingFormat?: string;
  recruiterId?: string;
  businessId?: string;
  activeStatus?: string;
  fromDate?: string;
  toDate?: string;
  isExpired?: boolean | string;
};

class PostService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/posts`;
  private apiElasticUrl = `${envConfig.NEXT_PUBLIC_ELASTIC}/api/post`;

  async getPosts(props?: GetProps) {
    const params = new URLSearchParams();
    props?.page && params.append('page', props.page.toString());
    props?.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.sortBy &&
      props.sortBy.map((element) => params.append('sortBy', element));

    props?.search && params.append('search', props!!.search!!);
    props?.categoryId && params.append('categoryId', props.categoryId);
    props?.professionId && params.append('professionId', props.professionId);
    props?.minSalary && params.append('minSalary', props.minSalary.toString());
    props?.maxSalary && params.append('maxSalary', props.maxSalary.toString());
    props?.provinceName &&
      params.append('provinceName', props.provinceName.toString());
    props?.workingFormat && params.append('workingFormat', props.workingFormat);
    props?.recruiterId && params.append('recruiterId', props.recruiterId);
    props?.businessId && params.append('businessId', props.businessId);
    props?.fromDate &&
      params.append('fromDate', format(new Date(props.fromDate), 'dd/MM/yyyy'));
    props?.toDate &&
      params.append('toDate', format(new Date(props.toDate), 'dd/MM/yyyy'));
    props?.activeStatus && params.append('activeStatus', props.activeStatus);
    props?.isExpired && params.append('isExpired', props.isExpired.toString());

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return await this.getResponseData<PaginationType<PostType>>(res);
  }

  async getElasticPosts(props?: GetProps) {
    const params = new URLSearchParams();
    props?.search && params.append('search', props.search);
    props?.categoryId && params.append('categoryId', props.categoryId);
    props?.professionId && params.append('professionId', props.professionId);
    props?.minSalary && params.append('minSalary', props.minSalary.toString());
    props?.maxSalary && params.append('maxSalary', props.maxSalary.toString());
    props?.provinceName &&
      params.append('provinceName', props.provinceName.toString());
    props?.workingFormat && params.append('workingFormat', props.workingFormat);

    const url = params.toString().length
      ? `${this.apiElasticUrl}?${params.toString()}`
      : this.apiElasticUrl;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return await this.getResponseData<PostType[]>(res);
  }

  async getPostById(id: string) {
    const res = await fetch(`${this.apiBaseUrl}/${id}`);

    this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }

  async createPost(req: FormData, accessToken: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: req,
    });

    await this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }

  async updatePostHeadingInfo(id: string, req: object, accessToken: string) {
    const url = `${this.apiBaseUrl}/${id}/headingInfo`;
    return this.updatePost(url, req, accessToken);
  }

  async updatePostGeneralInfo(id: string, req: object, accessToken: string) {
    const url = `${this.apiBaseUrl}/${id}/generalInfo`;
    return this.updatePost(url, req, accessToken);
  }

  async updatePostDetailedInfo(id: string, req: object, accessToken: string) {
    const url = `${this.apiBaseUrl}/${id}/detailedInfo`;
    return this.updatePost(url, req, accessToken);
  }

  async updatePostStatus(
    id: string,
    activeStatus: PostActiveStatus,
    accessToken: string
  ) {
    const url = `${this.apiBaseUrl}/${id}/status`;
    return this.updatePost(url, { activeStatus }, accessToken);
  }

  private async updatePost(url: string, req: object, accessToken: string) {
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(req),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<PostType>(res);
  }
}

const postService = new PostService();
export default postService;
