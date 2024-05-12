'use client';

import { useTranslations } from 'next-intl';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface PaginationItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  active: boolean;
}

interface PaginationButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations();

  const firstPage = Math.max(1, currentPage - 2);
  const lastPage = Math.min(currentPage + 2, totalPages);

  const goToPrevPage = () => {
    currentPage > 1 && onPageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    currentPage < totalPages && onPageChange(currentPage + 1);
  };

  const goToSpecificPage = (num: number) => {
    currentPage !== num && onPageChange(num);
  };

  const elms = Array.from(
    { length: lastPage - firstPage + 1 },
    (_, i) => firstPage + i
  ).map((num) => (
    <PaginationItem
      key={num}
      value={num}
      active={num === currentPage}
      onClick={() => goToSpecificPage(num)}
    />
  ));

  return (
    <>
      {totalPages > 0 && (
        <div className="flex text-slate-600">
          <PaginationButton
            className="rounded-l"
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            {t('pagination.prev')}
          </PaginationButton>
          <div className="flex">{elms}</div>
          <PaginationButton
            className="rounded-r"
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            {t('pagination.next')}
          </PaginationButton>
        </div>
      )}
    </>
  );
}

function PaginationItem({
  value,
  active,
  onClick,
}: PaginationItemProps): JSX.Element {
  const activeCls = active
    ? 'bg-emerald-400 text-white font-semibold'
    : 'hover:bg-slate-200 cursor-pointer';

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 border-l border-y first:border-l-0 border-slate-300 ${activeCls}`}
      onClick={onClick}
    >
      {value}
    </div>
  );
}

function PaginationButton({
  className,
  children,
  onClick,
  disabled,
}: PaginationButtonProps): JSX.Element {
  const disabledCls = disabled
    ? 'text-slate-300'
    : 'cursor-pointer hover:bg-slate-200';

  return (
    <div
      className={`flex items-center h-10 px-4 border border-slate-300 ${className} ${disabledCls}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
