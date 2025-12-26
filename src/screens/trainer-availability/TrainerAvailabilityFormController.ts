import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import {
  ADD_TRAINER_AVAILABILITY,
  GET_SERVICE_BY_ID_SCHEDULE_INFO,
  GET_TRAINER_AVAILABILITY_BY_ID,
} from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  prepareMessageFromParams,
  sweetAlertError,
  sweetAlertSuccess,
  toastError,
} from "../../utils/AppFunctions";
import * as Yup from "yup";
import { ITrainerAvailability } from "./TrainerAvailabilityController";
import {
  ITrainerAvailabilityPayload,
  UPDATE_TRAINER_AVAILABILITY,
} from "../../services/trainer-availability/TrainerAvailabilityService";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { BIT_VALUE } from "../../utils/AppEnumerations";

export interface IServiceScheduleInfo {
  service_id: number;
  service_title: string;
  service_duration: number;
  service_days: string[];
  service_age_min_criteria: number | null;
  service_age_max_criteria: number | null;
  is_offline: string;
  service_for_gender_label: string;
  slot: string[];
  unit_type_text: string;
  is_available: string;
  is_peer_to_peer: string;
  is_gender_specific: string;
  session_duration: number;
  is_active: string;
}

export interface IServiceScheduleInfoFormik {
  service_id: number;
  // for future update
  // from_date: Date;
  // to_date: Date;
  is_available: string;
  day_slot_configuration: {
    slot: string;
    item: string;
  }[];
}

export interface ITrainerAvailForm
  extends Omit<
    ITrainerAvailability,
    "id" | "CreatedBy" | "CreatedDate" | "ModifiedBy" | "UpdatedDate"
  > {
  TSS: [
    {
      available_day: string;
      available_slot: string;
    }
  ];
}
export const initialValuesTrainerAvailability = (
  trainerAvailabilityToEdit?: ITrainerAvailForm
): IServiceScheduleInfoFormik => {
  let slots: { slot: string; item: string }[] = [];
  if (trainerAvailabilityToEdit?.TSS) {
    slots = trainerAvailabilityToEdit.TSS.map((item) => ({
      slot: item.available_day,
      item: item.available_slot,
    }));
  }
  return {
    service_id: trainerAvailabilityToEdit?.service_id || 0,
    // for future update
    // from_date: trainerAvailabilityToEdit?.start_date
    //   ? getLocalDate(trainerAvailabilityToEdit?.start_date)
    //   : getLocalDate(),
    // to_date: trainerAvailabilityToEdit?.end_date
    //   ? getLocalDate(trainerAvailabilityToEdit?.end_date)
    //   : getLocalDate(),
    is_available: trainerAvailabilityToEdit?.is_available || BIT_VALUE.Zero,
    day_slot_configuration: slots,
  };
};
export const trainerAvailabilityValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    service_id: Yup.number().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("select_services")],
      ])
    ),
    // for future update
    // from_date: Yup.string().required(
    //   prepareMessageFromParams(t("error_message_required"), [
    //     ["fieldName", t("from_date")],
    //   ])
    // ),
    // to_date: Yup.string().required(
    //   prepareMessageFromParams(t("error_message_required"), [
    //     ["fieldName", t("to_date")],
    //   ])
    // ),
  });

export const fetchTrainerAvailabilityById = async (
  id: number,
  setScheduleInfo: TReactSetState<ITrainerAvailForm | undefined>,
  setAvailable: TReactSetState<string>
) => {
  try {
    const trainerAvailabilityId = await GET_TRAINER_AVAILABILITY_BY_ID(
      Number(localStorageUtils.getUserId()),
      id
    );
    if (
      trainerAvailabilityId &&
      trainerAvailabilityId.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      setScheduleInfo(trainerAvailabilityId.data);
      setAvailable(trainerAvailabilityId.data?.is_available);
    } else {
      toastError(
        trainerAvailabilityId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (e: any) {
    toastError(
      e?.trainerAvailabilityId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
export const submitTrainerAvailability = async (
  value: IServiceScheduleInfoFormik,
  handleClose: (status: boolean) => void,
  id: number | undefined
) => {
  try {
    let resultTrainerAvailability;
    const groupedSlots: { [key: string]: string[] } = {};
    // Iterate over the day_slot_configuration array
    value.day_slot_configuration.forEach(({ slot, item }) => {
      // Check if the slot exists in the groupedSlots object
      if (groupedSlots[slot]) {
        // If the slot already exists, push the item to its array
        groupedSlots[slot].push(item);
      } else {
        // If the slot doesn't exist, create a new array with the item
        groupedSlots[slot] = [item];
      }
    });

    // Convert the groupedSlots object into the desired format
    const daySlotConfiguration = Object.keys(groupedSlots).map((day) => ({
      day,
      slot: groupedSlots[day],
    }));
    const changePayload = {
      ...value,
      day_slot_configuration: daySlotConfiguration,
      // for future update
      // from_date: value.from_date
      //   ? moment(value.from_date).format("DD/MM/YYYY")
      //   : "",
      // to_date: value.to_date ? moment(value.to_date).format("DD/MM/YYYY") : "",
    };
    if (!id) {
      resultTrainerAvailability = await ADD_TRAINER_AVAILABILITY(
        Number(localStorageUtils.getUserId()),
        changePayload as ITrainerAvailabilityPayload
      );
    } else {
      resultTrainerAvailability = await UPDATE_TRAINER_AVAILABILITY(
        Number(localStorageUtils.getUserId()),
        changePayload as ITrainerAvailabilityPayload,
        id
      );
    }
    if (
      resultTrainerAvailability &&
      resultTrainerAvailability.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      sweetAlertSuccess(resultTrainerAvailability.message);
      return handleClose(true);
    } else {
      sweetAlertError(
        resultTrainerAvailability.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    sweetAlertError(
      error?.resultTrainerAvailability?.message ||
        MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const fetchServiceScheduleInfo = async (
  setScheduleInfo: TReactSetState<IServiceScheduleInfo | undefined>,
  selectedRelationId: number | null
) => {
  try {
    const scheduleInfoId = await GET_SERVICE_BY_ID_SCHEDULE_INFO(
      selectedRelationId
    );
    if (scheduleInfoId && scheduleInfoId.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setScheduleInfo(scheduleInfoId.data);
    } else {
      toastError(scheduleInfoId.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(
      error?.scheduleInfoTd?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
