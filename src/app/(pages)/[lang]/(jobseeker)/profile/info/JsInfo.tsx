'use client';

import InfoSection from '@/components/InfoSection';
import FileUpload from '@/components/input/FileUpload';
import InputWithLabel from '@/components/input/InputWithLabel';
import { ListInputChangeEvent } from '@/components/input/ListInput';
import LocationInput, {
  LocationInputChangeEvent,
} from '@/components/input/LocationInput';
import Modal from '@/components/modal/Modal';
import ModalForm from '@/components/modal/ModalForm';
import { Button } from '@/components/ui/button';
import { setLoading } from '@/features/loading/loadingSlice';
import useModal from '@/hooks/useModal';
import { useAppDispatch } from '@/hooks/useRedux';
import { useForceUpdate } from '@/lib/hooks';
import jobSeekerService from '@/services/jobSeekerService';
import ErrorType from '@/types/error';
import JobSeekerType from '@/types/jobSeeker';
import { CircleAlert, OctagonAlert, TicketCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

const initPersonalInfo = (jobSeeker: JobSeekerType) => ({
  name: jobSeeker.name,
  email: jobSeeker.email,
  phone: jobSeeker.phone || '',
  nation: jobSeeker.nation || '',
});

const initProfessionInfo = (jobSeeker: JobSeekerType) => ({
  salary: jobSeeker.salary || '',
  workingFormat: jobSeeker.workingFormat || '',
  profession: jobSeeker.profession || '',
  location: jobSeeker.location,
});

interface Props {
  _jobSeeker: JobSeekerType;
}

export default function JsInfo({ _jobSeeker }: Props): React.ReactElement {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  // _jobSeeker.refresh = false
  const [jobSeeker, setJobSeeker] = useState<JobSeekerType>(_jobSeeker);
  const [keyAvatar, setKeyAvatar] = useState<number>(0);
  const [file, setFile] = useState<File>();
  const [personalInfo, setPersonalInfo] = useState(initPersonalInfo(jobSeeker));
  const [professionInfo, setProfessionInfo] = useState(
    initProfessionInfo(jobSeeker)
  );
  const { modal, openModal, closeModal } = useModal();

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    changeInfo(e, setPersonalInfo);

  const handleProfessionInfoChange = useCallback(
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | ListInputChangeEvent
        | LocationInputChangeEvent
    ) => {
      setProfessionInfo((prev) => ({
        ...prev,
        [e.target.name == 'locations' ? 'location' : e.target.name]:
          e.target.value[e.target.value.length - 1],
      }));
    },
    []
  );

  const changeInfo = <T,>(
    e: React.ChangeEvent<HTMLInputElement>,
    setInfo: React.Dispatch<React.SetStateAction<T>>
  ) =>
    setInfo((prevInfo) => ({
      ...prevInfo,
      [e.target.name]: e.target.value,
    }));

  const handlePersonalInfoModalClose = () => {
    setPersonalInfo(initPersonalInfo(jobSeeker));
    closeModal();
  };

  const handleCloseProfessionInfoModal = () => {
    setProfessionInfo(initProfessionInfo(jobSeeker));
    closeModal();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0]);

  const handleImageUpload = () => {
    if (!file) {
      toast.error('Vui lòng chọn ảnh hồ sơ!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const jobSeekerRes = await jobSeekerService.uploadJobSeekerProfileImage(
          _jobSeeker.id,
          formData,
          session!!.accessToken
        ); // Need to add accessToken
        // setJobSeeker({...jobSeekerRes, refresh: !jobSeeker.refresh});
        setKeyAvatar(keyAvatar + 1);
        setFile(undefined);
        toast.success('Cập nhật ảnh hồ sơ thành công.');
      } catch (err) {
        openModal('profile-image-upload-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handlePersonalInfoUpdate = () => {
    if (
      !personalInfo.name ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !personalInfo.nation
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const jobSeeker = await jobSeekerService.updateJobSeekerPersonalInfo(
          _jobSeeker.id,
          personalInfo,
          session!!.accessToken
        );
        setJobSeeker(jobSeeker);
        toast.success('Cập nhật thông tin cá nhân thành công.');
      } catch (err) {
        openModal('personal-info-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleProfessionInfoUpdate = () => {
    if (
      !professionInfo.salary ||
      !professionInfo.workingFormat ||
      !professionInfo.profession ||
      !professionInfo.location
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const jobSeeker = await jobSeekerService.updateJobSeekerProfessionInfo(
          _jobSeeker.id,
          professionInfo,
          session!!.accessToken
        );
        setJobSeeker(jobSeeker);
        toast.success('Cập nhật thông tin nghề nghiệp thành công.');
      } catch (err) {
        openModal('profession-info-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  return (
    <div className="divide-y-2 pt-20">
      <div className="pb-6">
        <div className="flex flex-col items-baseline justify-between w-full gap-2 sm:flex-row">
          <h1 className="text-2xl font-bold">{t('jsProfile.title')}</h1>
          <div className="flex flex-col items-center sm:items-end">
            <p>
              {t('jsProfile.completion.label')}{' '}
              <b>{t('jsProfile.completion.incomplete')}</b>
            </p>
            <div className="flex">
              <CircleAlert
                className="my-auto h-7 "
                style={{
                  color: 'rgb(253 224 71)',
                }}
              />
              <p className="ml-2">{t('jsProfile.completion.warning')}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse items-center gap-4 sm:block">
          <div className="flex flex-col items-center justify-between gap-2 sm:gap-0 sm:flex-row">
            <div className="flex flex-col items-center gap-2 sm:gap-4 sm:flex-row">
              <div className="relative">
                <TicketCheck className="absolute bottom-0 right-0 grid w-5 h-5 text-emerald-500" />
                <img
                  className="w-20 h-20 border-2 rounded-full"
                  key={keyAvatar}
                  src={
                    jobSeeker.profileImageId
                      ? jobSeekerService.getJobSeekerProfileImage(jobSeeker.id)
                      : 'https://www.w3schools.com/howto/img_avatar2.png'
                  }
                />
              </div>
              <Button onClick={() => openModal('profile-image-upload-modal')}>
                {t('jsProfile.button.uploadImage')}
              </Button>
              <Button
                color="red"
                data-modal-id="delete-modal"
                onClick={() => openModal('delete-modal')}
              >
                {t('jsProfile.button.deleteImage')}
              </Button>
            </div>
            <Button color="slate">
              {t('jsProfile.button.upgradeAccount')}
            </Button>
          </div>
          <h1 className="mt-2 text-xl font-bold">{jobSeeker.name}</h1>
        </div>
      </div>

      <InfoSection
        className="py-6"
        header={
          <InfoSection.HeaderItem
            title={t('jsProfile.personalInfo.title')}
            handleOpenModal={() => openModal('personal-info-modal')}
          />
        }
      >
        <InfoSection.Item
          title={t('jsProfile.personalInfo.items.fullname')}
          content={jobSeeker.name}
        />
        <InfoSection.Item
          title={t('jsProfile.personalInfo.items.email')}
          content={jobSeeker.email}
        />
        <InfoSection.Item
          title={t('jsProfile.personalInfo.items.phone')}
          content={jobSeeker.phone}
        />
        <InfoSection.Item
          title={t('jsProfile.personalInfo.items.nation')}
          content={jobSeeker.nation}
        />
      </InfoSection>

      <InfoSection
        className="pt-6"
        header={
          <InfoSection.HeaderItem
            title={t('jsProfile.careerInfo.title')}
            handleOpenModal={() => openModal('profession-info-modal')}
          />
        }
      >
        <InfoSection.Item
          title={t('jsProfile.careerInfo.items.salary')}
          content={jobSeeker.salary}
        />
        <InfoSection.Item
          title={t('jsProfile.careerInfo.items.workingFormat')}
          content={jobSeeker.workingFormat}
        />
        <InfoSection.Item
          title={t('jsProfile.careerInfo.items.profession')}
          content={jobSeeker.profession}
        />
        <InfoSection.Item
          title={t('jsProfile.careerInfo.items.workplace')}
          content={`${jobSeeker.location?.specificAddress} - ${jobSeeker.location?.provinceName}`}
        />
      </InfoSection>

      <Modal
        id="profile-image-upload-modal"
        show={modal === 'profile-image-upload-modal'}
        onClose={closeModal}
      >
        <Modal.Header>
          {t('jsProfile.modal.profileImageUpload.title')}
        </Modal.Header>
        <Modal.Body>
          <FileUpload
            subtitle={t('jsProfile.modal.profileImageUpload.subtitle')}
            onFileSelect={handleFileSelect}
            onFileUpload={handleImageUpload}
            onModalClose={closeModal}
          />
        </Modal.Body>
      </Modal>

      <Modal
        id="delete-modal"
        show={modal === 'delete-modal'}
        size="lg"
        popup
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body className="py-10 space-y-4">
          <OctagonAlert className="w-16 h-16 mx-auto text-white-400 dark:text-slate-200" />
          <div className="text-lg font-normal text-center text-gray-500 dark:text-gray-400">
            {t('jsProfile.modal.delete.title')}
          </div>
          <div className="flex justify-center gap-4">
            <Button color="red" onClick={closeModal}>
              {t('jsProfile.modal.delete.button.sure')}
            </Button>
            <Button color="slate" onClick={closeModal}>
              {t('jsProfile.modal.delete.button.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="personal-info-modal"
        show={modal === 'personal-info-modal'}
        size="2xl"
        onClose={handlePersonalInfoModalClose}
      >
        <Modal.Body>
          <ModalForm
            title={t('jsProfile.modal.personalInfo.title')}
            onInfoUpdate={handlePersonalInfoUpdate}
            onModalClose={handlePersonalInfoModalClose}
          >
            <ModalForm.Input
              title={t('jsProfile.modal.personalInfo.inputs.fullName.title')}
              name="name"
              placeholder={t(
                'jsProfile.modal.personalInfo.inputs.fullName.placeholder'
              )}
              value={personalInfo.name}
              onChange={handlePersonalInfoChange}
            />
            <ModalForm.Input
              title={t('jsProfile.modal.personalInfo.inputs.email.title')}
              name="email"
              placeholder={t(
                'jsProfile.modal.personalInfo.inputs.email.placeholder'
              )}
              value={personalInfo.email}
              onChange={handlePersonalInfoChange}
            />
            <ModalForm.Input
              title={t('jsProfile.modal.personalInfo.inputs.phone.title')}
              name="phone"
              placeholder={t(
                'jsProfile.modal.personalInfo.inputs.phone.placeholder'
              )}
              value={personalInfo.phone}
              onChange={handlePersonalInfoChange}
            />
            <ModalForm.Input
              title={t('jsProfile.modal.personalInfo.inputs.nation.title')}
              name="nation"
              placeholder={t(
                'jsProfile.modal.personalInfo.inputs.nation.placeholder'
              )}
              value={personalInfo.nation}
              onChange={handlePersonalInfoChange}
            />
          </ModalForm>
        </Modal.Body>
      </Modal>

      <Modal
        id="profession-info-modal"
        size="2xl"
        show={modal === 'profession-info-modal'}
        onClose={handleCloseProfessionInfoModal}
      >
        <Modal.Header>{t('jsProfile.modal.professionInfo.title')}</Modal.Header>
        <Modal.Body className="space-y-5">
          <InputWithLabel
            label={t('jsProfile.modal.professionInfo.inputs.salary.title')}
            name="salary"
            placeholder={t(
              'jsProfile.modal.professionInfo.inputs.salary.placeholder'
            )}
            value={professionInfo.salary}
            onChange={handleProfessionInfoChange}
          />
          <InputWithLabel
            label={t(
              'jsProfile.modal.professionInfo.inputs.workingFormat.title'
            )}
            name="workingFormat"
            placeholder={t(
              'jsProfile.modal.professionInfo.inputs.workingFormat.placeholder'
            )}
            value={professionInfo.workingFormat}
            onChange={handleProfessionInfoChange}
          />
          <InputWithLabel
            label={t('jsProfile.modal.professionInfo.inputs.profession.title')}
            name="profession"
            placeholder={t(
              'jsProfile.modal.professionInfo.inputs.profession.placeholder'
            )}
            value={professionInfo.profession}
            onChange={handleProfessionInfoChange}
          />
          <LocationInput
            label={t('jsProfile.modal.professionInfo.inputs.location.title')}
            value={professionInfo.location}
            onLocationsChange={handleProfessionInfoChange}
          ></LocationInput>
          <div className="flex justify-end gap-4">
            <Button onClick={handleProfessionInfoUpdate}>
              {t('jsProfile.modal.professionInfo.button.update')}
            </Button>
            <Button color="red" onClick={handleCloseProfessionInfoModal}>
              {t('jsProfile.modal.professionInfo.button.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
