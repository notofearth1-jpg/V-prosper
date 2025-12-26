import { IPagination } from "../../data/AppInterface";
import { TReactSetState, TSetPaginationFn } from "../../data/AppType";
import { GET_ALL_MY_SUBSCRIPTION_PACKAGES } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  toastError,
  generatePaginationFromApiRes,
} from "../../utils/AppFunctions";

export interface IMySubscription {
  id: number;
  subscription_date: string;
  expiry_date: string;
  subscription_price: string;
  subscription_discounted_price: string;
  entity_type: number;
  entity_type_label: string;
  entity_name: string;
  media_url: string;
  entity_record_id: number;
}

export const getAllMyPremiumPackages = async (
  setBufferLoading: TReactSetState<boolean>,
  myPremiumPackageList: IMySubscription[],
  setMyPremiumPackageList: TReactSetState<IMySubscription[]>,
  setPremiumPackagePagination: TSetPaginationFn,
  premiumPackagePagination: IPagination
) => {
  setBufferLoading(true);
  const packageType = "sp";
  try {
    const mySubscriptionsResult = await GET_ALL_MY_SUBSCRIPTION_PACKAGES(
      packageType,
      premiumPackagePagination
    );
    if (
      mySubscriptionsResult &&
      mySubscriptionsResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (myPremiumPackageList.length < 1) {
        setMyPremiumPackageList(mySubscriptionsResult.data.item);
        setPremiumPackagePagination({
          ...premiumPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      } else {
        setMyPremiumPackageList([
          ...myPremiumPackageList,
          ...mySubscriptionsResult?.data?.item,
        ]);
        setPremiumPackagePagination({
          ...premiumPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      }
    } else {
      toastError(mySubscriptionsResult.message);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setBufferLoading(false);
  }
};

export const getAllMyEventPackages = async (
  setBufferLoading: TReactSetState<boolean>,
  myEventList: IMySubscription[],
  setMyEventList: TReactSetState<IMySubscription[]>,
  setEventPackagePagination: TSetPaginationFn,
  payloadEventPackagePagination: IPagination
) => {
  setBufferLoading(true);
  const packageType = "ev";
  try {
    const mySubscriptionsResult = await GET_ALL_MY_SUBSCRIPTION_PACKAGES(
      packageType,
      payloadEventPackagePagination
    );
    if (
      mySubscriptionsResult &&
      mySubscriptionsResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (myEventList.length < 1) {
        setMyEventList(mySubscriptionsResult.data.item);
        setEventPackagePagination({
          ...payloadEventPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      } else {
        setMyEventList([...myEventList, ...mySubscriptionsResult?.data?.item]);
        setEventPackagePagination({
          ...payloadEventPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      }
    } else {
      toastError(mySubscriptionsResult.message);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setBufferLoading(false);
  }
};

export const getAllLibraryPackages = async (
  setBufferLoading: TReactSetState<boolean>,
  myLibraryList: IMySubscription[],
  setMyLibraryList: TReactSetState<IMySubscription[]>,
  setLibraryPackagePagination: TSetPaginationFn,
  payloadLibraryPackagePagination: IPagination
) => {
  setBufferLoading(true);
  const packageType = "lb";
  try {
    const mySubscriptionsResult = await GET_ALL_MY_SUBSCRIPTION_PACKAGES(
      packageType,
      payloadLibraryPackagePagination
    );
    if (
      mySubscriptionsResult &&
      mySubscriptionsResult.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      if (myLibraryList.length < 1) {
        setMyLibraryList(mySubscriptionsResult.data.item);
        setLibraryPackagePagination({
          ...payloadLibraryPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      } else {
        setMyLibraryList([
          ...myLibraryList,
          ...mySubscriptionsResult?.data?.item,
        ]);
        setLibraryPackagePagination({
          ...payloadLibraryPackagePagination,
          ...generatePaginationFromApiRes(
            mySubscriptionsResult.data.pagination
          ),
        });
      }
    } else {
      toastError(mySubscriptionsResult.message);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setBufferLoading(false);
  }
};
