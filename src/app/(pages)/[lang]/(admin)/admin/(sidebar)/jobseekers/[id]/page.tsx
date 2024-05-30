'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

import useModal from '@/hooks/useModal';
import { setLoading } from '@/features/loading/loadingSlice';
import { RCAccountComponent } from '@/components/RCAccountComponent';
import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/button';
import { Application } from '@/app/(pages)/[lang]/(jobseeker)/profile/recent-applications/RecentAppCpn';

import jobSeekerService from '@/services/jobSeekerService';
import applicationService from '@/services/applicationService';

import ApplicationType from '@/types/application';
import JobSeekerType from '@/types/jobSeeker';
import ErrorType from '@/types/error';

export default function JobSeekerDetail() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const id = useParams<{ id: string }>().id;
  const [jobseeker, setJobseeker] = useState<JobSeekerType>();
  const [appRecents, setAppRecents] = useState<ApplicationType[]>();
  const [updateData, setUpdateData] = useState<boolean>(true);

  const { modal, openModal, closeModal } = useModal();

  useEffect(() => {
    async function getRecruiter(): Promise<void> {
      const Jobseeker = await jobSeekerService.getJobSeekerById(
        id,
        session?.accessToken!
      );
      if (!Jobseeker.dateOfBirth)
        Jobseeker.dateOfBirth = 'Ngày sinh chưa cập nhật';
      if (!Jobseeker.gender) Jobseeker.gender = 'Chưa cập nhật';
      if (!Jobseeker.phone) Jobseeker.phone = 'Chưa cập nhật';
      if (!Jobseeker.address) Jobseeker.address = 'Chưa cập nhật';
      setJobseeker(Jobseeker);
    }
    getRecruiter().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [id, updateData, session?.accessToken]);

  const deleteJobseeker = (): void => {
    closeModal();
    dispatch(setLoading(true));
    jobSeekerService
      .deleteJobSeekerById(id, session?.accessToken!)
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

  useEffect(() => {
    void (async () => {
      try {
        const pagination = await applicationService.getApplications({
          jobSeekerId: id,
          accessToken: session?.accessToken!,
        });
        setAppRecents(pagination.data);
      } catch (err) {
        console.log((err as ErrorType).message);
      }
    })();
  }, [id, session?.accessToken]);

  return (
    <div className="max-h-screen py-6 pr-4 overflow-y-scroll">
      <RCAccountComponent
        type="Jobseeker"
        openModel={openModal}
        getProfileImage={jobSeekerService.getJobSeekerProfileImage(id)}
        data={jobseeker}
      />

      <div>
        <h2 className="font-semibold text-md text-emerald-500">
          Lịch sử ứng tuyển
        </h2>
        <hr className="mt-4 border-slate-200" />
        <div className="grid grid-cols-2 gap-4 py-4">
          {appRecents?.map((application) => (
            <Application
              application={application}
              key={application.id}
              type="Admin"
            />
          ))}
        </div>
      </div>
      <Modal
        id="delete-account-jobseeker"
        show={modal === 'delete-account-jobseeker'}
        size="md"
        popup
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn khóa tài khoản này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteJobseeker}>
                Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={() => closeModal()}>
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
