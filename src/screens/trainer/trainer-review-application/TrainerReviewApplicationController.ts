import { NavigateFunction } from "react-router-dom";
import { IDDL } from "../../../data/AppInterface";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_TRAINER_APPLICATION,
  GLOBAL_DROP_DOWN,
} from "../../../services/Endpoints";

import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { sweetAlertSuccess, toastError } from "../../../utils/AppFunctions";
import { ITrainerStatus } from "../../../services/trainer/TrainerService";
import { userRoute } from "../../../routes/RouteUser";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";

export const fetchTrainerSkills = async (
  setRelationData: TReactSetState<IDDL[]>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);

    const payload = {
      entity: "service_category",
      data_value: "id",
      display_value: "category_title",
      filters: [
        {
          field: "is_active",
          value: "1",
        },
      ],
    };

    const resultDdl = await GLOBAL_DROP_DOWN(payload);

    if (resultDdl && resultDdl.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setRelationData(resultDdl.data);
    } else {
      toastError(resultDdl.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  } finally {
    setLoading(false);
  }
};

export const submitTrainerApplication = async (
  trainerSatus: ITrainerStatus,
  userId: number,
  navigation: NavigateFunction,
  t: TUseTranslationTfn
) => {
  try {
    const trainerDetails = await ADD_TRAINER_APPLICATION(trainerSatus, userId);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      sweetAlertSuccess(t("your_application_submitted"));
      navigation(userRoute.home);
      localStorageUtils.removeTrainerDetail();
    } else {
      toastError(trainerDetails.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
    }
  } catch (err: any) {
    toastError(err.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
