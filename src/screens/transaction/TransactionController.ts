import { IPagination } from "../../data/AppInterface";
import { TReactSetState, TSetPaginationFn } from "../../data/AppType";
import {
  GET_ALL_TRANSCTION,
  GET_TRANSCTION_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { PAYMENT_TRANSACTION_STATUS } from "../../utils/AppEnumerations";
import {
  generatePaginationFromApiRes,
  resetPaginationWithPpr,
  toastError,
} from "../../utils/AppFunctions";

export interface ITransaction {
  id: number;
  entity_type: string;
  transaction_initiate_date: string;
  transaction_currency: string;
  transaction_type: string;
  full_name: string;
  service_title: string;
  transaction_amount: string;
  payment_transaction_status_label: string;
  payment_transaction_status: number;
}

export interface IFilters {
  filterTransactionType: string | null;
  filterTransactionFor: string | null;
  filterFromDate: string | null;
  filterToDate: string | null;
  transactionStatus: number | null;
}

export interface ITransactionDetails {
  id: number;
  user_id: number;
  transaction_initiate_date: string;
  transaction_amount: string;
  transaction_currency: string;
  pg_order_id: string;
  payment_captured_date: string;
  payment_method: string | null;
  entity_type: string;
  transaction_type: string;
  full_name: string;
  service_title: string;
  entity_type_label: string;
  payment_transaction_status: number;
  payment_transaction_status_label: string;
}

export const fetchTransactionApi = async (
  setTransactionList: TReactSetState<ITransaction[]>,
  setLoading: TReactSetState<boolean>,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  transaction: ITransaction[],
  transactionType?: string,
  transactionFor?: string,
  fromDate?: string,
  toDate?: string,
  transactionStatus?: number,
  append: boolean = false
) => {
  setLoading(true);

  try {
    const transactionList = await GET_ALL_TRANSCTION(
      pagination,
      transactionType,
      transactionFor,
      fromDate,
      toDate,
      transactionStatus
    );

    if (
      transactionList &&
      transactionList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (transaction && transaction.length > 0) {
        !append
          ? setTransactionList(transactionList?.data?.item)
          : setTransactionList([
              ...transaction,
              ...transactionList?.data?.item,
            ]);
      } else setTransactionList(transactionList?.data?.item);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(transactionList.data.pagination),
      });
    } else {
      setTransactionList([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
      toastError(transactionList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.responce.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const fetchTransactionByID = async (
  setTransactionDetails: TReactSetState<ITransactionDetails | undefined>,
  transactionId: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const transactionDetails = await GET_TRANSCTION_BY_ID(transactionId);
    if (
      transactionDetails &&
      transactionDetails.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setTransactionDetails(transactionDetails.data);
    } else {
      toastError(transactionDetails.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export function convertIndianCurrencytowords(amount: number): string {
  const singleDigits = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const suffixes = ["", "Thousand", "Lakh", "Crore"];

  let integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  let result = "";

  // Function to convert three digits into words
  const convertThreeDigitNumber = (num: number): string => {
    let str = "";

    // Extract hundreds place
    if (num >= 100) {
      str += singleDigits[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    // Extract tens and units place
    if (num >= 10 && num < 20) {
      str += teens[num - 10];
    } else if (num >= 20) {
      str += tens[Math.floor(num / 10)];
      num %= 10;
      if (num > 0) str += " " + singleDigits[num];
    } else if (num > 0) {
      str += singleDigits[num];
    }

    return str.trim();
  };

  // Function to convert integer part into words
  const convertIntegerPart = (num: number): string => {
    let str = "";
    let i = 0;
    while (num > 0) {
      const threeDigit = num % 1000;
      if (threeDigit > 0) {
        str =
          convertThreeDigitNumber(threeDigit) + " " + suffixes[i] + " " + str;
      }
      num = Math.floor(num / 1000);
      i++;
    }
    return str.trim();
  };

  // Convert integer part to words
  result += convertIntegerPart(integerPart);

  // Add decimal part if present
  if (decimalPart > 0) {
    result += " Rupees and " + convertThreeDigitNumber(decimalPart) + " Paisa";
  } else {
    result += " Rupees Only";
  }

  return result.trim();
}

export const getStatusClass = (status: PAYMENT_TRANSACTION_STATUS): string => {
  switch (status) {
    case PAYMENT_TRANSACTION_STATUS.Initiated:
      return "text-yellow-500"; // Yellow for initiated
    case PAYMENT_TRANSACTION_STATUS.Captured:
      return "text-green-500"; // Green for captured
    case PAYMENT_TRANSACTION_STATUS.Refunded:
      return "text-blue-500"; // Blue for refunded
    case PAYMENT_TRANSACTION_STATUS.Failed:
      return "text-red-500"; // Red for failed
    default:
      return "text-gray-500"; // Default gray
  }
};
