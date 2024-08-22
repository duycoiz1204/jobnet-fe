'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch } from '@/hooks/useRedux';
import PaginationType from '@/types/pagination';
import PostType, { PostActiveStatus } from '@/types/post';
import ColumnsType, { DataField } from '../ColumnsType';
import { setLoading } from '@/features/loading/loadingSlice';
import postService from '@/services/postService';
import useModal from '@/hooks/useModal';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { CheckboxItem } from './TableHeader';
import { FaFilter } from 'react-icons/fa6';
import Table from '../table/Table';
import Modal from '../modal/Modal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';

type PostCriteria = {
  search: string;
  recruiterName: string;
  businessName: string;
  location: string[];
  professionId: string;
  categoryId: string;
  workingFormat: string;
  salaryRange: string;
  sortBy: string[];
  isExpired?: string;
  activeStatus?: string;
};

type DefaultPostPage = {
  isExpired?: string;
  activeStatus?: string;
  loaderData: PaginationType<PostType>;
  col: Record<string, boolean>;
  status: PostActiveStatus | undefined;
};

function ADPostTable({ loaderData, col, status, ...props }: DefaultPostPage) {
  const dispatch = useAppDispatch();

  const [isFieldsOpen, setOpenField] = useState(false);
  const [fields, setFields] = useState<Record<string, boolean>>(col);
  const [columns, setColumns] = useState<ColumnsType<PostType>[]>([]);
  const session = useSession()
  useEffect(() => {
    setFields(col);
    setColumn(col);
  }, [col]);

  const setField = (key: string) => {
    const newFields = { ...fields, [key]: !fields[key] };
    setFields(newFields);
    setColumn(newFields);
  };

  const setColumn = (items: Record<string, boolean>) => {
    const columnsTemp: ColumnsType<PostType>[] = [];
    for (const key of Object.keys(items)) {
      const fieldTemp: ColumnsType<PostType> | undefined = columnsDefault.find(
        (e) => e.filterKey === key
      );
      if (items[key] && fieldTemp) {
        columnsTemp.push(fieldTemp);
      }
    }
    if (columnsTemp.length === 0) {
      setColumns(columnsDefault);
    } else {
      setColumns(columnsTemp);
    }
  };

  const [dataSource, setDataSource] = useState(loaderData);
  useEffect(() => {
    setDataSource(loaderData);
  }, [loaderData]);

  const [params, setParams] = useState<PostCriteria>({
    search: '',
    recruiterName: '',
    businessName: '',
    location: [],
    professionId: '',
    categoryId: '',
    workingFormat: '',
    salaryRange: '',
    sortBy: [],
    ...props,
  });
  const handleFindJobs = (newParam: PostCriteria) => {
    void (async () => {
      const paramMergeWithDefault: PostCriteria = { ...newParam, ...props };
      setParams(paramMergeWithDefault);
      dispatch(setLoading(true));
      const data = await postService.getPosts(paramMergeWithDefault);
      dispatch(setLoading(false));
      setDataSource(data);
    })();
  };
  const resetParams = () => {
    const initParams = {
      search: '',
      recruiterName: '',
      businessName: '',
      location: [],
      professionId: '',
      categoryId: '',
      workingFormat: '',
      salaryRange: '',
      sortBy: [],
    };
    setParams(initParams);
    handleFindJobs(initParams);
  };

  const [postTarget, setPostTarget] = useState<PostType>();
  const { modal, openModal, closeModal } = useModal();

  const handleApprovalPost = (post: PostType) => {
    setPostTarget(post);
    openModal('approval-post-table');
  };

  const approvalPost = (status: boolean): void => {
    closeModal();
    if (!postTarget) {
      toast.error('Không có bài đăng nào được chọn');
    } else {
      dispatch(setLoading(true));

      serviceProcess(
        postService.updatePostStatus(
          postTarget?.id,
          status ? 'Opening' : 'Rejected',
          session.data?.accessToken!!
        ),
        'Đã cập nhật bài đăng',
        'Không thể cập nhật bài đăng'
      );
      dispatch(setLoading(false));
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
        handleFindJobs(params);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
      });
  }

  const columnsDefault: ColumnsType<PostType>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: new DataField(['title']),
      truncate: 28,
      filterKey: 'search',
      filter: [],
      width: 250,
    },
    {
      title: 'Người đăng',
      dataIndex: new DataField(['recruiter', 'name']),
      filter: [],
      filterKey: 'recruiterName',
      width: 250,
      render: (record: PostType) => (
        <span className="">{record.recruiterId}</span> // Need to change to name
      ),
    },
    {
      title: 'Công ty',
      dataIndex: new DataField(['business', 'name']),
      truncate: 30,
      filterKey: 'businessName',
      filter: [],
      width: 250,
    },
    {
      title: 'Lượt xem',
      dataIndex: new DataField(['totalViews']),
      align: 'center',
      filterKey: 'totalViews',
      sort: true,
      width: 150,
    },
    {
      title: 'Lương',
      dataIndex: new DataField(['salaryRange']),
      align: 'center',
      sort: true,
      render: (record: PostType) => {
        const salary = `${record.minSalaryString} - ${record.maxSalaryString}`;
        return <p>{salary}</p>;
      },
      filterKey: 'salary',
      width: 250,
    },
    {
      title: 'Deadline',
      dataIndex: new DataField(['applicationDeadline']),
      sort: true,
      filterKey: 'applicationDeadline',
      width: 150,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: new DataField(['activeStatus']),
      filterKey: 'activeStatus',
      filter: [
        { value: 'Pending', text: 'Pending' },
        { value: 'Opening', text: 'Opening' },
        { value: 'Stopped', text: 'Stopped' },
        { value: 'Closed', text: 'Closed' },
        { value: 'Blocked', text: 'Blocked' },
        { value: 'Rejected', text: 'Rejected' },
      ],
      align: 'center',
      width: 150,
      render: (row) => {
        const { activeStatus } = row;
        const statusInfo = statusMappings[activeStatus];

        if (!statusInfo) return null;

        const { color, text } = statusInfo;
        return (
          <Badge className="px-4 text-sm" color={color}>
            {text}
          </Badge>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: new DataField([]),
      filterKey: 'action',
      align: 'center',
      width: 250,
      render: (row) => (
        <div className="flex justify-center gap-2 text-md">
          {row.activeStatus === 'Pending' && (
            <div
              className="px-2 italic font-semibold text-yellow-600 transition-all rounded cursor-pointer bg-button-admin-approved"
              onClick={() => {
                handleApprovalPost(row);
              }}
            >
              Xét duyệt
            </div>
          )}
          <div
            className="px-2 italic font-semibold transition-all rounded cursor-pointer text-emerald-600 bg-button-admin-details"
            onClick={() => {
              window.open(`/admin/posts/${row.id}`);
            }}
          >
            Chi tiết
          </div>
        </div>
      ),
    },
  ];

  const fieldsCheckBoxElms = Object.keys(fields).map((key) => (
    <CheckboxItem
      key={`field-${key}`}
      id={`field-${key}`}
      label={columnsDefault.find((e) => e.filterKey === key)?.title || ''}
      defaultChecked={fields[key]}
      className="w-[100%]"
      onChange={() => {
        setField(key);
      }}
    />
  ));

  return (
    <main className="h-full py-4 lg:p-4">
      <h2 className="p-0 m-0 font-semibold">Quản lí bài đăng</h2>
      {status === undefined && (
        <span className="font-semibold text-slate-400">Tất cả bài đăng</span>
      )}
      {status === 'Pending' && (
        <span className="font-semibold text-slate-400">Bài đăng chờ duyệt</span>
      )}
      {status === 'Opening' && (
        <span className="font-semibold text-slate-400">Bài đăng đang chạy</span>
      )}
      {status === 'Closed' && (
        <span className="font-semibold text-slate-400">
          Bài đăng đã hết hạn
        </span>
      )}
      {status === 'Blocked' && (
        <span className="font-semibold text-slate-400">Bài đăng đã khóa</span>
      )}
      <div className="flex items-center float-right mt-4 mb-2 gap-x-2">
        <span className="text-sm font-semibold">Cột hiển thị:</span>
        <div className="pb-0 w-[20px] relative mb-0 ml-[auto]">
          <FaFilter
            onClick={() => {
              setOpenField((pre) => !pre);
            }}
            className="pb-0 relative mb-0 ml-[auto] text-[18px] text-gray-700 hover:text-gray-400 cursor-pointer"
          />
          {isFieldsOpen && (
            <div
              className={`absolute right-[100%] top-[50%] min-w-[150px] py-[7px] border  border-emerald-500 pl-[5px] pr-[10px] z-50 bg-white rounded`}
            >
              {fieldsCheckBoxElms}
            </div>
          )}
        </div>
      </div>

      <Table
        name="posts"
        dataSource={dataSource.data}
        page={dataSource.currentPage}
        totalPage={dataSource.totalPages}
        columns={columns}
        params={params}
        resetFilter={resetParams}
        setFilter={handleFindJobs}
      />
      <Modal
        id="approval-post-table"
        show={modal === 'approval-post-table'}
        size="xl"
        popup
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn duyệt nhanh bài đăng{' '}
              <b className="text-emerald-500">{postTarget?.title}</b> không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="success"
                onClick={() => {
                  approvalPost(true);
                }}
              >
                Duyệt bài
              </Button>
              <Button
                color="failure"
                onClick={() => {
                  approvalPost(false);
                }}
              >
                Không duyệt
              </Button>
              <Button
                color="warning"
                onClick={() => {
                  closeModal();
                  if (postTarget) window.open(`/admin/posts/${postTarget.id}`);
                }}
              >
                Duyệt chi tiết
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

export default ADPostTable;

const statusMappings = {
  Pending: { color: 'warning', text: 'Pending' },
  Opening: { color: 'success', text: 'Opening' },
  Stopped: { color: 'failure', text: 'Stopped' },
  Closed: { color: 'pink', text: 'Closed' },
  Blocked: { color: 'dark', text: 'Blocked' },
  Rejected: { color: 'indigo', text: 'Rejected' },
};
