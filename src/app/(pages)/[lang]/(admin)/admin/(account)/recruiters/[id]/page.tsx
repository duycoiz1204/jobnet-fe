'use client';

import { useState, useEffect } from 'react';
import RecruiterType from '@/types/recruiter';
import { useParams } from 'next/navigation';
import useModal from '@/hooks/useModal';
import { useTranslations } from 'next-intl';
import { useAppDispatch } from '@/hooks/useRedux';
import recruiterService from '@/services/recruiterService';
import { toast } from 'sonner';
import { setLoading } from '@/features/loading/loadingSlice';
import businessService from '@/services/businessService';
import { RCAccountComponent } from '@/components/RCAccountComponent';
import BusinessInfo from '@/components/BusinessInfo';
import Modal from '@/components/modal/Modal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button } from '@/components/ui/button';

export default function RecuiterDetail() {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const recruiterId = useParams<{ id: string }>().id;

  const [recruiter, setRecruiter] = useState<RecruiterType>();
  const { modal, openModal, closeModal } = useModal();

  const [updateData, setUpdateData] = useState<boolean>(true);

  useEffect(() => {
    async function getRecruiter(): Promise<void> {
      const Recruiter = await recruiterService.getRecruiterById(recruiterId);
      setRecruiter(Recruiter);
    }
    getRecruiter().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [recruiterId, updateData]);

  const deleteRecruiter = (): void => {
    closeModal();
    dispatch(setLoading(true));
    recruiterService
      .deleteRecruiterById(recruiterId)
      .then(() => {
        toast.success('Đã khóa người dùng');
        dispatch(setLoading(false));
        setUpdateData(!updateData);
      })
      .catch(() => {
        toast.error('Không thể khóa người dùng');
        dispatch(setLoading(false));
      });
  };

  async function deleteBusiness() {
    closeModal();
    dispatch(setLoading(true));
    try {
      await businessService.deleteBusinessById(recruiter?.business.id);

      toast.success('Đã khóa công ty');
      setUpdateData(!updateData);
    } catch (err) {
      toast.error('Không thể khóa công ty');
    }
    dispatch(setLoading(false));
  }

  return (
    <div className="max-h-screen py-6 pr-6 overflow-y-scroll">
      <RCAccountComponent
        type="Admin"
        getProfileImage={recruiterService.getRecruiterProfileImage(
          recruiter?.id
        )}
        data={recruiter}
        openModel={openModal}
      />
      <p className="font-semibold text-emerald-500 text-xl">
        {t('recruiter.profile.adminRole.informationBusiness')}
      </p>
      <hr className="my-4 border-slate-200" />
      {recruiter?.business && (
        <BusinessInfo
          business={recruiter.business}
          openModal={openModal}
          mode="admin"
        />
      )}
      {/* Lock account */}
      <Modal
        id="delete-account"
        show={modal === 'delete-account'}
        size="md"
        popup
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {t('recruiter.profile.adminRole.modalBlock.recruiter.title')}
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteRecruiter}>
                {t('recruiter.profile.adminRole.modalBlock.recruiter.confirm')}
              </Button>
              <Button color="gray" onClick={closeModal}>
                {t('recruiter.profile.adminRole.modalBlock.recruiter.cancel')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* Lock business */}
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
              {t('recruiter.profile.adminRole.modalBlock.business.title')}
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
                {t('recruiter.profile.adminRole.modalBlock.business.confirm')}
              </Button>
              <Button color="gray" onClick={closeModal}>
                {t('recruiter.profile.adminRole.modalBlock.business.cancel')}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
