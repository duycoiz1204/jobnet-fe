'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { View } from 'lucide-react';

import useModal from '@/hooks/useModal';
import resumeService from '@/services/resumeService';
import { setLoading } from '@/features/loading/loadingSlice';
import recruiterService from '@/services/recruiterService';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/modal/Modal';
import Radio from '@/components/input/Radio';
import EmptyTableRow from '@/components/table/EmptyTableRow';
import FileUpload from '@/components/input/FileUpload';

import ResumeType from '@/types/resume';
import ErrorType from '@/types/error';
import { useAppDispatch } from '@/hooks/useRedux';
import Image from 'next/image';

const initPermission = (resume?: ResumeType) => ({
  id: resume?.id,
  accessPermission: resume?.accessPermission,
  supportPermission: resume?.supportPermission,
});

interface ResumeProps {
  _resumes: Array<ResumeType>;
}

export default function ResumeCpn({ _resumes }: ResumeProps) {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const [resumes, setResumes] = useState<ResumeType[]>(_resumes);
  const [viewerId, setViewerId] = useState<Array<string>>();
  const [file, setFile] = useState<File>();
  const [recruiterViewed, setRecruiterViewed] = useState<Array<any>>();
  const [permission, setPermission] = useState(initPermission());
  const { modal, openModal, closeModal } = useModal();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFile(e.target.files?.[0]);

  const handleCvUpload = () => {
    if (!file) {
      toast.error(t('toast.applyCV.noneFileUpload'));
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const resume = await resumeService.createResume(
          formData,
          session?.accessToken!
        );
        setResumes((prev) => [...prev, resume]);
        setFile(undefined);
        toast.success(t('toast.applyCV.uploadCVSucess'));
      } catch (err) {
        openModal('cv-upload-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  // const handleViewClick = (resumeId: string) => {
  //   void (async () => {
  //     dispatch(setLoading(true))

  //     try {
  //       const pdfBlob = await resumeService.getResumeFile(resumeId)
  //       const pdfBlobURL = URL.createObjectURL(pdfBlob)
  //       window.open(pdfBlobURL)
  //     } catch (err) {
  //       toast.error((err as ErrorType).message)
  //     } finally {
  //       dispatch(setLoading(false))
  //     }
  //   })()
  // }

  const handleEditClick = (resumeId: string) => {
    const resume = resumes.find((resume) => resume.id === resumeId);
    setPermission(initPermission(resume));
    openModal('permission-update-modal');
  };

  const handlePermissionChange = (e: any) =>
    setPermission((prev) => ({ ...prev, [e.name]: e.target.value }));

  const handlePermissionUpdate = () => {
    const resumeId = permission.id;
    const req = {
      accessPermission: permission.accessPermission,
      supportPermission: permission.supportPermission,
    };

    resumeId &&
      void (async () => {
        closeModal();
        dispatch(setLoading(true));

        try {
          const _resume = await resumeService.updateResume(
            resumeId,
            req,
            session?.accessToken!
          );
          setResumes((prev) =>
            prev.map((resume) => (resume.id === _resume.id ? _resume : resume))
          );
          setPermission(initPermission());
          toast.success(t('toast.CV.permission.success'));
        } catch (err) {
          openModal('permission-update-modal');
          toast.error((err as ErrorType).message);
        } finally {
          dispatch(setLoading(false));
        }
      })();
  };

  const handleDeleteClick = (resumeId: string) => {
    void (async () => {
      dispatch(setLoading(true));

      try {
        await resumeService.deleteResumeById(resumeId, session?.accessToken!);
        setResumes((prev) => prev.filter((resume) => resume.id !== resumeId));
        toast.success(t('toast.CV.remove'));
      } catch (err) {
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleCvUploadModalClose = () => {
    setFile(undefined);
    closeModal();
  };

  const handlePermissionUpdateModalClose = () => {
    setPermission(initPermission());
    closeModal();
  };

  const handleShowListViewer = (id: string) => {
    openModal('viewed-recruiter-modal');
    void (async () => {
      const data = await resumeService.getResumesById(
        id,
        session!!.accessToken
      );
      setViewerId(data.viewerIds);
    })();
  };

  useEffect(() => {
    const fetchRecruiters = async () => {
      const promises = viewerId?.map(async (item) => {
        const data = await recruiterService.getRecruiterById(
          item,
          session?.accessToken!
        );
        return (
          <RecruiterViewedResumeItem
            key={data.id}
            image={data.id}
            business={data.business.name}
            id={data.business.id}
            name={data.name}
          />
        );
      });

      if (promises) {
        const resolvedComponents = await Promise.all(promises);
        setRecruiterViewed(resolvedComponents);
      }
    };
    void fetchRecruiters();
  }, [viewerId]);

  const resumeElms = resumes.map((resume, i) => (
    <TableRow key={resume.id}>
      <TableCell>{i + 1}</TableCell>
      <TableCell>{resume.createdAt}</TableCell>
      <TableCell>{resume.accessPermission}</TableCell>
      <TableCell>{resume.supportPermission}</TableCell>
      <TableCell className="flex items-center gap-2">
        <Button
          size="lg"
          variant="cyan"
          onClick={() => router.push(`../../view-resume/${resume.id}`)}
        >
          {t('resumes.uploadedCVs.button.view')}
        </Button>
        <Button size="lg" onClick={() => handleEditClick(resume.id)}>
          {t('resumes.uploadedCVs.button.edit')}
        </Button>
        <Button
          size="lg"
          variant="rose"
          onClick={() => handleDeleteClick(resume.id)}
        >
          {t('resumes.uploadedCVs.button.delete')}
        </Button>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center gap-x-3">
          <p>{resume.totalViews}</p>
          <Badge
            color="green"
            className="transition-all cursor-pointer hover:bg-[#aaf4d4]"
            onClick={() => handleShowListViewer(resume.id)}
          >
            Chi tiết
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <main className="space-y-10">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{t('resumes.title')}</h2>
          <div className="font-semibold text-slate-500">
            {t('resumes.subtitle')}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="text-xl font-semibold">
                {t('resumes.uploadedCVs.title')}
              </h4>
              <Badge variant="success">
                {t('resumes.uploadedCVs.count', { count: 5 })}
              </Badge>
            </div>
            <Button size="sm" onClick={() => openModal('cv-upload-modal')}>
              {t('resumes.uploadedCVs.button.uploadCV')}
            </Button>
          </div>

          <ResumeTableSection>
            {resumeElms.length ? resumeElms : <EmptyTableRow />}
          </ResumeTableSection>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h4 className="text-xl font-semibold">
                {t('resumes.smartCVs.title')}
              </h4>
              <Badge variant="success">
                {t('resumes.smartCVs.count', { count: 5 })}
              </Badge>
            </div>
            <Button size="sm">{t('resumes.smartCVs.button.chooseCV')}</Button>
          </div>

          <ResumeTableSection>
            <EmptyTableRow />
          </ResumeTableSection>
        </div>
      </main>

      {/* Modal upload CV */}
      <Modal
        id="cv-upload-modal"
        show={modal === 'cv-upload-modal'}
        onClose={handleCvUploadModalClose}
      >
        <Modal.Header>{t('resumes.modal.cvUpload.title')}</Modal.Header>
        <Modal.Body>
          <FileUpload
            subtitle={t('resumes.modal.cvUpload.subtitle')}
            onFileSelect={handleFileSelect}
            onFileUpload={handleCvUpload}
            onModalClose={handleCvUploadModalClose}
          />
        </Modal.Body>
      </Modal>

      {/* Modal edit permission */}
      <Modal
        show={modal === 'permission-update-modal'}
        size="lg"
        onClose={handlePermissionUpdateModalClose}
      >
        <Modal.Header>{t('resumes.modal.permissionUpdate.title')}</Modal.Header>
        <Modal.Body className="space-y-6">
          <ResumeUpdateSection
            title={t('resumes.modal.permissionUpdate.access.title')}
          >
            <Radio
              id="Private"
              name="accessPermission"
              label={t('resumes.modal.permissionUpdate.access.private')}
              value="Private"
              checked={permission.accessPermission === 'Private'}
              onChange={handlePermissionChange}
            />
            <Radio
              id="Public"
              name="accessPermission"
              label={t('resumes.modal.permissionUpdate.access.public')}
              value="Public"
              checked={permission.accessPermission === 'Public'}
              onChange={handlePermissionChange}
            />
            <Radio
              id="OnlyRegisteredEmployers"
              name="accessPermission"
              label={t(
                'resumes.modal.permissionUpdate.access.onlyRegisteredEmployers'
              )}
              value="OnlyRegisteredEmployers"
              checked={
                permission.accessPermission === 'OnlyRegisteredEmployers'
              }
              onChange={handlePermissionChange}
            />
            <Radio
              id="OnlyVerifiedRecruiters"
              name="accessPermission"
              label={t(
                'resumes.modal.permissionUpdate.access.onlyVerifiedRecruiters'
              )}
              value="OnlyVerifiedRecruiters"
              checked={permission.accessPermission === 'OnlyVerifiedRecruiters'}
              onChange={handlePermissionChange}
            />
          </ResumeUpdateSection>

          <ResumeUpdateSection
            title={t('resumes.modal.permissionUpdate.support.title')}
          >
            <Radio
              id="Enable"
              name="supportPermission"
              label={t('resumes.modal.permissionUpdate.support.enable')}
              value="Enable"
              checked={permission.supportPermission === 'Enable'}
              onChange={handlePermissionChange}
            />
            <Radio
              id="Disable"
              name="supportPermission"
              label={t('resumes.modal.permissionUpdate.support.disable')}
              value="Disable"
              checked={permission.supportPermission === 'Disable'}
              onChange={handlePermissionChange}
            />
            <Radio
              id="UnderReview"
              name="supportPermission"
              label={t('resumes.modal.permissionUpdate.support.underReview')}
              value="UnderReview"
              checked={permission.supportPermission === 'UnderReview'}
              onChange={handlePermissionChange}
            />
          </ResumeUpdateSection>

          <div className="flex items-center justify-end gap-4">
            <Button color="emerald" onClick={() => handlePermissionUpdate()}>
              {t('resumes.modal.permissionUpdate.button.update')}
            </Button>
            <Button color="rose" onClick={handlePermissionUpdateModalClose}>
              {t('resumes.modal.permissionUpdate.button.cancel')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal view recruiter list */}
      <Modal
        show={modal === 'viewed-recruiter-modal'}
        size="xl"
        onClose={closeModal}
      >
        <Modal.Header>Nhà tuyển dụng đã xem</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col pr-4 overflow-y-scroll gap-y-6 h-96">
            {recruiterViewed}
          </div>
        </Modal.Body>
        <hr />
        <Modal.Footer>
          <Button
            color="red"
            size="sm"
            className="ml-auto"
            onClick={() => closeModal()}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ResumeTableSection({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const t = useTranslations();

  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/12">{t('resumes.table.no')}</TableHead>
          <TableHead className="w-2/12">
            {t('resumes.table.createdAt')}
          </TableHead>
          <TableHead className="w-2/12">{t('resumes.table.access')}</TableHead>
          <TableHead className="w-2/12">{t('resumes.table.support')}</TableHead>
          <TableHead className="w-6/12"> {t('resumes.table.action')}</TableHead>
          <TableHead className="w-2/12">
            <div className="flex items-center gap-x-2">
              Lượt xem <View />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}

function ResumeUpdateSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-5">
      <h5>{title}</h5>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function RecruiterViewedResumeItem({ id, image, name, business }: ViewerType) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center px-2 gap-x-4">
          <div className="object-cover border-2 rounded-full w-11 h-11 border-emerald-500">
            <Image
              width={undefined}
              height={undefined}
              alt=""
              src={recruiterService.getRecruiterProfileImage(image)}
              className="w-full h-full rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-lg font-semibold">{name}</p>
            <span className="text-sm text-gray-600 font-normal truncate w-[280px]">
              {business}
            </span>
          </div>
        </div>
        <Badge
          color="green"
          className="transition-all cursor-pointer hover:bg-emerald-300"
          onClick={() => router.push(`../../businesses/${id}`)}
        >
          Doanh nghiệp
        </Badge>
      </div>
      <hr />
    </>
  );
}

type ViewerType = {
  id: string;
  image: string;
  name: string;
  business: string;
};
