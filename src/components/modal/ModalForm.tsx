import { Button } from '../ui/button';
import { Input, InputProps } from '../ui/input';

interface ModalFormProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  onInfoUpdate: () => void;
  onModalClose: () => void;
}

interface ModalFormInputProps extends InputProps {
  title: string;
}

export default function ModalForm({
  title,
  children,
  onInfoUpdate,
  onModalClose,
}: ModalFormProps): JSX.Element {
  return (
    <div className="text-center">
      <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="relative w-full overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <tbody>{children}</tbody>
        </table>
      </div>
      <div className="flex justify-center gap-4 mt-3">
        <Button type="submit" color="failure" onClick={onInfoUpdate}>
          Tôi chắc chắn
        </Button>
        <Button color="gray" onClick={onModalClose}>
          Hủy
        </Button>
      </div>
    </div>
  );
}

ModalForm.Input = function ModalInput({
  title,
  ...props
}: ModalFormInputProps): JSX.Element {
  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <th
        scope="row"
        className="w-1/3 px-6 py-4 font-medium text-gray-900 bg-gray-50 whitespace-nowrap dark:text-white"
      >
        {title}
      </th>
      <td className="px-6 py-4">
        <Input {...props} />
      </td>
    </tr>
  );
};
