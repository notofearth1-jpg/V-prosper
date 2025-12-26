import { NavigateFunction } from "react-router-dom";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { GET_TRAINER_KEYCODE_BY_ID } from "../../../services/trainer/TrainerService";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { sweetAlertError, toastError } from "../../../utils/AppFunctions";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { userRoute } from "../../../routes/RouteUser";

export interface ITrainerKeycode {
  keycode: string;
  keycode_expiry_seconds: number;
}

export const fetchTrainerKeycode = async (
  setTrainerDetails: TReactSetState<ITrainerKeycode | undefined>,
  userId: number,
  setLoading: TReactSetState<boolean>,
  navigation: NavigateFunction,
  t: TUseTranslationTfn
) => {
  try {
    setLoading(true);
    const trainerDetails = await GET_TRAINER_KEYCODE_BY_ID(userId);
    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setTrainerDetails(trainerDetails.data);
      localStorageUtils.setTrainerKeyCode(trainerDetails.data.keycode);
    } else {
      sweetAlertError(trainerDetails.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
      navigation(userRoute.home);
    }
  } catch (error: any) {
    toastError(
      error?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};
