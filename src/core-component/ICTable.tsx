import React from 'react';
import PaginationFooter from '../components/page-layouts/PaginationFooter';
import { IPagination } from '../data/AppInterface';
import { arrowDownIcon, arrowUpIcon } from '../assets/icons/SvgIconList';
import { ORDER_BY } from '../utils/AppConstants';
import { dateFormat } from '../utils/AppFunctions';
import ICTooltip from './ICTooltip';

export const TABEL_FIELD_ALIGN = {
  center: 1,
  right: 2,
  left: 3,
};

export const TABLE_FIELD_TYPE = {
  text: 1,
  status: 2,
  switch: 3,
  date: 4,
  custom: 5,
  currency: 6,
};

type TTableFieldAlign = (typeof TABEL_FIELD_ALIGN)[keyof typeof TABEL_FIELD_ALIGN];

type TTableFieldType = (typeof TABLE_FIELD_TYPE)[keyof typeof TABLE_FIELD_TYPE];

export interface ITableFields<T> {
  name: string;
  key: string;
  sort: boolean;
  type: TTableFieldType;
  align: TTableFieldAlign;
  flex: string;
  checkedValue?: string | boolean | number;
  className?: string;
  handleCheck?: (item: T) => void;
  statusLabelPair?: Record<string | number, string>;
  statusColorClassPair?: Record<string | number, string>;
  component?: (item: T) => JSX.Element;
  limit?: number;
  currencyPrefix?: string;
}

export interface ICustomTableProps<T> {
  fields: ITableFields<T>[];
  totalFlex: string;
  data: T[];
  action?: (item: T) => React.JSX.Element;
  pagination: IPagination;
  handleChangePerPageRows: (perPageRows: number) => void;
  handleChangePage: (page: number) => void;
  handleSort: (field: ITableFields<T>) => void;
  isLoading?: boolean;
}

export interface ITabelFieldViewProps<T> {
  field: ITableFields<T>;
  data: any;
}

const getTextFieldAlignClass = (align: TTableFieldAlign) => {
  switch (align) {
    case TABEL_FIELD_ALIGN.center:
      return 'text-center';
    case TABEL_FIELD_ALIGN.left:
      return 'text-left';
    case TABEL_FIELD_ALIGN.right:
      return 'text-right';
    default:
      return 'text-center';
  }
};

const getTextFieldJustifyClass = (align: TTableFieldAlign) => {
  switch (align) {
    case TABEL_FIELD_ALIGN.center:
      return 'justify-center';
    case TABEL_FIELD_ALIGN.left:
      return 'justify-start';
    case TABEL_FIELD_ALIGN.right:
      return 'justify-end';
    default:
      return 'justify-center';
  }
};

const tableLabelView = <T extends object>(
  fields: ITableFields<T>[],
  handleSort: (field: ITableFields<T>) => void,
  sortBy: string,
  orderBy: string,
  totalFlex: string
) => {
  return (
    <tr
      // className={`bg-slate-100 mx-2 px-2 py-2 border lg:border border-gray-200 text-gray-600 text-sm leading-normal grid grid-cols-${fields.reduce(
      //   (accumulator, currentField) => accumulator + currentField.flex,
      //   0
      // )}`}
      className={`bg-skin-table-base px-2 py-2 border lg:border border-skin-table ${totalFlex}`}
    >
      {fields.map(({ name, sort, align, className, key, flex }, index) => {
        return (
          <th
            scope="col"
            key={name + index + 't-header'}
            onClick={() => (sort ? handleSort(fields[index]) : {})}
            className={`item-center font-semibold ${flex}`}
          >
            <span
              className={`${getTextFieldJustifyClass(align)} ${className || ''} flex items-center`}
            >
              {name}
              {sortBy === key ? (
                orderBy === ORDER_BY.desc ? (
                  arrowDownIcon
                ) : (
                  arrowUpIcon
                )
              ) : (
                <span></span>
              )}
            </span>
          </th>
        );
      })}
    </tr>
  );
};

const limitString = (inputString: string, maxCharacters?: number) => {
  if (maxCharacters) {
    if (inputString && maxCharacters >= 0 && inputString.length > maxCharacters) {
      return (
        <ICTooltip text={inputString.toString()}>
          {inputString.toString().substring(0, maxCharacters) + '...'}
        </ICTooltip>
      );
    } else {
      return <ICTooltip text={inputString?.toString()}>{inputString?.toString()}</ICTooltip>;
    }
  }
  return inputString;
};

const getTableFieldFromType = <T extends object>(fieldData: ITabelFieldViewProps<T>) => {
  switch (fieldData.field.type) {
    case TABLE_FIELD_TYPE.text:
      return getTableFieldTextInput(fieldData);
    case TABLE_FIELD_TYPE.status:
      return getTableFieldStatus(fieldData);
    case TABLE_FIELD_TYPE.switch:
      return getTableFieldSwitch(fieldData);
    case TABLE_FIELD_TYPE.date:
      return getTableFieldDate(fieldData);
    case TABLE_FIELD_TYPE.custom:
      return getTableCustomField(fieldData);
    case TABLE_FIELD_TYPE.currency:
      return getTableFieldCurrency(fieldData);
  }
};

const getTableFieldCurrency = <T extends Object>({ field, data }: ITabelFieldViewProps<T>) => (
  <span className="break-words">
    {data[field.key] ? (field?.currencyPrefix || '') + data[field.key] : ''}
  </span>
);

const getTableFieldTextInput = <T extends Object>({ field, data }: ITabelFieldViewProps<T>) => (
  <span className="break-words">{limitString(data[field.key], field.limit)}</span>
);

const getTableFieldSwitch = <T extends object>({ field, data }: ITabelFieldViewProps<T>) => (
  <label className="relative inline-flex cursor-pointer">
    <input
      type="checkbox"
      name={field.name}
      className="sr-only peer"
      onChange={() => (field.handleCheck ? field.handleCheck(data) : {})}
      checked={data[field.key] === field.checkedValue}
    />
    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
  </label>
);

const getTableFieldStatus = <T extends Object>({ field, data }: ITabelFieldViewProps<T>) => (
  <span
    className={`py-1 px-3 rounded-full inline-block ${
      field.statusColorClassPair ? field.statusColorClassPair[data[field.key]] : 'bg-purple-200'
    }`}
  >
    {field.statusLabelPair ? field.statusLabelPair[data[field.key]] : data[field.key]}
  </span>
);

const getTableCustomField = <T extends Object>({ field, data }: ITabelFieldViewProps<T>) =>
  field.component ? field.component(data) : <></>;

const getTableFieldDate = <T extends Object>({ field, data }: ITabelFieldViewProps<T>) => (
  <span>{data[field.key] ? dateFormat(data[field.key]) : data[field.key]}</span>
);

const ICTable = <T extends object>({
  fields,
  data,
  pagination,
  handleChangePerPageRows,
  handleChangePage,
  handleSort,
  totalFlex,
  isLoading,
}: ICustomTableProps<T>) => {
  return (
    <div>
      <div className="hide-scrollbar overflow-y-hidden overflow-x-scroll">
        <div className="custom-table">
          <table className="w-full">
            <thead className="typo-table-header">
              {tableLabelView<T>(
                fields,
                handleSort,
                pagination.sort_by,
                pagination.order_by,
                totalFlex
              )}
            </thead>
            <tbody className="typo-table-value">
              {!isLoading &&
                data &&
                data.map((item, index) => (
                  <tr
                    id={`data-row-${index}`}
                    key={index}
                    // className={`px-2 py-1 border lg:border border-gray-200 hover:bg-gray-100 mx-2 rounded-sm grid grid-cols-${fields.reduce(
                    //   (accumulator, currentField) => accumulator + currentField.flex,
                    //   0
                    // )}`}
                    className={`px-2 py-1 border border-skin-table bg-skin-table-surface hover:bg-skin-table-hover rounded-sm ${totalFlex}`}
                  >
                    {fields.map((field) => (
                      <td
                        data-label={field.name}
                        key={index + field.name}
                        className={`${getTextFieldAlignClass(field.align)} ${
                          field.className || ''
                        } ${field.flex}`}
                      >
                        {getTableFieldFromType({ field, data: item })}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
          {isLoading && <div className="flex justify-center font-bold">Loading</div>}
          {!isLoading && data.length === 0 && (
            <div className="flex justify-center font-bold">Record Not Found</div>
          )}
        </div>
      </div>
      <PaginationFooter
        pagination={pagination}
        handleChangePerPageRows={handleChangePerPageRows}
        handleChangePage={handleChangePage}
      />
    </div>
  );
};

export default ICTable;
