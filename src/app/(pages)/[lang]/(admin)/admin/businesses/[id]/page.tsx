'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useRedux';
import { toast } from 'sonner';
import useModal from '@/hooks/useModal';
import { setLoading } from '@/features/loading/loadingSlice';

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import BusinessInfo from '@/components/BusinessInfo';
import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/button';

import businessService from '@/services/businessService';
import BusinessType from '@/types/business';

export default function ADBusinessDetails(): JSX.Element {
  const { data: session } = useSession();
  const params = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const [updateData, setUpdateData] = useState<boolean>(true);

  const { modal, openModal, closeModal } = useModal();

  const [business, setBusiness] = useState<BusinessType>();

  useEffect(() => {
    const loadData = async () => {
      const data: BusinessType = await businessService.getBusinessById(
        params.id as string
      );
      setBusiness(data);
    };

    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [params.id]);

  async function deleteBusiness() {
    closeModal();
    dispatch(setLoading(true));
    try {
      await businessService.deleteBusinessById(
        params.id,
        session?.accessToken!
      );

      toast.success('Đã khóa công ty');
      setUpdateData(!updateData);
    } catch (err) {
      toast.error('Không thể khóa công ty');
    }
    dispatch(setLoading(false));
  }

  return (
    <div className="h-screen py-6 overflow-y-scroll">
      {business && (
        <BusinessInfo business={business} openModal={openModal} mode="admin" />
      )}
      <Modal
        id="modal-lock-account"
        show={modal === 'modal-lock-account'}
        size="md"
        popup
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn khóa công ty này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() => {
                  deleteBusiness().catch(() => {
                    toast.error('Không thể xóa doanh nghiệp');
                  });
                }}
              >
                Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={closeModal}>
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
