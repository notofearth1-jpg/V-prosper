import { IDDL, IPagination } from "../../data/AppInterface";
import {
  TReactSetState,
  TSetPaginationFn,
  TUseTranslationTfn,
} from "../../data/AppType";
import {
  GET_MEETING_DETAILS,
  GET_TRAINER_AVAILABILITY,
  GET_TRAINER_BANK_INFO_BY_TRAINER_ID,
  GET_TRAINER_INFO,
  GLOBAL_DROP_DOWN,
} from "../../services/Endpoints";
import {
  DELETE_TRAINER_AVAILABILITY,
  GET_TRAINER_APPROVED_SERVICES,
} from "../../services/trainer-availability/TrainerAvailabilityService";
import { ADD_MEETING_DETAILS } from "../../services/trainer/TrainerService";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import { IS_PUBLISHED } from "../../utils/AppEnumerations";
import {
  decryptData,
  generatePaginationFromApiRes,
  prepareMessageFromParams,
  resetPaginationWithPpr,
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
} from "../../utils/AppFunctions";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import * as Yup from "yup";

export interface ITrainerAvailability {
  id: number;
  trainer_id: number;
  service_id: number;
  service_title: string;
  service_duration: number;
  // for future update
  // start_date: string;
  // end_date: string;
  modified_date: string;
  unit_type_text: string;
  is_peer_to_peer: string;
  is_gender_specific: string;
  session_duration: number;
  is_available: string;
  total_selected_slot: number;
}

export interface ITrainerMeeting {
  meeting_link: string;
  created_date?: Date;
  expiry_date?: Date;
}

export const fetchTrainerAvailabilityApi = async (
  setRelationData: TReactSetState<ITrainerAvailability[]>,
  setLoading: TReactSetState<boolean>,
  search: number | undefined,
  showHistoricalCheck: boolean | undefined,
  setPagination: TSetPaginationFn,
  pagination: IPagination,
  trainerAvailabilityList: ITrainerAvailability[],
  isAppend: boolean
) => {
  try {
    if (!trainerAvailabilityList) setLoading(true);
    const historicalCheck = showHistoricalCheck ? 1 : undefined;
    const trainerList = await GET_TRAINER_AVAILABILITY(
      Number(localStorageUtils.getUserId()),
      search,
      historicalCheck,
      isAppend ? pagination : { ...pagination, current_page: 1 }
    );

    if (trainerList && trainerList.code === DEFAULT_STATUS_CODE_SUCCESS) {
      if (isAppend) {
        setRelationData([
          ...trainerAvailabilityList,
          ...trainerList?.data?.item,
        ]);
      } else setRelationData(trainerList.data.item);
      setPagination({
        ...pagination,
        ...generatePaginationFromApiRes(trainerList.data.pagination),
      });
    } else {
      setRelationData([]);
      setPagination({
        ...pagination,
        ...resetPaginationWithPpr(pagination.per_page_rows),
      });
      toastError(trainerList.message || MESSAGE_LOCAL_UNKNOWN_ERROR_OCCURED);
    }
  } catch (error: any) {
    toastError(
      error?.trainerList.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const handleDeleteTrainerAvailability = async (id: number) => {
  try {
    const trainerAvailabilityDelete = await DELETE_TRAINER_AVAILABILITY(
      Number(localStorageUtils.getUserId()),
      id
    );
    if (
      trainerAvailabilityDelete &&
      trainerAvailabilityDelete.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(trainerAvailabilityDelete.message);

      return true;
    } else {
      sweetAlertError(
        trainerAvailabilityDelete.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
    return false;
  } catch (e: any) {
    sweetAlertError(
      e?.trainerAvailabilityDelete?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
    return false;
  }
};

export const fetchServiceDdl = async (
  setServicesDll: TReactSetState<IDDL[]>
) => {
  const trainerData = await GET_TRAINER_INFO();
  const trainerGender = JSON.parse(decryptData(trainerData.data));

  try {
    const payload = {
      entity: "services",
      data_value: "id",
      display_value: "service_title",
      filters: [
        {
          field: "service_for_gender",
          multi_value: true,
          value: `B|${trainerGender.gender_id === 1 ? "M" : "F"}`,
        },
        {
          field: "is_published",
          value: IS_PUBLISHED.Yes,
        },
        {
          field: "publish_date",
          condition: "lt",
          value: new Date(),
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setServicesDll(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error?.resultDDL?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const handleHasTrainerBankInfo = async (
  setHasBankInfo: TReactSetState<boolean>,
  setLoadingBankInfoDetails: TReactSetState<boolean>
) => {
  try {
    setLoadingBankInfoDetails(true);
    const userId = localStorageUtils.getUserId();
    if (!userId) {
      return;
    }

    const resBankInfo = await GET_TRAINER_BANK_INFO_BY_TRAINER_ID(
      Number(userId)
    );
    if (resBankInfo && resBankInfo.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setHasBankInfo(true);
    }
  } catch (e) {
    toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoadingBankInfoDetails(false);
  }
};

export const getTrainerApprovedServices = async (
  setApprovedServices: TReactSetState<IDDL[]>
) => {
  try {
    const approvedServices = await GET_TRAINER_APPROVED_SERVICES();
    if (
      approvedServices &&
      approvedServices.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setApprovedServices(approvedServices.data);
    } else {
      toastError(approvedServices.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.responce.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const fetchTrainerMeeting = async (
  setMeetingData: TReactSetState<ITrainerMeeting | null>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const meeting = await GET_MEETING_DETAILS();

    if (meeting && meeting.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setMeetingData(meeting.data);
    } else {
      toastError(meeting.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const addTrainerMeeting = async (
  setMeetingData: ITrainerMeeting,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const meeting = await ADD_MEETING_DETAILS(setMeetingData);

    if (meeting && meeting.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(meeting.message);
    } else {
      sweetAlertError(meeting.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const trainerMeetingValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    meeting_link: Yup.string()
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("meeting_link")],
        ])
      )
      .max(
        50,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("meeting_link")],
          ["max", "150"],
        ])
      )
      .min(
        3,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("meeting_link")],
          ["min", "3"],
        ])
      ),
  });
