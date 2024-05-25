'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/navigation';
import { useSession } from 'next-auth/react';
import usePagination from '@/hooks/usePagination';
import useModal from '@/hooks/useModal';
import applicationService from '@/services/applicationService';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import InputWithLabel from '@/components/input/InputWithLabel';
import { FaSearch } from 'react-icons/fa';
import Tabs from '@/components/Tabs';
import EmptyTableRow from '@/components/table/EmptyTableRow';
import Pagination from '@/components/Pagination';
import Modal from '@/components/modal/Modal';

import jobSeekerService from '@/services/jobSeekerService';
import { cn } from '@/lib/utils';

import ApplicationType, { ApplicationStatus } from '@/types/application';
import ErrorType from '@/types/error';

export default function ApplicantManagement(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();
  const { modal, openModal, closeModal } = useModal();

  const { pagination, setPagination } = usePagination<ApplicationType>(
    undefined!
  );
  const [criteria, setCriteria] = useState({
    applicationStatuses: undefined as Array<ApplicationStatus> | undefined,
    fromDate: '',
    toDate: '',
  });

  const [selectedApplicationId, setSelectedApplicationId] = useState('');
  const selectedApplication = pagination.data.find(
    (application) => application.id === selectedApplicationId
  );

  useEffect(() => {
    (async () => {
      const _pagination = await applicationService.getApplicationsByRecruiterId(
        { accessToken: session?.accessToken! }
      );
      setPagination(_pagination);
    })();
  }, [session?.accessToken, setPagination]);

  const handleCriteriaChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCriteria((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const handleSearchClick = () => {
    void (async () => {
      try {
        const pagination =
          await applicationService.getApplicationsByRecruiterId({
            ...criteria,
            accessToken: session?.accessToken!,
          });
        setPagination(pagination);
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  const handleTabClick = (applicationStatuses?: Array<ApplicationStatus>) => {
    void (async () => {
      try {
        const pagination =
          await applicationService.getApplicationsByRecruiterId({
            applicationStatuses,
            accessToken: session?.accessToken!,
          });
        setPagination(pagination);
        setCriteria({
          applicationStatuses,
          fromDate: '',
          toDate: '',
        });
      } catch (err) {
        console.error((err as ErrorType).message);
      }
    })();
  };

  const handleDetailsClick = (applicationId: string) => {
    setSelectedApplicationId(applicationId);
    openModal('info-view-modal');
  };

  const handleApplicationStatusUpdate = (
    applicationId: string,
    applicationStatus: ApplicationStatus
  ) => {
    void (async () => {
      try {
        await applicationService.updateApplicationStatus(
          applicationId,
          applicationStatus
        );
        const _pagination =
          await applicationService.getApplicationsByRecruiterId({
            page: pagination.currentPage,
            ...criteria,
            accessToken: session?.accessToken!,
          });
        setPagination(_pagination);
        toast.success('Cập nhật trạng thái thành công.');
      } catch (err) {
        toast.error((err as ErrorType).message);
      }
    })();
  };

  const handlePageChange = (page: number) => {
    void (async () => {
      try {
        const pagination =
          await applicationService.getApplicationsByRecruiterId({
            page,
            ...criteria,
            accessToken: session?.accessToken!,
          });
        setPagination(pagination);
      } catch (err) {
        console.error((err as ErrorType).message);
      }
    })();
  };

  const applicationElms = pagination.data.map((application) => (
    <TableRow
      key={application.id}
      className="bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <TableCell className="font-medium text-gray-900 truncate w-80 whitespace-nowrap dark:text-white">
        {application.post?.title}
      </TableCell>
      <TableCell>{application.jobSeeker.name}</TableCell>
      <TableCell>{application.createdAt}</TableCell>
      <TableCell>
        <span
          className={cn('px-2 text-white rounded-lg', {
            'bg-cyan-500': application.applicationStatus === 'Submitted',
            'bg-yellow-500': application.applicationStatus === 'Reviewed',
            'bg-red-500': application.applicationStatus === 'Rejected',
            'bg-emerald-500': application.applicationStatus === 'Hired',
          })}
        >
          {application.applicationStatus}
        </span>
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <Button
          size="lg"
          color="cyan"
          onClick={() => handleDetailsClick(application.id)}
        >
          Chi tiết
        </Button>
        {['Submitted', 'Reviewed'].includes(application.applicationStatus) && (
          <>
            <Button
              size="lg"
              color="emerald"
              onClick={() =>
                handleApplicationStatusUpdate(application.id, 'Hired')
              }
            >
              Phê duyệt
            </Button>
            <Button
              size="lg"
              color="rose"
              onClick={() =>
                handleApplicationStatusUpdate(application.id, 'Rejected')
              }
            >
              Từ chối
            </Button>
          </>
        )}
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <main className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-bold">Quản lý ứng tuyển</h2>
            <Button>Đăng bài tuyển dụng</Button>
          </div>
          <div className="font-semibold text-slate-500">
            Kiểm soát các người ứng tuyển.
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 lg:flex-row lg:gap-0">
          <div className="flex lg:flex-row flex-col items-center lg:gap-4 lg:w-[600px] w-full">
            <InputWithLabel
              id="fromDate"
              name="fromDate"
              label="Từ ngày:"
              type="date"
              color="emerald"
              value={criteria.fromDate}
              onChange={handleCriteriaChange}
            />
            <InputWithLabel
              id="toDate"
              name="toDate"
              label="Đến ngày:"
              type="date"
              color="emerald"
              value={criteria.toDate}
              onChange={handleCriteriaChange}
            />
          </div>
          <div className="mt-6 ml-auto">
            <Button onClick={handleSearchClick}>
              <FaSearch className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        <Tabs>
          <Tabs.Item
            title="Ứng viên đang chở xử lí"
            onTabClick={() => handleTabClick(['Submitted', 'Reviewed'])}
          />
          <Tabs.Item
            title="Ứng viên đã phê duyệt"
            onTabClick={() => handleTabClick(['Hired'])}
          />
          <Tabs.Item
            title="Ứng viên đã từ chối"
            onTabClick={() => handleTabClick(['Rejected'])}
          />
          <Tabs.Item
            title="Tất cả ứng viên"
            onTabClick={() => handleTabClick()}
          />
        </Tabs>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Công việc ứng tuyển</TableHead>
              <TableHead>Tên ứng viên</TableHead>
              <TableHead>Ngày nộp</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y">
            {applicationElms.length ? applicationElms : <EmptyTableRow />}
          </TableBody>
        </Table>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </main>

      {selectedApplication && (
        <Modal
          id="info-view-modal"
          show={modal === 'info-view-modal'}
          size="3xl"
          onClose={closeModal}
        >
          <Modal.Header>Chi tiết ứng viên</Modal.Header>
          <Modal.Body className="space-y-5">
            <div className="flex gap-20">
              <div className="w-40 h-40 translate-y-1/4">
                <img
                  src={jobSeekerService.getJobSeekerProfileImage(
                    selectedApplication.jobSeeker.id
                  )}
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 grow">
                <div className="col-span-1 space-y-4">
                  <ModalInfo title="Họ và tên:">
                    {selectedApplication.jobSeeker.name}
                  </ModalInfo>
                  <ModalInfo title="Giới tính:">
                    {selectedApplication.jobSeeker.gender || 'Không có'}
                  </ModalInfo>
                  <ModalInfo title="CV Link:">
                    <div
                      className="px-3 text-center rounded cursor-pointer bg-slate-200 hover:bg-slate-300"
                      onClick={() =>
                        router.push(
                          `../view-resume/${selectedApplication.resumeId}`
                        )
                      }
                    >
                      Xem CV
                    </div>
                  </ModalInfo>
                  <ModalInfo title="Ngày sinh:">
                    {selectedApplication.jobSeeker.dateOfBirth || 'Không có'}
                  </ModalInfo>
                </div>
                <div className="space-y-4">
                  <ModalInfo title="Tên công việc:">
                    {selectedApplication.post.title}
                  </ModalInfo>
                  <ModalInfo title="Ngày ứng tuyển:">
                    {selectedApplication.createdAt}
                  </ModalInfo>
                  <ModalInfo title="Trạng thái:">
                    <span
                      className={cn('px-2 text-white rounded-lg', {
                        'bg-cyan-500':
                          selectedApplication.applicationStatus === 'Submitted',
                        'bg-yellow-500':
                          selectedApplication.applicationStatus === 'Reviewed',
                        'bg-red-500':
                          selectedApplication.applicationStatus === 'Rejected',
                        'bg-emerald-500':
                          selectedApplication.applicationStatus === 'Hired',
                      })}
                    >
                      {selectedApplication.applicationStatus}
                    </span>
                  </ModalInfo>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                color="emerald"
                onClick={() =>
                  handleApplicationStatusUpdate(selectedApplication.id, 'Hired')
                }
              >
                Phê duyệt
              </Button>
              <Button
                color="rose"
                onClick={() =>
                  handleApplicationStatusUpdate(
                    selectedApplication.id,
                    'Rejected'
                  )
                }
              >
                Hủy
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}

function ModalInfo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="font-semibold">{title}</div>
      <div>{children}</div>
    </div>
  );
}
