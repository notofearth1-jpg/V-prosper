import { serviceMaker } from "..";
import { API_ENDPOINTS } from "../../utils/ApiEndPoint";
import { encryptData } from "../../utils/AppFunctions";

interface IBankInfoPayload {
  beneficiary_name: string;
  beneficiary_account_number: string;
  ifsc_code: string;
  pan_number: string;
}

export const GET_TRAINER_BANK_INFO_BY_TRAINER_ID = (trainerId: number) =>
  serviceMaker(
    API_ENDPOINTS.get_trainer_bank_info_by_trainer_id.url + `/${trainerId}`,
    API_ENDPOINTS.get_trainer_bank_info_by_trainer_id.method
  );

export const SAVE_TRAINER_BANK_INFO = (
  payload: IBankInfoPayload,
  trainerId: number
) =>
  serviceMaker(
    API_ENDPOINTS.save_trainer_bank_info.url + `/${trainerId}`,
    API_ENDPOINTS.save_trainer_bank_info.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );

export const UPDATE_TRAINER_BANK_INFO = (
  payload: IBankInfoPayload,
  trainerBankInfoId: number
) =>
  serviceMaker(
    API_ENDPOINTS.update_trainer_bank_info.url + `/${trainerBankInfoId}`,
    API_ENDPOINTS.update_trainer_bank_info.method,
    { payload: encryptData(JSON.stringify(payload)) }
  );
