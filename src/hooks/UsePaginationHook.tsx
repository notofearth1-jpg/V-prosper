import { useState } from "react";
import { IPagination } from "../data/AppInterface";

interface IUsePaginationProps {
  pagination?: Omit<IPagination, "total_count" | "total_page">;
}

const INITIAL_PAGINATION: IPagination = {
  per_page_rows: 10,
  current_page: 1,
  sort_by: "",
  order_by: "DESC",
  total_page: 0,
  total_count: 0,
};

const usePaginationHook = (props?: IUsePaginationProps) => {
  const [pagination, changePagination] = useState({
    ...INITIAL_PAGINATION,
    ...(props?.pagination ? props.pagination : {}),
  });

  const setPagination = (value: IPagination) => {
    changePagination(value);
  };
  return { pagination, setPagination };
};

export default usePaginationHook;
