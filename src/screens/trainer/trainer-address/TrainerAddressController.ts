import {
  decryptData,
  prepareMessageFromParams,
  toastError,
} from "../../../utils/AppFunctions";
import * as Yup from "yup";
import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import { ADD_TRAINER_DETAILS } from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import { ITrainerAddress } from "../../../services/trainer/TrainerService";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { ITrainerDetails } from "../trainerController";

export const trainerInitialAddressValues = (
  listTrainerDetails: ITrainerDetails | undefined
) => {
  return {
    type: "address",
    address: {
      address_line_1: listTrainerDetails?.address?.address_line_1 || "",
      address_line_2: listTrainerDetails?.address?.address_line_2 || "",
      address_line_3: listTrainerDetails?.address?.address_line_3 ?  listTrainerDetails?.address?.address_line_3 : undefined,
      city: listTrainerDetails?.address?.city || "",
      state_id: listTrainerDetails?.address?.state_id || 0,
      country_id: 1,
      postcode: listTrainerDetails?.address?.postcode || "",
    },
  };
};

export const trainerAddressValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object({
    address: Yup.object({
      address_line_1: Yup.string()
        .required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("address_line_1")],
          ])
        )
        .max(
          50,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("address_line_1")],
            ["max", "50"],
          ])
        )
        .min(
          2,
          prepareMessageFromParams(t("error_message_min_length"), [
            ["fieldName", t("address_line_1")],
            ["min", "2"],
          ])
        ),

      address_line_2: Yup.string()
        .required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("address_line_2")],
          ])
        )
        .max(
          50,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("address_line_2")],
            ["max", "50"],
          ])
        )
        .min(
          2,
          prepareMessageFromParams(t("error_message_min_length"), [
            ["fieldName", t("address_line_2")],
            ["min", "2"],
          ])
        ),
      // address_line_3: Yup.string()
      //   .required(
      //     prepareMessageFromParams(t("error_message_required"), [
      //       ["fieldName", t("address_line_3")],
      //     ])
      //   )
      //   .max(
      //     50,
      //     prepareMessageFromParams(t("error_message_max_length"), [
      //       ["fieldName", t("address_line_3")],
      //       ["max", "50"],
      //     ])
      //   )
      //   .min(
      //     2,
      //     prepareMessageFromParams(t("error_message_min_length"), [
      //       ["fieldName", t("address_line_3")],
      //       ["min", "2"],
      //     ])
      //   ),

      city: Yup.string()
        .required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("city")],
          ])
        )
        .max(
          50,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("city")],
            ["max", "50"],
          ])
        )
        .min(
          2,
          prepareMessageFromParams(t("error_message_min_length"), [
            ["fieldName", t("city")],
            ["min", "2"],
          ])
        ),

      postcode: Yup.string()
        .required(
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("postcode")],
          ])
        )
        .max(
          50,
          prepareMessageFromParams(t("error_message_max_length"), [
            ["fieldName", t("postcode")],
            ["max", "50"],
          ])
        )
        .min(
          2,
          prepareMessageFromParams(t("error_message_min_length"), [
            ["fieldName", t("postcode")],
            ["min", "2"],
          ])
        ),

      state_id: Yup.number().required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("state")],
        ])
      ),
    }),
  });

export const submitTrainerAddressDetails = async (
  trainerData: ITrainerAddress,
  userId: number,
  setCurrentIndex: TReactSetState<number>,
  t: TUseTranslationTfn,
  successCB: () => void
) => {
  try {
    // Retrieve the existing object from local storage
    const storedDetails = await localStorageUtils.getTrainerDetails();
    let updatedDetails: any = {};

    if (storedDetails) {
      // Parse the stored object
      updatedDetails = JSON.parse(storedDetails);

      if (storedDetails) {
        // Parse the stored object
        updatedDetails = JSON.parse(storedDetails);

        if (storedDetails) {
          // Parse the stored object
          updatedDetails = JSON.parse(storedDetails);

          if (updatedDetails.hasOwnProperty("address")) {
            // If it exists, update its value
            updatedDetails.address = trainerData.address;
          } else {
            // If it doesn't exist, add it to '
            updatedDetails.address = trainerData.address;
          }
        } else {
          // If ' doesn't exist, create it and add 'address'
          updatedDetails = {
            address: trainerData.address,
          };
        }
      }
    }
    // Store the updated object back in local storage
    localStorageUtils.setTrainerDetails(JSON.stringify(updatedDetails));
    const trainerDetails = await ADD_TRAINER_DETAILS(updatedDetails, userId);

    if (trainerDetails && trainerDetails.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      successCB();
    } else {
      const trainerDetailData = JSON.parse(decryptData(trainerDetails?.data))
      toastError(
        trainerDetailData.data[0]?.msg || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (err: any) {
    toastError(err?.response?.data?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
