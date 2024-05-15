import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { setLoading } from '@/lib/features/loading/loadingSlice';
import resumeService from '@/services/resumeService';
import ErrorType from '@/types/error';
import applicationService from '@/services/applicationService';
import { Button } from '../ui/button';

import Modal from '@/components/modal/Modal';
import { Input } from '../ui/input';
import ResumeType from '@/types/resume';
import PostType from '@/types/post';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ApplicationModal({
  modal,
  openModal,
  closeModal,
  post,
}: {
  modal: string | undefined;
  openModal: (id: string) => void;
  closeModal: () => void;
  post: PostType;
}): React.ReactElement {
  const t = useTranslations();
  const dispatch = useAppDispatch();

  const [{ resumes, dialog, selectedResumeIndex, file }, setApplicationModal] =
    useState({
      resumes: undefined as ResumeType[] | undefined,
      dialog: undefined as 'resume-selection' | 'resume-creation' | undefined,
      selectedResumeIndex: undefined as number | undefined,
      file: undefined as File | undefined,
    });

  useEffect(() => {
    (async () => {
      const _resumes = await resumeService.getResumesByAuth();
      setApplicationModal((prev) => ({ ...prev, resumes: _resumes }));
    })();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) =>
    setApplicationModal((prev) => ({
      ...prev,
      file: e.target.files?.[0],
    }));

  const handleFileUpload = () => {
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
        const resume = await resumeService.createResume(formData);
        setApplicationModal((prev) => ({
          ...prev,
          resumes: [...prev.resumes!, resume],
          selectedResumeIndex: prev.resumes!.length + 1,
          file: undefined,
        }));
        toast.success(t('toast.applyCV.uploadCVSucess'));
      } catch (err) {
        openModal('application-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleApplicationSubmit = () => {
    if (selectedResumeIndex === undefined) {
      toast.error(t('toast.applyCV.noCVSelected'));
      return;
    }

    const formData = new FormData();
    formData.append('postId', post.id);
    formData.append('resumeId', resumes![selectedResumeIndex].id);

    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        await applicationService.createApplication(formData);
        toast.success(t('toast.applyCV.applied'));
      } catch (err) {
        openModal('application-modal');
        toast.error('An error occurred.');
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleViewClick = (resumeId: string) => {
    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const pdfBlob = await resumeService.getResumeFile(resumeId);
        const pdfBlobURL = URL.createObjectURL(pdfBlob);
        window.open(pdfBlobURL);
      } catch (err) {
        openModal('application-modal');
        toast.error((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const resumeElms = resumes?.map((resume, i) => (
    <TableRow key={resume.id}>
      <TableCell>{i + 1}</TableCell>
      <TableCell>{resume.createdAt}</TableCell>
      <TableCell className="flex items-center gap-2">
        <Button
          size="lg"
          color="cyan"
          onClick={() => handleViewClick(resume.id)}
        >
          {t('postDetails.modal.applyJob.button.viewCV')}
        </Button>
        <Button
          size="lg"
          color="emerald"
          onClick={() =>
            setApplicationModal((prev) => ({
              ...prev,
              selectedResumeIndex: i,
              dialog: undefined,
            }))
          }
        >
          {t('postDetails.modal.applyJob.button.choseCV')}
        </Button>
      </TableCell>
    </TableRow>
  ));

  return (
    <Modal show={modal === 'application-modal'} onClose={closeModal}>
      <Modal.Header className="text-xl text-white bg-white">
        {t('postDetails.modal.applyJob.title')}
      </Modal.Header>
      <Modal.Body className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="font-semibold">
              {t('postDetails.modal.applyJob.selectCV.selected')}
            </div>
            <div className="flex gap-2">
              <Button
                size="lg"
                color="slate"
                onClick={() =>
                  setApplicationModal((prev) => ({
                    ...prev,
                    dialog: 'resume-selection',
                  }))
                }
              >
                {t('postDetails.modal.applyJob.button.choseAvaiableCV')}
              </Button>
            </div>
          </div>
          <div>
            {selectedResumeIndex !== undefined
              ? t('postDetails.modal.applyJob.selectCV.isSelected', {
                  index: selectedResumeIndex + 1,
                })
              : t('postDetails.modal.applyJob.selectCV.isNotSelected')}
          </div>
        </div>
        {dialog === 'resume-selection' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                {t('postDetails.modal.applyJob.selectCV.choseYourCV')}
              </div>
              <Button
                size="lg"
                onClick={() =>
                  setApplicationModal((prev) => ({
                    ...prev,
                    dialog:
                      prev.dialog !== 'resume-creation'
                        ? 'resume-creation'
                        : undefined,
                  }))
                }
              >
                {t('postDetails.modal.applyJob.button.createCV')}
              </Button>
            </div>
            <Table className="table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/6">No.</TableHead>
                  <TableHead>
                    {t('postDetails.modal.applyJob.table.createdAt')}
                  </TableHead>
                  <TableHead>
                    {t('postDetails.modal.applyJob.table.action')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{resumeElms}</TableBody>
            </Table>
          </div>
        )}
        {dialog === 'resume-creation' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                {t('postDetails.modal.applyJob.selectCV.createCV.title')}
              </div>
              <Button size="lg" onClick={handleFileUpload}>
                {t('postDetails.modal.applyJob.button.createCV')}
              </Button>
            </div>
            <div className="space-y-5">
              <Input
                className="outline-emerald-500"
                onChange={handleFileSelect}
              />
              <div className="text-sm text-slate-500">
                {t('postDetails.modal.applyJob.selectCV.createCV.requirements')}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <div className="flex ml-auto gap-x-3">
          <Button onClick={handleApplicationSubmit}>
            {t('postDetails.modal.applyJob.button.submit')}
          </Button>
          <Button color="red" onClick={closeModal}>
            {t('postDetails.modal.applyJob.button.cancel')}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
