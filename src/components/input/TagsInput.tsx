import { useState, useEffect } from 'react';
import { FaTags, FaXmark } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

import useDebounce from '../../hooks/useDebounce';

interface TagType {
  id: string;
  name: string;
}

interface HintType {
  id: string;
  name: string;
}

export interface TagsInputChangeEvent {
  target: {
    name: string;
    value: Array<string>;
  };
}

interface TagsInputProps<T, K>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tags?: T[];
  hints?: K[];
  onHintsSearch?: (name: string) => Promise<T[]>;
  onHintCreate?: (name: string) => Promise<T> | null;
  onTagsInputChange?: (e: TagsInputChangeEvent) => void;
  sendData?: (data: TagType[]) => void;
}

function TagsInput<T, K>({
  id,
  label,
  name,
  placeholder,
  tags,
  hints,
  onHintsSearch,
  onHintCreate = () => null,
  onTagsInputChange = () => null,
  sendData,
}: TagsInputProps<T, K>): JSX.Element {
  const [tagsInput, setTagsInput] = useState({
    text: '',
    tags: (tags || []) as Array<TagType>,
    hints: (hints || []) as Array<HintType>,
    isFocus: false,
  });
  const debouncedText = useDebounce(tagsInput.text);

  useEffect(() => {
    onHintsSearch &&
      void (async () => {
        const _hints = (await onHintsSearch(debouncedText)) as HintType[];
        setTagsInput((prev) => ({
          ...prev,
          hints: _hints,
        }));
      })();
    sendData && sendData(tagsInput.tags);
  }, [debouncedText, onHintsSearch, sendData, tagsInput.tags]);

  useEffect(() => {
    onTagsInputChange({
      target: {
        name: name as string,
        value: tagsInput.tags.map((tag) => tag.id),
      },
    });
  }, [name, tagsInput.tags, onTagsInputChange]);

  useEffect(() => {
    const disableFocus = (e: MouseEvent) => {
      !(e.target as HTMLElement).closest(`[data-id=${id}]`) &&
        setTagsInput((prev) => ({
          ...prev,
          isFocus: false,
        }));
    };
    window.addEventListener('click', disableFocus);

    return () => window.removeEventListener('click', disableFocus);
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput((prev) => ({
      ...prev,
      text: value,
    }));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleTagAdd();
    }
  };

  const handleTagAdd = async () => {
    const text = tagsInput.text;
    const hint = tagsInput.hints.find((hint) => hint.name === text);

    if (hint) {
      const tag = tagsInput.tags.find((tag) => tag.id === id);
      setTagsInput((prev) => ({
        ...prev,
        text: '',
        tags: !tag ? [...prev.tags, hint] : prev.tags,
        isFocus: false,
      }));
    } else {
      const tag = (await onHintCreate(text)) as TagType;
      setTagsInput((prev) => ({
        ...prev,
        text: '',
        tags: tag ? [...prev.tags, tag] : prev.tags,
        isFocus: false,
      }));
    }
  };

  const handleHintChoose = (i: number) => {
    const hint = tagsInput.hints[i];
    const tag = tagsInput.tags.find((tag) => tag.id === hint.id);
    setTagsInput((prev) => ({
      ...prev,
      text: '',
      tags: !tag ? [...prev.tags, hint] : prev.tags,
      isFocus: false,
    }));
  };

  const handleTagClose = (i: number) =>
    setTagsInput((prev) => ({
      ...prev,
      tags: [...prev.tags.slice(0, i), ...prev.tags.slice(i + 1)],
    }));

  const handleFocusInput = () =>
    setTagsInput((prev) => ({
      ...prev,
      isFocus: true,
    }));

  const tagElms = tagsInput.tags.map((tag, i) => (
    <div
      key={tag.id}
      className="flex items-center gap-1 pl-2 text-sm leading-none rounded bg-slate-200"
    >
      {tag.name}
      <div
        className="px-2 py-1 cursor-pointer text-slate-800 hover:text-emerald-500"
        onClick={() => handleTagClose(i)}
      >
        <FaXmark className="w-4 h-4" />
      </div>
      <input type="hidden" name={name} value={tag.id} />
    </div>
  ));

  const hintElms = tagsInput.hints.map((hint, i) => {
    const isSelected = tagsInput.tags.find((tag) => tag.id === hint.id);
    return (
      <div
        key={hint.id}
        className={cn('p-2 hover:bg-emerald-400 hover:text-white', {
          'bg-emerald-400 text-white': isSelected,
        })}
        onClick={() => handleHintChoose(i)}
      >
        {hint.name}
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-2">
      {label && <label htmlFor={id}>{label}</label>}
      <div
        data-id={id}
        className={cn(
          'relative flex flex-wrap min-h-[41.6px] items-center gap-2 p-2.5 border rounded-lg border-emerald-300',
          {
            'ring-2 ring-emerald-500 border-transparent': tagsInput.isFocus,
          }
        )}
      >
        {tagElms}
        <input
          id={id}
          type="text"
          className="p-0 text-sm border-none outline-none grow"
          placeholder={placeholder}
          value={tagsInput.text}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocusInput}
        />
        <FaTags
          className="absolute w-5 h-5 cursor-pointer top-3 right-2 text-slate-500 hover:text-emerald-500"
          onClick={handleTagAdd}
        />
        {!!tagsInput.hints.length && tagsInput.isFocus && (
          <div className="absolute left-0 z-50 w-full py-2 overflow-y-scroll text-sm bg-white border-2 rounded shadow-md max-h-48 q top-full border-slate-200">
            {hintElms}
          </div>
        )}
      </div>
    </div>
  );
}

export default TagsInput;
