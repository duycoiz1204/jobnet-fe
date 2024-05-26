'use client';

import ColumnsType, { DataField } from '@/components/ColumnsType';
import Checkbox from '@/components/input/Checkbox';
import Modal from '@/components/modal/Modal';
import SelectWithLabel from '@/components/select/SelectWithLabel';
import Table from '@/components/table/Table';
import { Button } from '@/components/ui/button';
import { setLoading } from '@/features/loading/loadingSlice';
import useModal from '@/hooks/useModal';
import { useAppDispatch } from '@/hooks/useRedux';
import jobSeekerService from '@/services/jobSeekerService';
import JobSeekerType from '@/types/jobSeeker';
import PaginationType from '@/types/pagination';
import { useState, useEffect } from 'react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'sonner';

type JobSeekerCriteria = {
  email: string;
  name: string;
  phone: string;
  verificationStatus: string;
  accountType: string;
  sortBy: string[];
};

export default function ADJobseekerManagement() {
  const dispatch = useAppDispatch();

  const [dataSource, setDataSource] = useState<PaginationType<JobSeekerType>>(
    undefined!
  );

  const [params, setParams] = useState<JobSeekerCriteria>({
    email: '',
    name: '',
    phone: '',
    verificationStatus: '',
    accountType: '',
    sortBy: [],
  });

  useEffect(() => {
    (async () => {
      const _jobseekers = await jobSeekerService.getJobSeekers();
      setDataSource(_jobseekers);
    })();
  }, []);

  const resetParams = () => {
    handleFindJobSeeker({
      email: '',
      name: '',
      phone: '',
      verificationStatus: '',
      accountType: '',
      sortBy: [],
    });
  };

  const handleFindJobSeeker = (param: JobSeekerCriteria) => {
    void (async () => {
      setParams(params);
      dispatch(setLoading(true));
      const data = await jobSeekerService.getJobSeekers(param);
      dispatch(setLoading(false));
      setDataSource(data);
    })();
  };

  const [jobSeekerTarget, setJobseekerTarget] = useState<JobSeekerType>();
  const { modal, openModal, closeModal } = useModal();

  const handleChangeJobSeekerDelete = (jobSeeker: JobSeekerType) => {
    setJobseekerTarget(jobSeeker);
    openModal('delete-account-jobseeker-table');
  };
  const deleteJobseeker = (): void => {
    closeModal();
    if (!jobSeekerTarget?.id) {
      toast.error('Không có người dùng nào được chọn');
    } else {
      dispatch(setLoading(true));
      if (!jobSeekerTarget.locked)
        serviceProcess(
          jobSeekerService.deleteJobSeekerById(jobSeekerTarget?.id),
          'Đã khóa người dùng',
          'Không thể khóa người dùng'
        );
      else
        serviceProcess(
          jobSeekerService.openDeleteJobSeekerById(jobSeekerTarget?.id),
          'Đã mở khóa người dùng',
          'Không thể mở khóa người dùng'
        );
    }
  };

  function serviceProcess(
    prom: Promise<any>,
    success: string,
    fail: string
  ): void {
    closeModal();
    dispatch(setLoading(true));
    prom
      .then(() => {
        dispatch(setLoading(false));
        toast.success(success);
        handleFindJobSeeker(params);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
      });
  }

  const columns: ColumnsType<JobSeekerType>[] = [
    {
      title: 'Tên',
      dataIndex: new DataField(['name']),
      filterKey: 'name',
      filter: [],
      width: 250,
    },
    {
      title: 'Email',
      dataIndex: new DataField(['email']),
      filterKey: 'email',
      filter: [],
      width: 250,
    },
    {
      title: 'Trạng thái',
      dataIndex: new DataField(['verificationStatus']),
      filterKey: 'verificationStatus',
      width: 170,
      align: 'center',
      filter: [
        {
          text: 'Verified',
          value: 'Verified',
        },
        {
          text: 'Pending',
          value: 'Pending',
        },
        {
          text: 'Not Verified',
          value: 'NotVerified',
        },
        {
          text: 'Failed Verification',
          value: 'FailedVerification',
        },
        {
          text: 'Expired',
          value: 'Expired',
        },
      ],
      render: (row) => (
        <SelectWithLabel
          options={[
            { text: 'Verified', value: 'Verified' },
            { text: 'Pending', value: 'Pending' },
            { text: 'NotVerified', value: 'NotVerified' },
            { text: 'FailedVerification', value: 'FailedVerification' },
            { text: 'Expired', value: 'Expired' },
          ]}
          defaultValue={row.verificationStatus}
        />
      ),
    },
    {
      title: 'Loại',
      filterKey: 'accountType',
      align: 'center',
      width: 200,
      dataIndex: new DataField(['accountType']),
      filter: [
        {
          text: 'Free',
          value: 'Free',
        },
        {
          text: 'Premium',
          value: 'Premium',
        },
        {
          text: 'Trial',
          value: 'Trial',
        },
      ],
    },
    {
      title: 'isDeleted',
      filterKey: 'Deleted',
      width: 100,
      dataIndex: new DataField(['isDeleted']),
      align: 'center',
      render: (row) => (
        <Checkbox
          color="emerald"
          onChange={() => {
            handleChangeJobSeekerDelete(row);
          }}
          checked={row.locked}
        />
      ),
    },
    {
      title: 'Action',
      filterKey: 'action',
      dataIndex: new DataField([]),
      width: 120,
      render: (row) => (
        <div
          className="flex justify-center gap-4"
          onClick={() => window.open(`/admin/jobSeekers/${row.id}`)}
        >
          <div className="px-2 italic font-semibold text-emerald-600 rounded cursor-pointer bg-button-admin-details">
            Chi tiết
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="h-full p-3 py-4 overflow-y-auto">
      <h2 className="text-[20px] font-semibold mb-5">Danh sách Jobseeker</h2>
      <Table
        name="jobseekers"
        dataSource={dataSource.data}
        page={dataSource.currentPage}
        totalPage={dataSource.totalPages}
        columns={columns}
        params={params}
        setFilter={handleFindJobSeeker}
        resetFilter={resetParams}
      />

      <Modal
        id="delete-account-jobseeker-table"
        show={modal === 'delete-account-jobseeker-table'}
        size="md"
        popup
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn {jobSeekerTarget?.locked ? 'mở khóa' : 'khóa'}{' '}
              tài khoản {jobSeekerTarget?.name} không?
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
    </main>
  );
}
