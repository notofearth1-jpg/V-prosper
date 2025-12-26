import { TReactSetState, TSetPaginationFn } from "../../data/AppType";
import {
  ADD_PREMIUM_PACKAGE_BOOKING,
  GET_ALL_PREMIUM_PACKAGES,
  GET_PREMIUM_PACKAGE_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  toastError,
  generatePaginationFromApiRes,
  handleLibraryFileType,
} from "../../utils/AppFunctions";
import { IPagination } from "../../data/AppInterface";
import { ILibrary } from "../library/LibraryController";

export interface IOrderPremiumPackage {
  order_id: string;
  currency: string;
  amount: number;
  description: string;
  name: string;
  contact_number: string;
}

export interface IPremiumPackageList {
  id: number;
  package_title: string;
  package_description: string;
  target_audience: string;
  package_price: string;
  package_discounted_price: string | null;
  expire_in_days: string | null;
  allow_extension: string;
  extension_price: string | null;
  extension_expire_in_days: string | null;
  has_subscribed: string;
}

interface ILibraryItem {
  id: number;
  title: string;
  file_path: string;
  file_type: number | null;
  is_premium: string;
}

export interface IPremiumPackage {
  id: number;
  package_title: string;
  package_description: string;
  target_audience: string;
  package_price: string;
  package_discounted_price: string | null;
  expire_in_days: number | null;
  allow_extension: string;
  extension_price: string | null;
  extension_expire_in_days: number | null;
  library_items: [
    {
      library_content: ILibraryItem[];
      library_directory: ILibraryItem[];
    }
  ];
  transaction_charge: string;
  tax: string;
  payment_summary: {
    cost: number;
    discount_cost: number | null;
    sale_cost: number;
    tax: number | null;
    total_amount: number;
    transaction_charge: number | null;
  };
  has_subscribed: string;
}
export interface IPremiumPackageBooking {
  entity_type: number;
  entity_record_id: number;
}

export const fetchAllPremiumPackages = async (
  isAppend: boolean,
  setLoading: TReactSetState<boolean>,
  pagination: IPagination,
  setPagination: TSetPaginationFn,
  premiumPackageList: IPremiumPackageList[],
  setPremiumPackages: TReactSetState<IPremiumPackageList[]>
) => {
  setLoading(true);
  try {
    const resultPremiumPackages = await GET_ALL_PREMIUM_PACKAGES(pagination);
    if (
      resultPremiumPackages &&
      resultPremiumPackages.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (isAppend) {
        setPremiumPackages([
          ...premiumPackageList,
          ...resultPremiumPackages?.data?.item,
        ]);
      } else setPremiumPackages(resultPremiumPackages.data.item);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(resultPremiumPackages.data.pagination),
      });
    } else {
      toastError(
        resultPremiumPackages.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
export const getPremiumPackageById = async (
  id: number,
  setPremiumPackage: TReactSetState<IPremiumPackage | undefined>,
  setLoading: TReactSetState<boolean>,
  setShowModal: TReactSetState<boolean>,
  setLibraryList: TReactSetState<ILibrary[]>,
  sp: boolean
) => {
  setLoading(true);
  try {
    const resultPremiumPackageById = await GET_PREMIUM_PACKAGE_BY_ID(id, sp);
    if (
      resultPremiumPackageById &&
      resultPremiumPackageById.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setPremiumPackage(resultPremiumPackageById.data);

      const libItem = [
        ...(resultPremiumPackageById.data.library_items[0].library_content ??
          []),
        ...(resultPremiumPackageById.data.library_items[0].library_directory ??
          []),
      ];
      setLibraryList(
        libItem.map((item) => ({
          ...item,
          title: item.title,
          file_type: handleLibraryFileType(item.file_type ? item.file_type : 0),
          cover_image_path: item.file_path,
          object_id: item.id,
          is_premium: item.is_premium,
        }))
      );
      setShowModal(true);
    } else {
      toastError(
        resultPremiumPackageById.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const submitPremiumPackageBooking = async (
  packageInfo: IPremiumPackageBooking,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);
    const packageBookingData = await ADD_PREMIUM_PACKAGE_BOOKING(packageInfo);
    if (
      packageBookingData &&
      packageBookingData.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      return packageBookingData.data;
    } else {
      toastError(packageBookingData.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};
