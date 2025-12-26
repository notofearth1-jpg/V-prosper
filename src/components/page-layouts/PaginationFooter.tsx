import React, { useState } from "react";
import { IPagination } from "../../data/AppInterface";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { prepareMessageFromParams } from "../../utils/AppFunctions";
import { PER_PAGE_ROW_LIST } from "../../config/AppConfig";
import { listIcon } from "../../assets/icons/SvgIconList";
import { TOnChangeSelect } from "../../data/AppType";

interface IPaginationFooter {
  pagination: IPagination;
  handleChangePerPageRows?: (perPageRows: number) => void;
  handleChangePage?: (page: number) => void;
  active?: boolean
}

const PaginationFooter = ({
  pagination,
  handleChangePerPageRows,
  handleChangePage,
  active
}: IPaginationFooter) => {
  const { t } = UseTranslationHook();
  const pageClass =
    "bg-[#ffffff1f] text-white hover:bg-skin-table-hover hover:text-black  flex items-center justify-center px-3 h-8";
  const activePageClass = "!bg-white !text-black";
  const disableBtnClass = "!cursor-no-drop";

  const onChangePerPageRows = (event: TOnChangeSelect) => {
    if (handleChangePerPageRows) {
      pagination.per_page_rows = Number(event.target.value);
      handleChangePerPageRows(Number(event.target.value));
    }
  };
  const onChangePage = (page: number) => {
    if (handleChangePage) {
      pagination.current_page = page;
      handleChangePage(page);
    }
  };
  const getPaginationMessage = () => {
    const startIndex =
      pagination.total_count > 0
        ? ((pagination.current_page - 1) * pagination.per_page_rows + 1).toString()
        : "0";

    const pageEndIndex = pagination.current_page * pagination.per_page_rows;
    const endIndex =
      pagination.total_count > 0
        ? (pageEndIndex < pagination.total_count
          ? pageEndIndex
          : pagination.total_count
        ).toString()
        : "0";
    return prepareMessageFromParams(t("pagination_showing"), [
      ["startIndex", startIndex],
      ["endIndex", endIndex],
      ["totalEntries", pagination.total_count.toString()],
    ]);
  };

  const paginationBtnView = (page: number, key?: string) => {
    return (
      <button onClick={() => onChangePage(page)}>
        <span
          className={`${pageClass} ${pagination.current_page === page ? activePageClass : ""
            }`}
        >
          {page}
        </span>
      </button>
    );
  };

  const dotBtnView = (
    <button>
      <span className={`${pageClass}`}>...</span>
    </button>
  );

  const prevBtnView = (
    <button
      onClick={() =>
        pagination.current_page !== 1
          ? onChangePage(pagination.current_page - 1)
          : {}
      }
    >
      <span
        className={`${pageClass} ${pagination.current_page !== 1 ? "" : disableBtnClass
          } rounded-l`}
      >
        {t("previous")}
      </span>
    </button>
  );

  const nextBtnView = (
    <button
      onClick={() =>
        pagination.current_page !== pagination.total_page
          ? onChangePage(pagination.current_page + 1)
          : {}
      }
    >
      <span
        className={`${pageClass}  ${pagination.current_page !== pagination.total_page
          ? ""
          : disableBtnClass
          } rounded-r`}
      >
        {t("next")}
      </span>
    </button>
  );

  const getPageToShow = () => {
    return (
      <>
        {prevBtnView}
        {pagination.total_page < 8 ? (
          <>
            {Array.from(
              { length: pagination.total_page },
              (_, index) => index
            ).map((page, index) => (
              <span key={index.toString()}>{paginationBtnView(page + 1)}</span>
            ))}
          </>
        ) : pagination.current_page === 1 ? (
          <>
            {paginationBtnView(1)}
            {paginationBtnView(2)}
            {paginationBtnView(3)}
            {paginationBtnView(4)}
            {paginationBtnView(5)}
            {dotBtnView}
            {paginationBtnView(pagination.total_page)}
          </>
        ) : pagination.current_page === pagination.total_page ? (
          <>
            {paginationBtnView(1)}
            {dotBtnView}
            {paginationBtnView(pagination.total_page - 4)}
            {paginationBtnView(pagination.total_page - 3)}
            {paginationBtnView(pagination.total_page - 2)}
            {paginationBtnView(pagination.total_page - 1)}
            {paginationBtnView(pagination.total_page)}
          </>
        ) : (
          <>
            {paginationBtnView(1)}
            {pagination.current_page > 3 && dotBtnView}
            {pagination.current_page > pagination.total_page - 3 &&
              paginationBtnView(pagination.total_page - 4)}
            {pagination.current_page > pagination.total_page - 2 &&
              paginationBtnView(pagination.total_page - 3)}
            {pagination.current_page > 2 &&
              paginationBtnView(pagination.current_page - 1)}
            {paginationBtnView(pagination.current_page)}
            {pagination.current_page < pagination.total_page - 1 &&
              paginationBtnView(pagination.current_page + 1)}
            {pagination.current_page < 4 &&
              paginationBtnView(pagination.current_page + 2)}
            {pagination.current_page < 3 &&
              paginationBtnView(pagination.current_page + 3)}
            {pagination.current_page < 2 &&
              paginationBtnView(pagination.current_page + 4)}
            {pagination.current_page < pagination.total_page - 2 && dotBtnView}
            {paginationBtnView(pagination.total_page)}
          </>
        )}
        {nextBtnView}
      </>
    );
  };

  return (
    <div className=" w-full py-1 px-2 rounded-b-sm flex justify-center items-center">
      {active && <div className="flex items-center">
        {listIcon}
        <p className="typo-table-value">{getPaginationMessage()}</p>
      </div>}

      <div className="block md:flex items-center">
        {active && <div className="flex items-center mr-4">
          <label className="block typo-table-value pe-2">
            {t("row_per_page")}
          </label>
          <select
            className="px-1 py-1 border border-skin-table rounded shadow-sm focus:outline-none "
            value={pagination.per_page_rows}
            onChange={onChangePerPageRows}
          >
            {PER_PAGE_ROW_LIST.map((perPageRow) => (
              <option key={perPageRow} value={perPageRow}>
                {perPageRow}
              </option>
            ))}
          </select>
        </div>}
        <div className="inline-flex text-sm">{getPageToShow()}</div>
      </div>
    </div>
  );
};

export default PaginationFooter;