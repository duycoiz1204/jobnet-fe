import { HashLoader } from 'react-spinners';
import Modal from '../modal/Modal';

interface LoadingProps {
  show: boolean;
  onClose: () => void;
}

function Loader({ show, onClose }: LoadingProps): JSX.Element {
  return (
    <Modal show={show} popup onClose={onClose} className="w-[auto]" size={'sm'}>
      <Modal.Body className="flex flex-col items-center justify-center py-3">
        <HashLoader
          className="-translate-x-4"
          color="#36d7b7"
          size={40}
          speedMultiplier={1.2}
        />
        <h2 className="mt-2">Vui lòng chờ ...</h2>
      </Modal.Body>
    </Modal>
  );
}

export default Loader;

export const LoadingGenerateJD = ({ show }: { show: boolean }) => {
  return (
    <>
      {show && (
        <div className="flex flex-col items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="w-12 h-12 animate-spin text-emerald-500"
            viewBox="0 0 16 16"
          >
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
            <path
              fillRule="evenodd"
              d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
            />
          </svg>
          <p className="font-semibold">Đang tạo tự động</p>
        </div>
      )}
    </>
  );
};
