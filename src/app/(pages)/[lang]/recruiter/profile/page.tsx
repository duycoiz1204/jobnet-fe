'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import useModal from '@/hooks/useModal';

import Modal from '@/components/modal/Modal';

import recruiterService from '@/services/recruiterService';

import RecruiterType, { FormUpdateProfileRCProps } from '@/types/recruiter';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/input/InputWithLabel';
import { RCAccountComponent } from '@/components/RCAccountComponent';

export default function Account(): JSX.Element {
  const { data: session } = useSession();
  const t = useTranslations();
  const { modal, openModal, closeModal } = useModal();
  const [recruiterReload, setRecruiterReload] = useState<RecruiterType>();
  const [loading, setLoading] = useState<boolean | undefined>();
  const [reload, setReload] = useState<number>(0);
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getRecruiterById = useCallback(async () => {
    try {
      const fetchedData = await recruiterService.getRecruiterById(
        session?.user.id!!
      );
      setRecruiterReload(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [session?.user.id]);

  useEffect(() => {
    void getRecruiterById();
  }, [getRecruiterById, reload]);

  // Update personal information for recruiter
  const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;
    const formData = new FormData(formRef.current);

    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const nation = formData.get('nation') as string;

    if (!email || !name || !phone || !nation) {
      toast.error('Bạn vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const formValues: FormUpdateProfileRCProps = {
      email,
      name,
      phone,
      nation,
    };
    void (async () => {
      if (recruiterReload) {
        try {
          setLoading(true);
          await recruiterService.updateRecruiterProfile(
            session?.user.id!!,
            formValues
          );
          setLoading(false);
          closeModal();
          setReload((prevReload) => prevReload + 1);
          toast.success('Cập nhật thông tin thành công!');
        } catch (err) {
          setLoading(false);
          toast.error('Cập nhật thông tin thất bại!');
        }
      }
    })();
  };

  // Update image profile
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };
  const handleUploadImage = () => {
    void (async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        try {
          await recruiterService.uploadRecruiterProfileImage(
            session?.user.id!!,
            formData
          );
          setReload((prevReload) => prevReload + 1);
          closeModal();
          toast.success('Cập nhật ảnh thành công');
        } catch (err) {
          toast.error('Cập nhật ảnh thất bại');
        }
      }
    })();
  };
  return (
    <>
      {loading ? (
        <div className="fixed top-0 left-0 flex items-center justify-center w-full h-full bg-slate-50 opacity-70 z-[999]">
          <div className="w-10 h-10 border-4 rounded-full border-emerald-500 border-t-transparent animate-spin"></div>
        </div>
      ) : (
        ''
      )}
      <RCAccountComponent
        data={recruiterReload}
        getProfileImage={recruiterService.getRecruiterProfileImage(
          session?.user.id
        )}
        openModel={openModal}
      />
      <Modal
        id="upload-profile-image-modal"
        show={modal === 'upload-profile-image-modal'}
        popup
        onClose={closeModal}
      >
        <Modal.Header className="p-4 mb-6 bg-emerald-400">
          <p className="text-white">Cập nhật ảnh đại diện</p>
        </Modal.Header>{' '}
        <Modal.Body className="space-y-5">
          <Input
            id="file"
            type="file"
            name="file"
            className="outline-emerald-500"
            onChange={handleFileChange}
          />
          <div className="text-sm text-slate-500">
            JPG, GIF hoặc PNG. Kích thước tối đa 800K
          </div>

          <div className="flex float-right gap-2">
            <Button color="emerald" onClick={handleUploadImage}>
              Cập nhật
            </Button>
            <Button color="red" onClick={closeModal}>
              Hủy
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* Update profile */}
      <Modal
        id="update-recruiter-info-modal"
        show={modal === 'update-recruiter-info-modal'}
        popup
        onClose={closeModal}
      >
        <form ref={formRef} onSubmit={handleUpdateProfile}>
          <Modal.Header className="p-4 mb-6 bg-emerald-400">
            <p className="text-white">{t('recruiter.profile.update.button')}</p>
          </Modal.Header>{' '}
          <Modal.Body className="flex flex-col px-6 gap-y-4">
            <InputWithLabel
              label="Email"
              type="email"
              color="emerald"
              placeholder={recruiterReload?.email}
              name="email"
            />
            <InputWithLabel
              label={t('recruiter.profile.update.modal.labelUsername')}
              type="text"
              color="emerald"
              placeholder={recruiterReload?.name}
              name="name"
            />
            <InputWithLabel
              label={t('recruiter.profile.update.modal.labelPhonenumber')}
              type="text"
              color="emerald"
              placeholder={recruiterReload?.phone}
              name="phone"
            />
            <InputWithLabel
              label={t('recruiter.profile.update.modal.labelCountry')}
              type="text"
              color="emerald"
              placeholder={recruiterReload?.nation}
              name="nation"
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="flex items-center ml-auto -translate-y-2 gap-x-2">
              <Button type="submit">
                {t('recruiter.profile.update.footerButton.update')}
              </Button>
              <Button color="red" onClick={closeModal}>
                {t('recruiter.profile.update.footerButton.cancel')}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}
