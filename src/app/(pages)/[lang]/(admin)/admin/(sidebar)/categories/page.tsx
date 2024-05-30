'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import useModal from '@/hooks/useModal';
import { toast } from 'sonner';

import categoryService from '@/services/categoryService';

import CategoryType from '@/types/category';
import { setLoading } from '@/features/loading/loadingSlice';
import ColumnsType, { DataField } from '@/components/ColumnsType';
import { Button } from '@/components/ui/button';
import Table from '@/components/table/Table';
import Modal from '@/components/modal/Modal';
import InputWithLabel from '@/components/input/InputWithLabel';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function Categories() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const { modal, openModal, closeModal } = useModal();
  const [categoryTarget, setCategoryTarget] = useState<
    CategoryType | undefined
  >(undefined);
  const [updateData, setUpdateData] = useState<boolean>(true);

  const [params, setParams] = useState<{ [key: string]: string }>({
    search: '',
  });

  useEffect(() => {
    async function loadData(): Promise<void> {
      const categories: CategoryType[] = await categoryService.getCategories();
      setCategories(categories);
    }
    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [updateData]);

  const createCategory = (): void => {
    const name: HTMLElement | null = document.getElementById('newCategoryName');
    if (name instanceof HTMLInputElement) {
      serviceProcess(
        categoryService.createCategory(name.value, session?.accessToken!),
        'Tạo lĩnh vực thành công',
        'Tạo lĩnh vực không thành công'
      );
    }
  };
  const updateCategory = (): void => {
    const name: HTMLElement | null =
      document.getElementById('updateCategoryName');
    if (name instanceof HTMLInputElement) {
      const id = categoryTarget?.id;
      id &&
        serviceProcess(
          categoryService.updateCategory(id, name.value, session?.accessToken!),
          'Cập nhật lĩnh vực thành công',
          'Cập nhật lĩnh vực không thành công'
        );
    }
  };
  const deleteCategory = (): void => {
    const id: string = categoryTarget?.id.toString() || '';
    serviceProcess(
      categoryService.deleteCategoryById(id, session?.accessToken!),
      'Xóa lĩnh vực thành công',
      'Xóa lĩnh vực không thành công'
    );
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
        setUpdateData(!updateData);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
        setUpdateData(!updateData);
      });
  }

  const resetParams = () => {
    handleFindCate({ search: '' });
  };
  const handleFindCate = (param: { [key: string]: string }) => {
    void (async () => {
      setParams(param);
      dispatch(setLoading(true));
      const data = await categoryService.getCategories(param);
      dispatch(setLoading(false));
      setCategories(data);
    })();
  };

  const columns: ColumnsType<CategoryType>[] = [
    {
      title: 'Tên',
      dataIndex: new DataField(['name']),
      filterKey: 'search',
      filter: [],
      width: 1500,
    },
    {
      title: 'Action',
      dataIndex: new DataField([]),
      filterKey: 'action',
      width: 200,
      render: (row) => (
        <div className="flex gap-4">
          <div
            className="px-2 text-[14px] bg-yellow-400 hover:bg-yellow-500 text-white rounded cursor-pointer"
            onClick={() => {
              setCategoryTarget(row);
              openModal('update-category');
            }}
          >
            Chỉnh sửa
          </div>
          <div
            className="px-2 text-[14px] bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer"
            onClick={() => {
              setCategoryTarget(row);
              openModal('delete-category');
            }}
          >
            Xóa
          </div>
        </div>
      ),
    },
  ];

  return (
    <main className="max-h-screen p-3 py-4 overflow-y-scroll lg:p-6 h-100">
      <div className="flex justify-between">
        <h2 className="text-[20px] font-semibold mb-5">
          Quản lí lĩnh vực công việc
        </h2>
        <Button
          onClick={() => {
            openModal('create-category');
          }}
        >
          Thêm mới
        </Button>
      </div>
      <Table
        name="categories"
        dataSource={categories}
        columns={columns}
        params={params}
        setFilter={handleFindCate}
        resetFilter={resetParams}
      />

      <Modal
        id="create-category"
        show={modal === 'create-category'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Thêm mới
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên lĩnh vực"
            placeholder="Nhập tên lĩnh vực mới  "
            type="text"
            color="emerald"
            id="newCategoryName"
            defaultValue={''}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createCategory}>Tạo mới</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="update-category"
        show={modal === 'update-category'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Chỉnh sửa
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên lĩnh vực"
            placeholder="Nhập tên lĩnh vực mới  "
            type="text"
            color="emerald"
            id="updateCategoryName"
            defaultValue={categoryTarget?.name}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateCategory}>Lưu</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="delete-category"
        show={modal === 'delete-category'}
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa lĩnh vực này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteCategory}>
                Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={closeModal}>
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </main>
  );
}
