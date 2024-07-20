import envConfig from '@/config';
import BaseService from './baseService';
import PaginationType from '@/types/pagination';
import WishlistType from '@/types/wishlist';

class PaymentService extends BaseService {
  private apiBaseUrl = `${envConfig.NEXT_PUBLIC_BASE_URL}/api/payment`;

  async createPayment(
    {
      total,
      currency = 'USD',
      description = '',
    }: { total: number; currency?: string; description?: string },
    accessToken: string
  ) {
    const res = await fetch(this.apiBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ total, currency, description }),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<{ id: string; url: string }>(res);
  }

  async capturePayment(data: { token: string }, accessToken: string) {
    const res = await fetch(`${this.apiBaseUrl}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });

    this.checkResponseNotOk(res);
    return this.getResponseData<{ token: string }>(res);
  }
}

const paymentService = new PaymentService();
export default paymentService;
