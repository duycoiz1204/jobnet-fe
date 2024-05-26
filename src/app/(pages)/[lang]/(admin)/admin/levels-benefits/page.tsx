'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAppDispatch } from '@/hooks/useRedux';
import { setLoading } from '@/features/loading/loadingSlice';
import useModal from '@/hooks/useModal';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { toast } from 'sonner';

import ColumnsType, { DataField } from '@/components/ColumnsType';
import { Button } from '@/components/ui/button';
import Table from '@/components/table/Table';
import Modal from '@/components/modal/Modal';
import InputWithLabel from '@/components/input/InputWithLabel';

import levelService from '@/services/levelService';
import benefitService from '@/services/benefitService';

import BenefitType from '@/types/benefit';
import LevelType from '@/types/level';

export default function LevelsAndBenefitsManagement() {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const [benefits, setBenefits] = useState<BenefitType[]>([]);
  const [levels, setLevels] = useState<LevelType[]>([]);

  //element targer
  const [benefitTarget, setBenefitTarget] = useState<BenefitType | undefined>(
    undefined
  );
  const [levelTarget, setLevelTarget] = useState<LevelType | undefined>(
    undefined
  );

  //modal
  const { modal, openModal, closeModal } = useModal();

  //update data
  const [updateBenefitData, setUpdateBenefitData] = useState<boolean>(true);
  const [updateLevelData, setUpdateLevelData] = useState<boolean>(true);

  //load data
  useEffect(() => {
    async function loadData(): Promise<void> {
      const benefits: BenefitType[] = await benefitService.getBenefits();
      setBenefits(benefits);
    }
    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [updateBenefitData]);

  useEffect(() => {
    async function loadData(): Promise<void> {
      const levels: LevelType[] = await levelService.getLevels();
      setLevels(levels);
    }
    loadData().catch(() => {
      toast.error('Không thể cập nhật dữ liệu');
    });
  }, [updateLevelData]);

  const createBenefit = (): void => {
    const name: HTMLElement | null = document.getElementById('newBenefitName');
    const desc: HTMLElement | null = document.getElementById('newBenefitDesc');
    if (name instanceof HTMLInputElement && desc instanceof HTMLInputElement) {
      serviceBenefitProcess(
        benefitService.createBenefit(
          { name: name.value, desc: desc.value },
          session?.accessToken!
        ),
        'Tạo phúc lợi thành công',
        'Tạo phúc lợi không thành công'
      );
    }
  };

  const updateBenefit = (): void => {
    const name: HTMLElement | null =
      document.getElementById('updateBenefitName');
    const desc: HTMLElement | null =
      document.getElementById('updateBenefitDesc');
    if (name instanceof HTMLInputElement && desc instanceof HTMLInputElement) {
      const id: string = benefitTarget?.id.toString() || '';
      serviceBenefitProcess(
        benefitService.updateBenefit(
          id,
          {
            name: name.value,
            description: desc.value,
          },
          session?.accessToken!
        ),
        'Cập nhật phúc lợi thành công',
        'Cập nhật phúc lợi không thành công'
      );
    }
  };

  const deleteBenefit = (): void => {
    dispatch(setLoading(true));
    const id: string = benefitTarget?.id.toString() || '';
    serviceBenefitProcess(
      benefitService.deleteBenefitById(id, session?.accessToken!),
      'Xóa phúc lợi thành công',
      'Xóa phúc lợi không thành công'
    );
  };

  const createLevel = (): void => {
    const name: HTMLElement | null = document.getElementById('newLevelName');
    if (name instanceof HTMLInputElement) {
      serviceLevelProcess(
        levelService.createLevel({ name: name.value }),
        'Tạo vị trí thành công',
        'Tạo vị trí không thành công'
      );
    }
  };

  const updateLevel = (): void => {
    const name: HTMLElement | null = document.getElementById('updateLevelName');

    if (name instanceof HTMLInputElement) {
      const id: string = levelTarget?.id || '';
      serviceLevelProcess(
        levelService.updateLevel(id, { name: name.value }),
        'Cập nhật vị trí thành công',
        'Cập nhật vị trí không thành công'
      );
    }
  };

  const deleteLevel = (): void => {
    const id: string = levelTarget?.id || '';
    serviceLevelProcess(
      levelService.deleteLevelById(id),
      'Xóa vị trí thành công',
      'Xóa vị trí không thành công'
    );
  };

  function serviceBenefitProcess(
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
        setUpdateBenefitData(!updateBenefitData);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
        setUpdateBenefitData(!updateBenefitData);
      });
  }

  function serviceLevelProcess(
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
        setUpdateLevelData(!updateLevelData);
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error(fail);
        setUpdateLevelData(!updateLevelData);
      });
  }

  const columnsBenefit: ColumnsType<BenefitType>[] = [
    {
      title: 'Tên',
      dataIndex: new DataField(['name']),
      filterKey: 'search',
      filter: [],
      width: 250,
    },
    {
      title: 'Mô tả',
      filterKey: 'description',
      dataIndex: new DataField(['description']),
      width: 1500,
    },
    {
      title: 'Action',
      filterKey: 'action',
      dataIndex: new DataField([]),
      width: 200,
      render: (row) => (
        <div className="flex gap-4">
          <div
            className="px-2 text-[14px] bg-yellow-400 hover:bg-yellow-500 text-white rounded cursor-pointer"
            onClick={() => {
              setBenefitTarget(row);
              openModal('update-benefit');
            }}
          >
            Chỉnh sửa
          </div>
          <div
            className="px-2 text-[14px] bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer"
            onClick={() => {
              setBenefitTarget(row);
              openModal('delete-benefit');
            }}
          >
            Xóa
          </div>
        </div>
      ),
    },
  ];
  const columnsLevel: ColumnsType<LevelType>[] = [
    {
      title: 'Tên',
      dataIndex: new DataField(['name']),
      filterKey: 'search',
      filter: [],
      width: 1500,
    },
    {
      title: 'Action',
      filterKey: 'action',
      dataIndex: new DataField([]),
      width: 200,
      render: (row) => (
        <div className="flex gap-4">
          <div
            className="px-2 text-[14px] bg-yellow-400 hover:bg-yellow-500 text-white rounded cursor-pointer"
            onClick={() => {
              setLevelTarget(row);
              openModal('update-level');
            }}
          >
            Chỉnh sửa
          </div>
          <div
            className="px-2 text-[14px] bg-red-500 hover:bg-red-700 text-white rounded cursor-pointer"
            onClick={() => {
              setLevelTarget(row);
              openModal('delete-level');
            }}
          >
            Xóa
          </div>
        </div>
      ),
    },
  ];

  const [benefitParams, setBenefitPParam] = useState<{ [key: string]: string }>(
    {
      search: '',
    }
  );
  const resetBenefitParams = () => {
    handleFindBenefit({ search: '' });
  };
  const handleFindBenefit = (param: { [key: string]: string }) => {
    void (async () => {
      setBenefitPParam(param);
      dispatch(setLoading(true));
      const data = await benefitService.getBenefits(param);
      dispatch(setLoading(false));
      setBenefits(data);
    })();
  };

  const [levelParams, setlevelParam] = useState<{ [key: string]: string }>({
    search: '',
  });
  const resetProfessionParams = () => {
    handleFindLevel({ search: '' });
  };
  const handleFindLevel = (param: { [key: string]: string }) => {
    void (async () => {
      setlevelParam(param);
      dispatch(setLoading(true));
      const data = await levelService.getLevels(param);
      dispatch(setLoading(false));
      setLevels(data);
    })();
  };

  return (
    <main className="max-h-screen p-3 py-4 overflow-y-scroll lg:p-6">
      <div className="flex justify-between">
        <h2 className="text-[20px] font-semibold mb-5">Quản lí phúc lợi</h2>
        <Button onClick={() => openModal('create-benefit')}>Thêm mới</Button>
      </div>
      <Table
        name="benefits"
        dataSource={benefits}
        columns={columnsBenefit}
        params={benefitParams}
        setFilter={handleFindBenefit}
        resetFilter={resetBenefitParams}
      ></Table>

      <div className="flex justify-between mt-10">
        <h2 className="text-[20px] font-semibold mb-5">Quản lí kinh nghiệm</h2>
        <Button onClick={() => openModal('create-level')}>Thêm mới</Button>
      </div>
      <Table
        name="levels"
        dataSource={levels}
        columns={columnsLevel}
        params={levelParams}
        setFilter={handleFindLevel}
        resetFilter={resetProfessionParams}
      />

      {/* modal create */}
      <Modal
        id="create-benefit"
        show={modal === 'create-benefit'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Thêm mới
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên phúc lợi"
            placeholder="Nhập tên phúc lợi mới"
            type="text"
            color="emerald"
            id="newBenefitName"
          />
          <InputWithLabel
            label="Mô tả"
            placeholder="Nhập mô tả"
            type="text"
            color="emerald"
            id="newBenefitDesc"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createBenefit}>Tạo mới</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="create-level"
        show={modal === 'create-level'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Thêm mới
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên vị trí"
            placeholder="Nhập tên vị trí mới"
            type="text"
            color="emerald"
            id="newLevelName"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={createLevel}>Tạo mới</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal update */}
      <Modal
        id="update-benefit"
        show={modal === 'update-benefit'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Chỉnh sửa
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên phúc lợi"
            type="text"
            color="emerald"
            id="updateBenefitName"
            defaultValue={benefitTarget?.name}
          />
          <InputWithLabel
            label="Mô tả"
            placeholder="Nhập mô tả"
            type="text"
            color="emerald"
            id="updateBenefitDesc"
            defaultValue={benefitTarget?.description}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateBenefit}>Lưu</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="update-level"
        show={modal === 'update-level'}
        onClose={closeModal}
      >
        <Modal.Header className="text-white bg-emerald-500">
          Chỉnh sửa
        </Modal.Header>
        <Modal.Body>
          <InputWithLabel
            label="Tên vị trí"
            type="text"
            color="emerald"
            id="updateLevelName"
            defaultValue={levelTarget?.name}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={updateLevel}>Lưu</Button>
          <Button color="gray" onClick={closeModal}>
            Hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* modal delete */}
      <Modal
        id="delete-benefit"
        show={modal === 'delete-benefit'}
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa phúc lợi này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteBenefit}>
                Tôi chắc chắn
              </Button>
              <Button color="gray" onClick={closeModal}>
                Hủy
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        id="delete-level"
        show={modal === 'delete-level'}
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn xóa vị trí này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={deleteLevel}>
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
