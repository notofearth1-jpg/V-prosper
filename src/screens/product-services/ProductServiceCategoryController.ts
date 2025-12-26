import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { toastError } from "../../utils/AppFunctions";
import {
  GET_BY_ID_SERVICE_CATEGORY,
  GET_SERVICE_BY_SUBCATEGORY_ID,
  GET_SERVICE_SUB_CATEGORY_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";

export interface IService {
  category_title: string;
  sub_category_title: string;
  category_options: [];
  poster_image: string;
  category_desc: string;
  id: number;
  total_services: string;
  app_media: {
    media_url: string;
    media_type: string;
  }[];
}

export interface IServiceBySubCategory {
  service_title: string;
  duration: string;
  app_media: { media_url: string }[];
  id: number;
  is_fav: string;
  service_cost: string;
}

export const fetchServiceCategoryApi = async (
  setServicesList: TReactSetState<IService | null>,
  setLoading: TReactSetState<boolean>,
  id: number,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const serviceCategoryId = await GET_BY_ID_SERVICE_CATEGORY(id);

    if (
      serviceCategoryId &&
      serviceCategoryId.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setServicesList(serviceCategoryId.data);
    } else {
      toastError(serviceCategoryId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.serviceCategoryId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const fetchServiceSubCategoryApi = async (
  setServiceSubCategoryList: TReactSetState<IService[]>,
  setLoadingSubCat: TReactSetState<boolean>,
  id: number
) => {
  try {
    setLoadingSubCat(true);
    const serviceSubcategoryId = await GET_SERVICE_SUB_CATEGORY_BY_ID(id);

    if (
      serviceSubcategoryId &&
      serviceSubcategoryId.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setServiceSubCategoryList(serviceSubcategoryId.data);
    } else {
      toastError(
        serviceSubcategoryId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.serviceSubcategoryId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoadingSubCat(false);
  }
};

export const fetchServiceBySubCategoryApi = async (
  setGetServiceBySubCategory: TReactSetState<IServiceBySubCategory[]>,
  id: number
) => {
  try {
    const serviceBySubcategoryId = await GET_SERVICE_BY_SUBCATEGORY_ID(id);

    if (
      serviceBySubcategoryId &&
      serviceBySubcategoryId.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setGetServiceBySubCategory(serviceBySubcategoryId.data);
    } else {
      toastError(
        serviceBySubcategoryId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.serviceBySubcategoryId?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
