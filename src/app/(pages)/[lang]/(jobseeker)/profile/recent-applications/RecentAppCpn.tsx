'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { setLoading } from '@/features/loading/loadingSlice';
import usePagination from '@/hooks/usePagination';
import useModal from '@/hooks/useModal';
import BusinessType from '@/types/business';
import resumeService from '@/services/resumeService';
import applicationService from '@/services/applicationService';
import businessService from '@/services/businessService';
import jobSeekerService from '@/services/jobSeekerService';

import { Link } from '@/navigation';
import { Calendar, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Modal from '@/components/modal/Modal';
import Pagination from '@/components/Pagination';
import Selection from '@/components/select/Selection';

import ErrorType from '@/types/error';
import ApplicationType from '@/types/application';
import { useAppDispatch } from '@/hooks/useRedux';
import PaginationType from '@/types/pagination';

interface RecentAppCpn {
  _applications: PaginationType<ApplicationType>;
}

export default function RecentAppCpn({ _applications }: RecentAppCpn) {
  const [business, setBusiness] = useState<BusinessType>();
  const t = useTranslations();
  const { data: session } = useSession();
  const jobSeekerId = session?.user.id;
  const dispatch = useAppDispatch();

  const { pagination, setPagination } =
    usePagination<ApplicationType>(_applications);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>();
  const selectedApplication = pagination.data.find(
    (application) => application.id === selectedApplicationId
  );
  const { modal, openModal, closeModal } = useModal();

  const handleDetailsClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    openModal('details-modal');
  };

  const handleViewCVClick = (resumeId: string) => {
    void (async () => {
      closeModal();
      dispatch(setLoading(true));

      try {
        const resumeBlob = await resumeService.getResumeFile(resumeId);
        const resumeBlobURL = URL.createObjectURL(resumeBlob);
        window.open(resumeBlobURL);
      } catch (err) {
        toast.error((err as ErrorType).message);
      } finally {
        openModal('details-modal');
        dispatch(setLoading(false));
      }
    })();
  };

  const handlePageChange = (page: number) => {
    void (async () => {
      dispatch(setLoading(true));

      try {
        const pagination = await applicationService.getApplications({
          page,
          jobSeekerId,
          accessToken: session!!.accessToken,
        });
        setPagination(pagination);
      } catch (err) {
        console.log((err as ErrorType).message);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  };

  const handleDetailsModalClose = () => {
    closeModal();
  };

  const applicationElms = pagination.data.map((application) => (
    <Application
      key={application.id}
      application={application}
      onDetailsClick={() => handleDetailsClick(application.id)}
    />
  ));

  useEffect(() => {
    void (async () => {
      if (selectedApplication?.post.business.id) {
        const data = await businessService.getBusinessById(
          selectedApplication?.post.business.id
        );
        setBusiness(data);
      }
    })();
  }, [selectedApplication?.post.business.id]);

  return (
    <>
      <main className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            {t('recentApplications.header.title')}
          </h2>
          <div className="font-semibold text-slate-500">
            {t('recentApplications.header.subTitle')}
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="font-semibold">
              {t('recentApplications.filter.applied')}:{' '}
              <span className="underline text-emerald-500">
                {t('recentApplications.filter.totalApplied', {
                  total: pagination.totalElements,
                })}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="font-semibold" htmlFor="sortBy">
                {t('recentApplications.filter.sort.title')}:
              </label>
              <Selection
                id="sortBy"
                name="sortBy"
                className="w-40"
                options={[
                  {
                    id: 1,
                    name: t('recentApplications.filter.sort.mostRecentUpdate'),
                  },
                  {
                    id: 2,
                    name: t(
                      'recentApplications.filter.sort.mostNeededRecruitment'
                    ),
                  },
                  {
                    id: 3,
                    name: t('recentApplications.filter.sort.topSalary'),
                  },
                ]}
              />
            </div>
          </div>
          <div className="grid gap-6 mt-5 lg:grid-cols-2">
            {applicationElms}
          </div>
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </main>

      {selectedApplication && (
        <Modal
          id="details-modal"
          show={modal === 'details-modal'}
          size="3xl"
          onClose={handleDetailsModalClose}
        >
          <Modal.Header>
            {t('recentApplications.post.detailModal.title')}
          </Modal.Header>
          <Modal.Body>
            <div>
              <div className="space-y-6">
                <DetailsFrame
                  title={t(
                    'recentApplications.post.detailModal.personInfo.title'
                  )}
                >
                  <div className="lg:w-[130px] lg:h-[172px] w-[80px] h-[120px]">
                    <img
                      src={
                        selectedApplication.jobSeeker.profileImageId
                          ? jobSeekerService.getJobSeekerProfileImage(
                              selectedApplication.jobSeeker.id
                            )
                          : 'https://www.w3schools.com/howto/img_avatar2.png'
                      }
                      alt=""
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>

                  <div className="grid items-baseline grid-cols-2 grow gap-x-2">
                    <div className="space-y-4">
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.name'
                          ) + ':'
                        }
                      >
                        {selectedApplication.jobSeeker.name}
                      </DetailsSection>
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.gender'
                          ) + ':'
                        }
                      >
                        {selectedApplication.jobSeeker.gender || 'Không có'}
                      </DetailsSection>
                      <DetailsSection title="CV Link:">
                        <div
                          className="flex items-center justify-center rounded cursor-pointer w-28 gap-x-2 bg-slate-200 hover:bg-slate-300"
                          onClick={() =>
                            handleViewCVClick(selectedApplication.resumeId)
                          }
                        >
                          <File className="text-emerald-500" />
                          Xem CV
                        </div>
                      </DetailsSection>
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.BirthDate'
                          ) + ':'
                        }
                      >
                        {selectedApplication.jobSeeker.dateOfBirth ||
                          'Không có'}
                      </DetailsSection>
                    </div>
                    <div className="space-y-4">
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.postName'
                          ) + ':'
                        }
                      >
                        <Link
                          href={`/posts/${selectedApplication.post.id}`}
                          className="hover:text-emerald-500 hover:underline"
                        >
                          {selectedApplication.post.title}
                        </Link>
                      </DetailsSection>
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.createdAt'
                          ) + ':'
                        }
                      >
                        {selectedApplication.createdAt}
                      </DetailsSection>
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.position'
                          ) + ':'
                        }
                      >
                        {selectedApplication.post.level.name.toString() ||
                          'Không có'}
                      </DetailsSection>
                      <DetailsSection
                        title={
                          t(
                            'recentApplications.post.detailModal.personInfo.statusApp'
                          ) + ':'
                        }
                      >
                        <Badge className="w-min" color="success">
                          {selectedApplication.applicationStatus}
                        </Badge>
                      </DetailsSection>
                    </div>
                  </div>
                </DetailsFrame>

                <DetailsFrame
                  title={t(
                    'recentApplications.post.detailModal.recruiterInfo.title'
                  )}
                >
                  <div className="flex items-center gap-10">
                    <img
                      src={
                        selectedApplication.post.business.profileImageId &&
                        businessService.getBusinessProfileImage(
                          selectedApplication.post.business.id
                        )
                      }
                      className="object-cover w-20 h-20 rounded"
                    />
                    <div className="flex flex-col gap-y-2">
                      <Link
                        href={`/businesses/${selectedApplication.post.business.id}`}
                        className="text-lg font-semibold hover:text-emerald-500"
                      >
                        {selectedApplication.post.business.name}
                      </Link>
                      <div className="flex gap-4">
                        <div className="font-semibold">
                          {t(
                            'recentApplications.post.detailModal.recruiterInfo.industry'
                          )}
                          :
                        </div>
                        <div>{business?.type}</div>
                      </div>
                      <div className="flex gap-4">
                        <div className="font-semibold">Website:</div>
                        <div>
                          {business?.website && (
                            <Link
                              href={business?.website}
                              className="hover:text-emerald-500 hover:underline"
                            >
                              {business?.website}
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </DetailsFrame>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex items-center ml-auto gap-x-2">
              <Button color="red" onClick={handleDetailsModalClose}>
                Đóng
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}

type ViewMode = 'Admin' | 'Jobseeker';

export const Application = ({
  application,
  onDetailsClick,
  type = 'Jobseeker',
}: {
  application: ApplicationType;
  onDetailsClick?: () => void;
  type?: ViewMode;
}) => {
  const t = useTranslations();
  return (
    <>
      <div
        className={`w-full h-fit flex flex-col gap-3 ${
          type === 'Admin' ? 'bg-slate-200' : 'bg-slate-100'
        } p-6 rounded-md`}
      >
        <div className="flex justify-between">
          <div>
            <Link
              href={`../../posts/${application.post?.id}`}
              className="text-lg font-bold hover:text-emerald-500 hover:underline"
            >
              {application.post.title.length > 32
                ? `${application.post.title.slice(0, 32)}...`
                : application.post.title}
            </Link>
            <div className="flex items-center gap-4">
              <p>
                {application.post.minSalaryString} -{' '}
                {application.post.maxSalaryString} triệu
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold">
              {t('recentApplications.post.status')}:
            </p>
            <div className="px-2 text-sm text-white rounded-lg bg-emerald-400">
              {application.applicationStatus}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-3">
          <img
            src={
              application.post.business.profileImageId
                ? businessService.getBusinessProfileImage(
                    application.post.business.id
                  )
                : '/business.png'
            }
            className="object-cover w-12 h-12 rounded"
          />

          <Link
            href={`/businesses/${application.post.business.id}`}
            className="font-semibold hover:text-emerald-500"
          >
            {application.post.business?.name}
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>
              <Calendar className="text-emerald-500" />
            </span>
            <p className="text-sm">
              {t('recentApplications.post.applicationDate')}:{' '}
              {application.createdAt}
            </p>
          </div>
          {type === 'Jobseeker' && (
            <div className="flex items-center gap-2 ">
              <Button size="sm" onClick={onDetailsClick}>
                {t('recentApplications.post.button.detail')}
              </Button>
              {application.applicationStatus === 'Submitted' && (
                <Button variant="red" size="sm">
                  {t('recentApplications.post.button.cancel')}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

function DetailsFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold text-emerald-500">{title}</h1>
      <div className="flex gap-10">{children}</div>
    </div>
  );
}

function DetailsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="space-y-1">
      <div className="font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}
