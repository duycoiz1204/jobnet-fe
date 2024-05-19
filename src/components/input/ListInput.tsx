import { useState, useEffect } from 'react';
import { FaCirclePlus, FaXmark } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

export interface ListInputChangeEvent {
  target: {
    name: string;
    value: Array<string>;
  };
}

interface ListInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  listItems?: Array<string>;
  onListInputChange?: (e: ListInputChangeEvent) => void;
}

export default function ListInput({
  id,
  name,
  label,
  listItems,
  onListInputChange = () => undefined,
  ...props
}: ListInputProps) {
  const [listInput, setListInput] = useState({
    text: '',
    listItems: listItems || [],
    isFocus: false,
  });

  useEffect(() => {
    const disableFocus = (e: MouseEvent) => {
      !(e.target as HTMLElement).closest(`[data-id=${id}]`) &&
        setListInput((prev) => ({
          ...prev,
          isFocus: false,
        }));
    };
    window.addEventListener('click', disableFocus);

    return () => window.removeEventListener('click', disableFocus);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setListInput((prev) => ({
      ...prev,
      text: e.target.value,
    }));

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClick();
    }
  };

  const handleAddClick = () => {
    const text = listInput.text;
    const isExisted = listInput.listItems.includes(text);
    const listItems =
      !isExisted && text ? [...listInput.listItems, text] : listInput.listItems;

    setListInput((prev) => ({
      ...prev,
      text: '',
      listItems,
    }));
    callListInputChange(listItems);
  };

  const handleDeleteClick = (i: number) => {
    const listItems = [
      ...listInput.listItems.slice(0, i),
      ...listInput.listItems.slice(i + 1),
    ];

    setListInput((prev) => ({
      ...prev,
      listItems,
    }));
    callListInputChange(listItems);
  };

  const callListInputChange = (value: Array<string>) =>
    onListInputChange({
      target: {
        name: name as string,
        value,
      },
    });

  const handleInputFocus = () =>
    setListInput((prev) => ({
      ...prev,
      isFocus: true,
    }));

  const listItemElms = listInput.listItems.map((listItem, i) => (
    <ListInputItem
      key={i}
      name={name}
      value={listItem}
      onDeleteClick={() => handleDeleteClick(i)}
    />
  ));

  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <ul
        data-id={id}
        className={cn(
          'flex flex-col gap-3 p-2.5 list-disc list-inside border rounded-lg border-emerald-300',
          {
            'ring-2 ring-emerald-500 border-transparent': listInput.isFocus,
          }
        )}
      >
        {listItemElms}
        <div className="flex gap-2">
          <input
            id={id}
            className="p-0 text-sm border-none grow"
            type="text"
            value={listInput.text}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onFocus={handleInputFocus}
            {...props}
          />
          <FaCirclePlus
            className="w-5 h-5 cursor-pointer text-slate-500 hover:text-emerald-500"
            onClick={handleAddClick}
          />
        </div>
      </ul>
    </div>
  );
}

interface ListInputItemProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onDeleteClick?: () => void;
}

function ListInputItem({ name, value, onDeleteClick }: ListInputItemProps) {
  return (
    <div className="flex items-center justify-between">
      <li className="text-sm italic">{value}</li>
      <FaXmark
        className="w-4 h-4 cursor-pointer text-slate-500 hover:text-emerald-500"
        onClick={onDeleteClick}
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
