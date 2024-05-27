'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import useModal from '@/hooks/useModal';
import { toast } from 'sonner';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { setLoading } from '@/features/loading/loadingSlice';

import ColumnsType, { DataField } from '@/components/ColumnsType';
import { Button } from '@/components/ui/button';
import Table from '@/components/table/Table';
import Modal from '@/components/modal/Modal';
import { Input } from '@/components/ui/input';
import InputWithLabel from '@/components/input/InputWithLabel';
import SelectWithLabel from '@/components/select/SelectWithLabel';

import professionService from '@/services/professionService';
import categoryService from '@/services/categoryService';

import CategoryType from '@/types/category';
import ProfessionType from '@/types/profession';

interface Professions {
  professions: Professions[];
}

export default function Professions() {
  const { data: session } = useSession();
  const [professions, setProfessions] = useState<ProfessionType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  //target element
  const [professionTarget, setProfessionTarget] = useState<
    ProfessionType | undefined
  >(undefined);
  const [categoryTarget, setCategoryTarget] = useState<string>('');

  const dispatch = useAppDispatch();

  //modal
  const { modal, openModal, closeModal } = useModal();

  //update data
  const [updateProfessionData, setUpdateProfessionData] =
    useState<boolean>(true);

  //load data
  useEffect(() => {
    async function loadData(): Promise<void> {
      const categories: CategoryType[] = await categoryService.getCategories();
      setCategories(categories);
    }
    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, []);

  useEffect(() => {
    async function loadData(): Promise<void> {
      const professions: ProfessionType[] =
        await professionService.getProfessions();
      setProfessions(professions);
    }
    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [updateProfessionData]);

  const createProfession = (): void => {
    const name: HTMLElement | null =
      document.getElementById('newProfessionName');
    if (name instanceof HTMLInputElement) {
      serviceProcess(
        professionService.createProfession(
          {
            name: name.value,
            categoryId: categoryTarget,
          },
          session!!.accessToken
        ),
        'Tạo ngành nghề thành công',
        'Không thể tạo ngành nghề'
      );
    }
  };

  const updateProfession = (): void => {
    const name: HTMLElement | null = document.getElementById(
      'updateProfessionName'
    );
    if (name instanceof HTMLInputElement) {
      const id: number = parseInt(professionTarget?.id || '-1');
      serviceProcess(
        professionService.updateProfession(
          id,
          {
            name: name.value,
            categoryId: categoryTarget,
          },
          session!!.accessToken
        ),
        'Cập nhật ngành nghề thành công',
        'Cập nhật ngành nghề không thành công'
      );
    }
  };

  const deleteProfession = (): void => {
    const id: number = parseInt(professionTarget?.id || '-1');
    serviceProcess(
      professionService.deleteProfessionById(id, session!!.accessToken),
      'Đã xóa ngành nghề',
      'Không thể xóa ngành nghề'
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
        setUpdateProfessionData(!updateProfessionData);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
        setUpdateProfessionData(!updateProfessionData);
      });
  }

  const columns: ColumnsType<ProfessionType>[] = [
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
      width: 200,
      filterKey: 'action',
      render: (row) => (
        <div className="flex gap-4">
          <div
            className="px-2 text-[14px] bg-yellow-400 hover:bg-yellow-500 text-white rounded cursor-pointer"
            onClick={() => {
              setProfessionTarget(row);
              openModal('update-profession');
            }}
          >
            Chỉnh sửa
          </div>
          <div
            className="px-2 text-[14px] bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer"
            onClick={() => {
              setProfessionTarget(row);
              openModal('delete-profession');
            }}
          >
            Xóa
          </div>
        </div>
      ),
    },
  ];

  const [params, setParams] = useState<{ [key: string]: string }>({
    search: '',
  });

  const resetParams = () => {
    handleFindProfession({ search: '' });
  };

  const handleFindProfession = (param: { [key: string]: string }) => {
    void (async () => {
      setParams(params);
      dispatch(setLoading(true));
      const data = await professionService.getProfessions(param);
      dispatch(setLoading(false));
      setProfessions(data);
    })();
  };

  return (
    <main className="max-h-screen p-3 py-4 overflow-y-scroll lg:p-6 h-100">
      <div className="flex justify-between">
        <h2 className="text-[20px] font-semibold mb-5">Quản lí ngành nghề</h2>
        <Button onClick={() => openModal('create-profession')}>Thêm mới</Button>
      </div>
      <Table
        name="professions"
        dataSource={professions}
        columns={columns}
        params={params}
        setFilter={handleFindProfession}
        resetFilter={resetParams}
      ></Table>

      <Modal
        id="create-profession"
        show={modal === 'create-profession'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Thêm mới
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên ngành nghề"
            placeholder="Nhập tên ngành nghề mới"
            type="text"
            color="emerald"
            id="newProfessionName"
          />
          <SelectWithLabel
            options={[
              { text: 'Vui lòng chọn', value: 'none' },
              ...categories?.map((category) => ({
                text: category.name,
                value: category.id,
              })),
            ]}
            label="Lĩnh vực"
            onChange={(e) => {
              setCategoryTarget(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createProfession}>Tạo mới</Button>
          <Button color="gray" onClick={() => closeModal()}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* update modal */}
      <Modal
        id="update-profession"
        show={modal === 'update-profession'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Chỉnh sửa
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên ngành nghề"
            placeholder="Nhập tên ngành nghề mới"
            type="text"
            color="emerald"
            id="updateProfessionName"
            defaultValue={professionTarget?.name}
          />
          <SelectWithLabel
            options={[
              { text: 'Vui lòng chọn', value: 'none' },
              ...categories?.map((category) => ({
                text: category.name,
                value: category.id,
              })),
            ]}
            label="Lĩnh vực"
            onChange={(e) => {
              setCategoryTarget(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateProfession}>Lưu</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="delete-profession"
        show={modal === 'delete-profession'}
        onClose={closeModal}
        size="md"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa ngành nghề này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteProfession}>
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
