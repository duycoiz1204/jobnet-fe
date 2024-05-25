import Pagination from '../Pagination';

import {
  TableRow as RawTableRow,
  TableCell as RawTableCell,
} from '../ui/table';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export default function TableFooter({
  page,
  totalPage,
  colSpan,
  handleChangePage,
  handleChangeFontSize,
}: {
  page: number;
  totalPage: number;
  colSpan: number;
  handleChangePage: (agr: number) => void;
  handleChangeFontSize: (agr: boolean) => void;
}): JSX.Element {
  const handlePageChange = (p: number) => {
    if (p <= 0) p = 1;
    if (p > totalPage) p = totalPage;
    handleChangePage(p);
  };

  return (
    <RawTableRow>
      <RawTableCell colSpan={colSpan} className="p-2">
        <div className="flex justify-between ">
          <div className="flex item-center">
            <div
              onClick={() => {
                handleChangeFontSize(false);
              }}
              className="flex items-center justify-center h-10 cursor-pointer  w-10 border rounded-l-base hover:bg-slate-200"
            >
              <AiOutlineMinus></AiOutlineMinus>
            </div>
            <div
              onClick={() => {
                handleChangeFontSize(true);
              }}
              className="flex items-center justify-center h-10 cursor-pointer w-10 border rounded-r-base hover:bg-slate-200"
            >
              <AiOutlinePlus></AiOutlinePlus>
            </div>
          </div>
          <div>
            <Pagination
              currentPage={page}
              totalPages={totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </RawTableCell>
    </RawTableRow>
  );
}
