'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import { toast } from 'sonner';
import { setLoading } from '@/features/loading/loadingSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import useModal from '@/hooks/useModal';

import ColumnsType, { DataField } from '@/components/ColumnsType';
import Checkbox from '@/components/input/Checkbox';
import Table from '@/components/table/Table';
import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/button';

import recruiterService from '@/services/recruiterService';

import PaginationType from '@/types/pagination';
import RecruiterType from '@/types/recruiter';

type RecruiterCriteria = {
  email: string;
  name: string;
  phone: string;
  business: string;
  sortBy: string[];
};

export default function ADRecruiterManagement() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [dataSource, setDataSource] = useState<PaginationType<RecruiterType>>(
    undefined!
  );

  const [params, setParams] = useState<RecruiterCriteria>({
    email: '',
    name: '',
    phone: '',
    business: '',
    sortBy: [],
  });

  useEffect(() => {
    (async () => {
      const _pagination = await recruiterService.getRecruiters({
        accessToken: session!!.accessToken,
      });
      setDataSource(_pagination);
    })();
  }, []);

  const resetParams = () => {
    handleFindRecruiter({
      email: '',
      name: '',
      phone: '',
      business: '',
      sortBy: [],
    });
  };

  const handleFindRecruiter = (param: RecruiterCriteria) => {
    void (async () => {
      setParams(param);
      dispatch(setLoading(true));
      const data = await recruiterService.getRecruiters({
        ...param,
        accessToken: session!!.accessToken,
      });
      dispatch(setLoading(false));
      setDataSource(data);
    })();
  };

  const [recruiterTarget, setRecruiterTarget] = useState<RecruiterType>();
  const { modal, openModal, closeModal } = useModal();

  const handleChangeRecruiterDelete = (recruiter: RecruiterType) => {
    setRecruiterTarget(recruiter);
    openModal('delete-account-recruiter-table');
  };
  const deleteRecruiter = (): void => {
    closeModal();
    if (!recruiterTarget?.id) {
      toast.error('Không có người dùng nào được chọn');
    } else {
      dispatch(setLoading(true));
      if (!recruiterTarget.locked)
        serviceProcess(
          recruiterService.deleteRecruiterById(
            recruiterTarget?.id,
            session?.accessToken!
          ),
          'Đã khóa người dùng',
          'Không thể khóa người dùng'
        );
      else
        serviceProcess(
          recruiterService.openDeleteRecruiterById(
            recruiterTarget?.id,
            session?.accessToken!
          ),
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
        handleFindRecruiter(params);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
      });
  }

  const columns: ColumnsType<RecruiterType>[] = [
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
      title: 'SĐT',
      dataIndex: new DataField(['phone']),
      filterKey: 'phone',
      filter: [],
      width: 100,
    },
    {
      title: 'Công ty',
      dataIndex: new DataField(['business', 'name']),
      filterKey: 'business',
      filter: [],
      width: 250,
    },
    {
      title: 'Trạng thái',
      filterKey: 'locked',
      width: 120,
      dataIndex: new DataField(['locked']),
      align: 'center',
      render: (row) => (
        <Checkbox
          onChange={() => {
            handleChangeRecruiterDelete(row);
          }}
          checked={row.locked}
        />
      ),
    },
    {
      title: 'Action',
      filterKey: 'action',
      dataIndex: new DataField([]),
      align: 'center',
      width: 200,
      render: (row) => (
        <div
          className="flex justify-center gap-4"
          onClick={() => {
            window.open(`/admin/recruiters/${row.id}`);
          }}
        >
          <div className="px-2 italic font-semibold text-emerald-600 rounded cursor-pointer bg-button-admin-details">
            Chi tiết
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="p-4 py-4 h-[620px]">
      <h2 className="text-[20px] font-semibold mb-5">
        Danh sách nhà tuyển dụng
      </h2>
      <div className="overflow-auto">
        <Table
          name="recruiters"
          dataSource={dataSource.data}
          page={dataSource.currentPage}
          totalPage={dataSource.totalPages}
          columns={columns}
          params={params}
          setFilter={handleFindRecruiter}
          resetFilter={resetParams}
        />
      </div>

      <Modal
        id="delete-account-recruiter-table"
        show={modal === 'delete-account-recruiter-table'}
        size="md"
        popup
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn {recruiterTarget?.locked ? 'mở khóa' : 'khóa'}{' '}
              tài khoản {recruiterTarget?.name} không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteRecruiter}>
                Tôi chắc chắn
              </Button>
              <Button
                color="gray"
                onClick={() => {
                  closeModal();
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
}
