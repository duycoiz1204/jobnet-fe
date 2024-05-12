import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import wishlistService from '@/services/wishlistService';
import { useTranslations } from 'next-intl';

export default function useIsInWishlist(postId: string) {
  const t = useTranslations();

  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const isExist = await wishlistService.existsWishlist(postId);
        setIsInWishlist(isExist);
      } catch (err) {
        console.error('Wishlist service unavailable.');
      }
    })();
  }, [postId]);

  const addToWishlist = () => {
    void (async () => {
      try {
        if (!isInWishlist) {
          await wishlistService.createWishlist(postId);
          toast.success(t('toast.post.save.saved'));
        } else {
          await wishlistService.deleteWishlist(postId);
          toast.success(t('toast.post.save.unsave'));
        }
        setIsInWishlist((prev) => !prev);
      } catch (err) {
        console.error('Wishlist service unavailable.');
      }
    })();
  };

  return { isInWishlist, addToWishlist };
}
