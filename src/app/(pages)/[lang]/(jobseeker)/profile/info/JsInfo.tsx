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
import TextareaWithLabel from '@/components/textarea/TextareaWithLabel';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { setLoading } from '@/features/loading/loadingSlice';
import useModal from '@/hooks/useModal';
import { useAppDispatch } from '@/hooks/useRedux';
import { useRouter } from '@/navigation';
import jobSeekerService from '@/services/jobSeekerService';
import paymentService from '@/services/paymentService';
import ErrorType from '@/types/error';
import JobSeekerType from '@/types/jobSeeker';
import { CircleAlert, OctagonAlert, TicketCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';
import pyhelperService from '@/services/pyhelperService';
import Image from 'next/image';

const initAboutMe = (jobSeeker: JobSeekerType) => jobSeeker?.aboutMe || '';

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

const initEducation = (jobSeeker: JobSeekerType) => jobSeeker?.education || '';

const initSocialNetworks = (jobSeeker: JobSeekerType) =>
  jobSeeker?.socialNetworks || '';

interface Props {
  _jobSeeker: JobSeekerType;
}

export default function JsInfo({ _jobSeeker }: Props): React.ReactElement {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  // _jobSeeker.refresh = false
  const [jobSeeker, setJobSeeker] = useState<JobSeekerType>(_jobSeeker);
  const [keyAvatar, setKeyAvatar] = useState<number>(0);
  const [file, setFile] = useState<File>();

  const [aboutMe, setAboutMe] = useState(initAboutMe(jobSeeker));
  const [personalInfo, setPersonalInfo] = useState(initPersonalInfo(jobSeeker));
  const [professionInfo, setProfessionInfo] = useState(
    initProfessionInfo(jobSeeker)
  );
  const [education, setEducation] = useState(initEducation(jobSeeker));
  const [socialNetworks, setSocialNetworks] = useState(
    initSocialNetworks(jobSeeker)
  );
  const { modal, openModal, closeModal } = useModal();

  useEffect(() => {
    const upgradeAccount = searchParams.get('upgradeAccount');
    const token = searchParams.get('token');
    if (upgradeAccount === 'success' && token) {
      (async () => {
        try {
          await paymentService.capturePayment({ token }, session?.accessToken!);
          toast.success('Congrats! Your account is upgraded successfully');
          setJobSeeker((js) => ({ ...js, upgraded: true }));
        } catch (e) {
          toast.error('Oops! Failed to capture payment');
        }
      })();
    } else if (upgradeAccount === 'cancel' && token) {
      toast.info('Your account upgrading request is cancel');
    }
  }, [searchParams, session?.accessToken]);

  const handleCVParserInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formData = new FormData();
    formData.set('file', e.target.files![0], 'cvParser.pdf');

    dispatch(setLoading(true));
    (async () => {
      try {
        const response = await pyhelperService.parseCV(formData, 'cvParser');
        setAboutMe((prev) => response.aboutMe || prev);
        setPersonalInfo((prev) => ({
          ...prev,
          name: response.name || prev.name,
          phone: response.phone || prev.phone,
          nation: response.nation || prev.nation,
        }));
        setProfessionInfo((prev) => ({
          ...prev,
          profession: response.profession || prev.profession,
        }));
        setEducation((prev) => response.education || prev);
        setSocialNetworks((prev) => response.socialNetworks.join('\n') || prev);
        toast.success('Load CV profile successfully');
      } catch (e) {
        toast.error('Failed to load your CV!');
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleAboutMeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setAboutMe(e.target.value);

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

  const handleEducationChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setEducation(e.target.value);

  const handleSocialNetworksChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => setSocialNetworks(e.target.value);

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

  const handleEducationModalClose = () => {
    setEducation(initEducation(jobSeeker));
    closeModal();
  };

  const handleAboutMeModalClose = () => {
    setAboutMe(initAboutMe(jobSeeker));
    closeModal();
  };

  const handleSocialNetworksModalClose = () => {
    setSocialNetworks(initSocialNetworks(jobSeeker));
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

  const handleParseCVSubmit = async () => {
    if (
      !aboutMe ||
      !personalInfo.name ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !personalInfo.nation ||
      !professionInfo.salary ||
      !professionInfo.workingFormat ||
      !professionInfo.profession ||
      !professionInfo.location ||
      !education
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    dispatch(setLoading(true));
    try {
      await jobSeekerService.updateJobSeekerAboutMe(
        _jobSeeker.id,
        { aboutMe },
        session?.accessToken!
      );
      await jobSeekerService.updateJobSeekerPersonalInfo(
        _jobSeeker.id,
        personalInfo,
        session!!.accessToken
      );
      await jobSeekerService.updateJobSeekerProfessionInfo(
        _jobSeeker.id,
        professionInfo,
        session!!.accessToken
      );
      await jobSeekerService.updateJobSeekerEducation(
        _jobSeeker.id,
        { education },
        session?.accessToken!
      );
      const jobSeeker = await jobSeekerService.updateJobSeekerSocialNetworks(
        _jobSeeker.id,
        { socialNetworks },
        session?.accessToken!
      );
      setJobSeeker(jobSeeker);
      toast.success('Cập nhật thông tin cá nhân thành công.');
      closeModal();
    } catch (e) {
      openModal('cv-parser-modal');
      toast.error((e as ErrorType).message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleParseCVCancel = () => {
    setAboutMe(initAboutMe(jobSeeker));
    setPersonalInfo(initPersonalInfo(jobSeeker));
    setProfessionInfo(initProfessionInfo(jobSeeker));
    setEducation(initEducation(jobSeeker));
    setSocialNetworks(initSocialNetworks(jobSeeker));
    closeModal();
  }

  const handleAboutMeUpdate = async () => {
    if (!aboutMe) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    dispatch(setLoading(true));
    try {
      const jobSeeker = await jobSeekerService.updateJobSeekerAboutMe(
        _jobSeeker.id,
        { aboutMe },
        session?.accessToken!
      );
      setJobSeeker(jobSeeker);
      toast.success('Cập nhật thông tin cá nhân thành công.');
      closeModal();
    } catch (e) {
      toast.error((e as ErrorType).message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePersonalInfoUpdate = async () => {
    if (
      !personalInfo.name ||
      !personalInfo.email ||
      !personalInfo.phone ||
      !personalInfo.nation
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

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
  };

  const handleProfessionInfoUpdate = async () => {
    if (
      !professionInfo.salary ||
      !professionInfo.workingFormat ||
      !professionInfo.profession ||
      !professionInfo.location
    ) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

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
  };

  const handleEducationUpdate = async () => {
    if (!education) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    dispatch(setLoading(true));
    try {
      const jobSeeker = await jobSeekerService.updateJobSeekerEducation(
        _jobSeeker.id,
        { education },
        session?.accessToken!
      );
      setJobSeeker(jobSeeker);
      toast.success('Cập nhật thông tin cá nhân thành công.');
      closeModal();
    } catch (e) {
      toast.error((e as ErrorType).message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSocialNetworksUpdate = async () => {
    if (!socialNetworks) {
      toast.error('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    dispatch(setLoading(true));
    try {
      const jobSeeker = await jobSeekerService.updateJobSeekerSocialNetworks(
        _jobSeeker.id,
        { socialNetworks },
        session?.accessToken!
      );
      setJobSeeker(jobSeeker);
      toast.success('Cập nhật thông tin cá nhân thành công.');
      closeModal();
    } catch (e) {
      toast.error((e as ErrorType).message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="pt-20 divide-y-2">
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
                <Image
                  width={500}
                  height={500}
                  alt=""
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
              <Button
                data-modal-id="cv-parser-modal"
                onClick={() => openModal('cv-parser-modal')}
              >
                {t('jsProfile.button.cvParser')}
              </Button>
            </div>
            {!jobSeeker.upgraded && (
              <Button
                color="slate"
                onClick={() => openModal('upgrade-account-modal')}
              >
                {t('jsProfile.button.upgradeAccount')}
              </Button>
            )}
          </div>
          <h1 className="mt-2 text-xl font-bold">{jobSeeker.name}</h1>
        </div>
      </div>

      <InfoSection
        className="py-6"
        header={
          <InfoSection.HeaderItem
            title={t('jsProfile.aboutMe')}
            handleOpenModal={() => openModal('about-me-modal')}
          />
        }
      >
        <InfoSection.Item content={jobSeeker.aboutMe} />
      </InfoSection>

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

      <InfoSection
        className="py-6"
        header={
          <InfoSection.HeaderItem
            title={t('jsProfile.education')}
            handleOpenModal={() => openModal('education-info-modal')}
          />
        }
      >
        <InfoSection.Item content={education} />
      </InfoSection>

      <InfoSection
        className="py-6"
        header={
          <InfoSection.HeaderItem
            title={t('jsProfile.socialNetworks')}
            handleOpenModal={() => openModal('social-networks-modal')}
          />
        }
      >
        <InfoSection.Item content={socialNetworks} />
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
        id="upgrade-account-modal"
        show={modal === 'upgrade-account-modal'}
        onClose={closeModal}
        size="lg"
      >
        <Modal.Header>{t('jsProfile.modal.upgradeAccount.title')}</Modal.Header>
        <Modal.Body className="py-10 space-y-5">
          <div className="space-y-4">
            <h4>
              Nâng cấp tài khoản để nâng cao trải nghiệm của bạn (thời hạn sử
              dụng trong vòng 1 tháng).
            </h4>
            <div className="space-y-2">
              <div>
                Bạn có thể dùng những tính năng nâng cao sau khi nâng cấp, cụ
                thể như sau:
              </div>
              <ul className="italic">
                <li>1. Chatbot</li>
                <li>2. Resume CVs</li>
                <li>3. Biểu tượng xác minh tài khoản</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              color="emerald"
              onClick={async () => {
                const payment = await paymentService.createPayment(
                  {
                    total: 100,
                    description: 'Create payment for upgrading account',
                  },
                  session?.accessToken!
                );
                router.push(payment.url);
              }}
            >
              {t('fileUpload.button.upload')}
            </Button>
            <Button color="red" onClick={closeModal}>
              {t('fileUpload.button.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="cv-parser-modal"
        show={modal === 'cv-parser-modal'}
        size="2xl"
        onClose={handleParseCVCancel}
      >
        <Modal.Body>
          <div>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              {t('jsProfile.modal.cvParser.title')}
            </h3>
            <div className="space-y-4">
              <InputWithLabel
                label={t('jsProfile.modal.cvParser.inputs.cv.title')}
                type="file"
                name="cv"
                accept="application/pdf"
                onChange={handleCVParserInputChange}
              />
              <InputWithLabel
                label={t('jsProfile.modal.personalInfo.inputs.fullName.title')}
                name="name"
                placeholder={t(
                  'jsProfile.modal.personalInfo.inputs.fullName.placeholder'
                )}
                value={personalInfo.name}
                onChange={handlePersonalInfoChange}
              />
              <TextareaWithLabel
                label="About me"
                name="aboutMe"
                placeholder={t('jsProfile.modal.aboutMe.textArea.placeholder')}
                value={aboutMe}
                onChange={handleAboutMeChange}
              />
              <InputWithLabel
                label={t('jsProfile.modal.personalInfo.inputs.phone.title')}
                name="phone"
                placeholder={t(
                  'jsProfile.modal.personalInfo.inputs.phone.placeholder'
                )}
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
              />
              <InputWithLabel
                label={t('jsProfile.modal.personalInfo.inputs.nation.title')}
                name="nation"
                placeholder={t(
                  'jsProfile.modal.personalInfo.inputs.nation.placeholder'
                )}
                value={personalInfo.nation}
                onChange={handlePersonalInfoChange}
              />
              <InputWithLabel
                label={t(
                  'jsProfile.modal.professionInfo.inputs.profession.title'
                )}
                name="profession"
                placeholder={t(
                  'jsProfile.modal.professionInfo.inputs.profession.placeholder'
                )}
                value={professionInfo.profession}
                onChange={handleProfessionInfoChange}
              />
              <TextareaWithLabel
                label="Education"
                name="education"
                placeholder={t(
                  'jsProfile.modal.education.textArea.placeholder'
                )}
                value={education}
                onChange={handleEducationChange}
              />
              <TextareaWithLabel
                label="Social Networks"
                name="socialNetworks"
                placeholder={t(
                  'jsProfile.modal.socialNetworks.textArea.placeholder'
                )}
                value={socialNetworks}
                onChange={handleSocialNetworksChange}
              />
            </div>
            <div className="flex justify-center gap-4 mt-3">
              <Button
                type="submit"
                color="failure"
                onClick={handleParseCVSubmit}
              >
                Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={handleParseCVCancel}>
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="about-me-modal"
        show={modal === 'about-me-modal'}
        size="2xl"
        onClose={handleAboutMeModalClose}
      >
        <Modal.Body>
          <ModalForm
            title={t('jsProfile.modal.aboutMe.title')}
            onInfoUpdate={handleAboutMeUpdate}
            onModalClose={handleAboutMeModalClose}
          >
            <Textarea
              name="aboutMe"
              placeholder={t('jsProfile.modal.aboutMe.textArea.placeholder')}
              value={aboutMe}
              onChange={handleAboutMeChange}
            />
          </ModalForm>
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

      <Modal
        id="education-info-modal"
        show={modal === 'education-info-modal'}
        size="2xl"
        onClose={handleEducationModalClose}
      >
        <Modal.Body>
          <ModalForm
            title={t('jsProfile.modal.education.title')}
            onInfoUpdate={handleEducationUpdate}
            onModalClose={handleEducationModalClose}
          >
            <Textarea
              name="education"
              placeholder={t('jsProfile.modal.education.textArea.placeholder')}
              value={education}
              onChange={handleEducationChange}
            />
          </ModalForm>
        </Modal.Body>
      </Modal>

      <Modal
        id="social-networks-modal"
        show={modal === 'social-networks-modal'}
        size="2xl"
        onClose={handleSocialNetworksModalClose}
      >
        <Modal.Body>
          <ModalForm
            title={t('jsProfile.modal.socialNetworks.title')}
            onInfoUpdate={handleSocialNetworksUpdate}
            onModalClose={handleSocialNetworksModalClose}
          >
            <Textarea
              name="socialNetworks"
              placeholder={t(
                'jsProfile.modal.socialNetworks.textArea.placeholder'
              )}
              value={socialNetworks}
              onChange={handleSocialNetworksChange}
            />
          </ModalForm>
        </Modal.Body>
      </Modal>
    </div>
  );
}
