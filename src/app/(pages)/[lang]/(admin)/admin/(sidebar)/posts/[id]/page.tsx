'use client';

import { useState, useEffect } from 'react';
import useModal from '@/hooks/useModal';
import { useParams } from 'next/navigation';
import { useAppDispatch } from '@/hooks/useRedux';
import { toast } from 'sonner';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { setLoading } from '@/features/loading/loadingSlice';

import PostDetailsInfo from '@/components/PostDetailsInfo';
import Modal from '@/components/modal/Modal';
import { Button } from '@/components/ui/button';

import postService from '@/services/postService';

import PostType from '@/types/post';
import ErrorType from '@/types/error';
import { useSession } from 'next-auth/react';

export default function ADPostDetail(): JSX.Element {
  const dispatch = useAppDispatch();
  const params = useParams<{ id: string }>();

  const [post, setPost] = useState<PostType | undefined>(undefined);
  const [updateData, setUpdateData] = useState<boolean>(true);
  const { modal, openModal, closeModal } = useModal();
  const session = useSession()
  useEffect(() => {
    const loadData = async (): Promise<void> => {
      const data = await postService.getPostById(params.id);
      setPost(data);
    };

    void loadData();
  }, [params.id]);

  async function deletePost(): Promise<void> {
    closeModal();
    dispatch(setLoading(true));
    try {
      await postService.updatePostStatus(params.id, 'Blocked', session.data?.accessToken!!);
      toast.success('Đã khóa bài đăng');
      dispatch(setLoading(false));
      setUpdateData(!updateData);
    } catch (err) {
      toast.error((err as ErrorType).message);
      dispatch(setLoading(false));
    }
  }

  const approvalPost = (status: boolean): void => {
    closeModal();
    dispatch(setLoading(true));
    postService
      .updatePostStatus(params.id, status ? 'Opening' : 'Rejected', session.data?.accessToken!!)
      .then(() => {
        dispatch(setLoading(false));
        toast.success('Đã cập nhật bài đăng');
      })
      .catch(() => {
        dispatch(setLoading(false));
        toast.error('Không thể cập nhật bài đăng');
      });
  };

  return (
    <div className="max-h-screen py-6 pr-2 overflow-y-scroll">
      <span className="block mb-4 text-lg font-semibold opacity-80">
        Chi tiết bài đăng
      </span>
      {post && (
        <PostDetailsInfo type="Admin" post={post} openModal={openModal} />
      )}
      <Modal
        show={modal === 'lock-post-modal'}
        size="md"
        popup
        id="lock-post-modal"
        onClose={closeModal}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn khóa bài đăng này này không?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => void deletePost()}>
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
        id="approval-post"
        show={modal === 'approval-post'}
        size="xl"
        popup
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Bạn có chắc muốn duyệt nhanh bài đăng này?
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
                Không chấp nhận
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
    </div>
  );
}
