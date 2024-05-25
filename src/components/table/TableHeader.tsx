import { useState, useEffect, useRef } from 'react';

import {
  Table as RawTable,
  TableHeader as RawTableHeader,
  TableRow as RawTableRow,
  TableHead as RawTableHead,
} from '../ui/table';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaSortDown, FaSortUp } from 'react-icons/fa6';
import useClickOutSide from '@/hooks/useClickOutside';
import ColumnsType from '../ColumnsType';

type FilterType = {
  isOpen: boolean;
  search: string;
  checkbox: {
    [value: string]: { text: string; value: string; checked: boolean };
  };
};

export default function TableHeader({
  params,
  cols,
  numberList,
  handleChangeParam,
  fontSize,
  resetFilter,
  setResizing,
  setResizeIndex,
}: {
  params: { [key: string]: string | string[] };
  cols: ColumnsType<any>[];
  numberList: boolean;
  handleChangeParam: (arg: any) => void;
  fontSize: number;
  resetFilter: () => void;
  setResizing: (agr: boolean) => void;
  setResizeIndex: (agr: number) => void;
}) {
  const [columns, setColumns] = useState(cols);
  useEffect(() => {
    setColumns(cols);

    //initial sort status
    const sortInit: { [key: string]: number } = {};
    columns.forEach((e: ColumnsType<any>) => {
      if (e.sort) sortInit[e.filterKey] = 0;
    });
    setSortList(sortInit);

    //initial filter status
    const filterInit: { [key: string]: FilterType } = {};
    columns.forEach((e: ColumnsType<any>) => {
      if (e.filter) {
        const init2: {
          [value: string]: { text: string; value: string; checked: boolean };
        } = {};
        e.filter.forEach((e2: { text: string; value: string }) => {
          init2[e2.value] = { ...e2, checked: false };
        });
        const filterType: FilterType = {
          isOpen: false,
          search: '',
          checkbox: init2,
        };
        filterInit[e.filterKey] = filterType;
      }
    });
    setFilterList(filterInit);
  }, [cols, columns]);

  const [sortList, setSortList] = useState<{ [key: string]: number }>();
  const [filterList, setFilterList] = useState<{ [key: string]: FilterType }>();

  // change sort
  const changeSort = (element: ColumnsType<any>) => {
    if (sortList) {
      //updateSortList
      const temp = {
        ...sortList,
        [element.filterKey]: (sortList[element.filterKey] + 1) % 3,
      };
      setSortList(temp);

      //convertToSortParams
      const sortParams: string[] = [];
      for (const [key, value] of Object.entries(temp)) {
        if (value === 1) sortParams.push(`${key}-desc`);
        if (value === 2) sortParams.push(`${key}-asc`);
      }
      handleChangeParam({ ...params, sortBy: sortParams });
    }
  };

  //show box search
  const toggleFilterBox = (key: string) => {
    if (filterList) {
      const temp: FilterType = filterList[key];
      const temp2: FilterType = { ...temp, isOpen: !temp.isOpen };
      setFilterList({ ...filterList, [key]: temp2 });
    }
  };

  //reset filter status
  const resetFilterList = () => {
    const init: { [key: string]: FilterType } = {};
    columns.forEach((e: ColumnsType<any>) => {
      if (e.filter) {
        const init2: {
          [value: string]: { text: string; value: string; checked: boolean };
        } = {};
        e.filter.forEach((e2: { text: string; value: string }) => {
          init2[e2.value] = { ...e2, checked: false };
        });
        const filterType: FilterType = {
          isOpen: false,
          search: '',
          checkbox: init2,
        };
        init[e.filterKey] = filterType;
      }
    });
    setFilterList(init);
    resetFilter();
  };

  const sortElm = (column: ColumnsType<any>) => {
    if (sortList)
      return (
        <div
          className="flex flex-col cursor-pointer"
          onClick={() => {
            changeSort(column);
          }}
        >
          <FaSortUp
            className={`translate-y-1 ${
              sortList[column.filterKey] === 2 ? `text-gray-300` : ``
            }`}
          ></FaSortUp>
          <FaSortDown
            className={`-translate-y-1 ${
              sortList[column.filterKey] === 1 ? `text-gray-300` : ``
            }`}
          ></FaSortDown>
        </div>
      );
    return <></>;
  };

  const filterElms = (column: ColumnsType<any>) => {
    if (filterList)
      return (
        <FilterBox
          filterList={filterList}
          setFilterList={setFilterList}
          column={column}
          params={params}
          handleChangeParam={handleChangeParam}
          toggle={toggleFilterBox}
          reset={resetFilterList}
        ></FilterBox>
      );
    return <></>;
  };

  const handleMouseDown = (index: number) => {
    setResizing(true);
    setResizeIndex(index);
  };
  return (
    <RawTableHeader className={`text-[${fontSize + 2}px]`}>
      {/* if show numerical order */}
      {numberList && (
        <RawTableRow>
          <RawTableHead
            className={`px-4 py-2 bg-gray-100 border-b border-r w-[20px]`}
          >
            <div className="flex">
              <span className="flex-1">STT</span>
            </div>
          </RawTableHead>
        </RawTableRow>
      )}

      {/* map col from columns */}
      {columns.map((column: ColumnsType<any>, index: number) => {
        const alignText: string =
          column.align === 'right'
            ? 'text-right'
            : column.align === 'center'
            ? 'text-center'
            : 'text-left';
        return (
          <RawTableHead
            key={index}
            style={{ width: column.width }}
            className={`relative px-4 py-2 bg-gray-100 border-b ${alignText} align-middle`}
          >
            <div className="flex items-center">
              <span className="flex-1 capitalize align-middle">
                {column.title}
              </span>{' '}
              {/* if column have a sort function */}
              {column.sort && sortElm(column)}
              {/* if column have a filter function */}
              {column.filter && (
                <div className="relative flex items-center cursor-pointer">
                  {/* open box filter if status = true */}
                  {filterList &&
                    filterList[column.filterKey]?.isOpen &&
                    filterElms(column)}
                  <AiOutlineSearch
                    onClick={() => {
                      toggleFilterBox(column.filterKey);
                    }}
                  ></AiOutlineSearch>
                </div>
              )}
            </div>
            <div
              className="absolute top-0 bottom-0 right-0 w-[2px] bg-gray-100 border cursor-col-resize"
              onMouseDown={() => handleMouseDown(index)}
            />
          </RawTableHead>
        );
      })}
    </RawTableHeader>
  );
}

function FilterBox({
  column,
  filterList,
  reset,
  setFilterList,
  toggle,
  handleChangeParam,
  params,
}: {
  column: ColumnsType<any>;
  filterList: { [key: string]: FilterType };
  reset: () => void;
  setFilterList: (list: { [key: string]: FilterType }) => void;
  toggle: (key: string) => void;
  handleChangeParam: (arg: any) => void;
  params: { [key: string]: string | string[] };
}) {
  const { nodeRef, clickOutSide } = useClickOutSide();

  const handleFilterList = (data: { [key: string]: FilterType }) => {
    setFilterList(data);
    handleChangeParam({ ...convertFilterListToParams(data) });
  };
  //from new filter status, convert to to string | string[] and push params to father comp
  function convertFilterListToParams(data: { [key: string]: FilterType }) {
    const newFilter: { [key: string]: string | string[] } = {};

    for (const [key, value] of Object.entries(data)) {
      const temp: string[] = [];
      //get param in search box
      if (value.search) temp.push(value.search);

      //get params in checkboxs
      for (const [checkboxKey, checkboxvalue] of Object.entries(
        value.checkbox
      )) {
        if (checkboxvalue.checked) temp.push(checkboxKey);
      }
      newFilter[key] = temp.join(',');
    }
    return newFilter;
  }

  //change value search by checkbox
  const handleChangeChecked = (
    column: ColumnsType<any>,
    key: string,
    value: boolean
  ) => {
    const temp: FilterType = filterList[column.filterKey];
    temp.checkbox[key].checked = value;
    handleFilterList({
      ...filterList,
      [column.filterKey]: temp,
    });
  };

  //change value search
  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const temp: FilterType = filterList[key];
    setFilterList({
      ...filterList,
      [key]: { ...temp, search: event.target.value },
    });
  };

  const checkboxsElms = (column: ColumnsType<any>) =>
    column.filter?.map((fill: { text: string; value: string }, fid: number) => (
      <CheckboxItem
        key={fid}
        label={fill.text}
        id={`checkbox-${column.filterKey}${fid}`}
        checked={
          filterList[column.filterKey].checkbox[fill.value].checked || false
        }
        onChange={() => {
          handleChangeChecked(
            column,
            fill.value,
            !filterList[column.filterKey].checkbox[fill.value].checked || false
          );
        }}
      ></CheckboxItem>
    ));

  return (
    <>
      {!clickOutSide && (
        <div
          ref={nodeRef}
          className="absolute z-10 p-2 w-[300px] h-[auto] bg-white rounded -right-10 top-10 shadow-lg"
        >
          <input
            type="text"
            value={filterList[column.filterKey].search}
            onChange={(event) => handleSearchChange(event, column.filterKey)}
            className="w-full text-[14px] font-normal outline-none h-[30px] border border-emerald-500 rounded focus:border-2 focus:border-emerald-500"
          />
          <div className="flex flex-wrap justify-start gap-3 mt-2">
            {checkboxsElms(column)}
          </div>
          <div className="flex gap-2 mt-2">
            {/* button search */}
            <button
              type="button"
              onClick={() => {
                handleFilterList({ ...filterList });
              }}
              className="font-semibold text-[13px] rounded bg-emerald-500 hover:bg-emerald-600 text-white py-1 w-[100px] flex items-center justify-center"
            >
              <AiOutlineSearch className="mr-1 text-md"></AiOutlineSearch>
              Tìm kiếm
            </button>

            {/* button reset */}
            <button
              type="button"
              onClick={reset}
              className="font-semibold text-[13px] rounded border border-gray-200 hover:bg-gray-100 py-1 w-[80px]"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => {
                toggle(column.filterKey);
              }}
              className="font-semibold text-[13px] text-emerald-500 hover:text-emerald-600 rounded border border-gray-200 hover:bg-gray-100 py-1 w-[80px]"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface CheckBoxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function CheckboxItem({
  label,
  className,
  id = '',
  ...props
}: CheckBoxProps): JSX.Element {
  return (
    <div className="w-[auto] inline-block px-1">
      <div className="flex items-center">
        <input
          id={id}
          type="checkbox"
          className="w-4 h-4 rounded border-emerald-400 text-emerald-600 focus:ring-transparent"
          {...props}
        />
        <label
          htmlFor={id}
          className={`block ml-2 text-sm font-normal ${className}`}
        >
          {label}
        </label>
      </div>
    </div>
  );
}
