import { useState, useEffect } from 'react';

import { Table as RawTable } from '../ui/table';
import TableHeader from './TableHeader';
import TableBody from './TableBody';
import TableFooter from './TableFooter';
import ColumnsType from '../ColumnsType';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  name: string;
  page?: number;
  totalPage?: number;
  pageSize?: number;

  dataSource: any[];
  columns: ColumnsType<any>[];

  //if show numerical order
  numberList?: boolean;
  //params
  params: { [key: string]: string | string[] };
  // parent component listens and sends a request to the server to get data filtered by param, return data to the current element
  setFilter: (a: any) => void;
  resetFilter: () => void;
}

const Table = ({
  name,
  dataSource,
  columns,
  className,
  pageSize = 10,
  numberList = true,
  params = {},
  setFilter,
  page = 1,
  totalPage = 1,
  resetFilter,
  ...props
}: TableProps) => {
  const [data, setData] = useState<object[]>([]);
  const [fontSize, setFontsize] = useState<number>(13);
  const [columnsTable, setColumns] = useState(columns);
  const [resizing, setResizing] = useState(false);
  const [resizeIndex, setResizeIndex] = useState(-1);

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);
  useEffect(() => {
    setColumns(columns);
  }, [columns]);

  const handleMouseUp = () => {
    setResizing(false);
    setResizeIndex(-1);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const moveMouseBlock = document.getElementById(`table-${name}`);
    if (!moveMouseBlock) {
      handleMouseUp();
      return;
    }

    const rect = moveMouseBlock.getBoundingClientRect();
    let sum = numberList ? 20 : 0;

    for (let i = 0; i < resizeIndex; i++) {
      sum += columnsTable[i].width;
    }
    const newWidth = e.clientX - sum - rect.left;
    if (
      newWidth <= 10 ||
      newWidth >= (moveMouseBlock.offsetWidth || 1500) - 10
    ) {
      handleMouseUp();
      return;
    }

    if (!resizing) return;

    const newColumns = [...columnsTable];

    if (resizeIndex === columnsTable.length - 1) {
      newColumns[resizeIndex].width = newWidth;
      return;
    }

    const total2Columns =
      columnsTable[resizeIndex].width + columnsTable[resizeIndex + 1].width;
    newColumns[resizeIndex + 1].width = total2Columns - newWidth;
    newColumns[resizeIndex].width = newWidth;

    setColumns(newColumns);
  };

  const handleChangeFontSize = (arg: boolean): void => {
    const temp = arg ? fontSize + 1 : fontSize - 1;
    if (temp <= 10) setFontsize(10);
    else if (temp >= 20) setFontsize(20);
    else setFontsize(temp);
  };
  const handleChangePage = (arg: number): void => {
    setFilter({ ...params, page: arg });
  };

  return (
    <>
      <RawTable
        {...props}
        className={`relative min-w-full bg-white border border-gray-300 ${className}`}
      >
        <TableHeader
          cols={columnsTable}
          numberList={numberList}
          handleChangeParam={setFilter}
          params={params}
          resetFilter={resetFilter}
          fontSize={fontSize}
          setResizing={setResizing}
          setResizeIndex={setResizeIndex}
        />

        <TableBody
          columns={columnsTable}
          data={data}
          numberList={numberList}
          fontSize={fontSize}
        ></TableBody>

        <TableFooter
          page={page}
          totalPage={totalPage}
          colSpan={columnsTable.length + (numberList ? 1 : 0)}
          handleChangePage={handleChangePage}
          handleChangeFontSize={handleChangeFontSize}
        />
        {resizing && (
          <div
            id={`table-${name}`}
            className="absolute w-full top-0 bottom-0 left-0 h-[50px]"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></div>
        )}
      </RawTable>
    </>
  );
};
export default Table;
