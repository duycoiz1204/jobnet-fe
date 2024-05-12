import BaseService from './baseService';

import PaginationType from '../types/pagination';
import WishlistType from '@/types/wishlist';
import envConfig from '@/config';

class WishlistService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/wishlists`;

  async getWishlists(props: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
  }) {
    const params = new URLSearchParams();
    props.page && params.append('page', props.page.toString());
    props.pageSize && params.append('pageSize', props.pageSize.toString());
    props?.sortBy && params.append('sortBy', props.sortBy);

    const url = params.toString().length
      ? `${this.apiBaseUrl}?${params.toString()}`
      : this.apiBaseUrl;

    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<PaginationType<WishlistType>>(res);
  }

  async existsWishlist(postId: string) {
    const params = new URLSearchParams();
    params.append('postId', postId);

    const url = `${this.apiBaseUrl}/exists?${params.toString()}`;
    const res = await fetch(url);

    this.checkResponseNotOk(res);
    return this.getResponseData<boolean>(res);
  }

  async createWishlist(postId: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postId),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<WishlistType>(res);
  }

  async deleteWishlist(postId: string) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postId),
    });

    this.checkResponseNotOk(res);
  }
}

const wishlistService = new WishlistService();
export default wishlistService;
