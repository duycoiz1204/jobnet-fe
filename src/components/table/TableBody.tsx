import ColumnsType from '../ColumnsType';

import {
  TableBody as RawTableBody,
  TableRow as RawTableRow,
  TableCell as RawTableCell,
} from '../ui/table';

export default function TableBody({
  data,
  numberList,
  columns,
  fontSize,
}: {
  data: any[];
  numberList: boolean;
  columns: ColumnsType<any>[];
  fontSize: number;
}): JSX.Element {
  const cellsRender = (data: object, index: number) =>
    columns.map((column: ColumnsType<any>, index2: number) => {
      if (!column.render) {
        const text =
          column.truncate && column.truncate > 0
            ? truncateString(column.dataIndex.getValue(data), column.truncate)
            : column.dataIndex.getValue(data);
        return (
          <DataCell
            data={text}
            key={`${index}-${index2}`}
            align={column.align || 'left'}
          />
        );
      } else {
        const alignElement: string =
          column.align === 'center' ? 'flex justify-center items-center' : '';
        return (
          <DataCellRender
            key={`${index}-${index2}`}
            align={alignElement}
            render={column.render(data)}
          />
        );
      }
    });
  return (
    <RawTableBody className={`text-[${fontSize}px] relative`}>
      {data.map((data: object, index: number) => (
        <RawTableRow key={index}>
          {numberList && (
            <RawTableCell className={`px-4 py-2 border-b w-[20px]`}>
              {index + 1}
            </RawTableCell>
          )}
          {cellsRender(data, index)}
        </RawTableRow>
      ))}
      {data.length <= 0 && (
        <RawTableRow className="absolute inset-0 flex items-center justify-center top-7">
          <RawTableCell>
            <p className="text-base font-semibold">Không có dữ liệu</p>
          </RawTableCell>
        </RawTableRow>
      )}
    </RawTableBody>
  );
}

function DataCell({ data, align }: { data: string; align: string }) {
  return (
    <RawTableCell className={` px-2 py-1 border-b text-${align}`}>
      {`${data}`}
    </RawTableCell>
  );
}

function DataCellRender({
  align,
  render,
}: {
  align: string;
  render: React.ReactElement | null;
}) {
  return (
    <RawTableCell className={`px-4 py-2 border-b `}>
      <div className={`w-full h-full ${align}`}>{render}</div>
    </RawTableCell>
  );
}

//string length > n => show ...
function truncateString(str: string, n: number): string {
  if (str.length > n) {
    return str.slice(0, n) + '...';
  } else {
    return str;
  }
}
