import { TReactSetState, TUseTranslationTfn } from "../../../data/AppType";
import {
  ADD_TRAINER_CERTIFICATE,
  DELETE_TRAINER_CERTIFICATE,
  GET_ALL_TRAINER_CERTIFICATES,
  GET_TRAINER_CERTIFICATE_BY_Id,
  UPDATE_TRAINER_CERTIFICATE_BY_Id,
} from "../../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../../utils/AppConstants";
import {
  prepareMessageFromParams,
  toastError,
  toastSuccess,
} from "../../../utils/AppFunctions";
import * as Yup from "yup";

interface IMedia {
  media_url: string;
}

export interface ITrainerProfileCertificates {
  id: number;
  cert_type: number;
  category_title: string;
  exp_month: number;
  exp_year: number | null;
  app_media: IMedia[];
  cert_image_url: string;
}

export interface ITrainerProfile
  extends Omit<ITrainerProfileCertificates, "id"> {}

export interface IAddITrainerCertificates {
  certificate: {
    media_title: string;
    media_type: string;
    media_url: string;
  };
  cert_type: number;
  exp_month: number;
  exp_year: number | null;
}

export const trainerCertificateValidationSchema = (t: TUseTranslationTfn) => {
  return Yup.object().shape({
    cert_type: Yup.number().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("cert_type")],
      ])
    ),
    exp_month: Yup.number()
      .min(
        1,
        prepareMessageFromParams(t("error_message_min_length"), [
          ["fieldName", t("exp_month")],
          ["min", "1"],
        ])
      )
      .max(
        12,
        prepareMessageFromParams(t("error_message_max_length"), [
          ["fieldName", t("exp_month")],
          ["max", "12"],
        ])
      )
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("exp_month")],
        ])
      ),
    exp_year: Yup.number()
      .min(1975, t("error_message_year"))
      .max(2075, t("error_message_year"))
      .required(
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("exp_Year")],
        ])
      ),
  });
};

export const getTrainerCertificateData = async (
  trainerCertificates: TReactSetState<ITrainerProfileCertificates[]>,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerCertificateList = await GET_ALL_TRAINER_CERTIFICATES();

    if (
      trainerCertificateList &&
      trainerCertificateList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerCertificates(trainerCertificateList.data);
    } else {
      toastError(
        trainerCertificateList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerCertificateList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const getTrainerCertificateById = async (
  trainerCertificates: TReactSetState<ITrainerProfileCertificates>,
  id: number,
  setLoading: TReactSetState<boolean>
) => {
  try {
    setLoading(true);

    const trainerCertificateList = await GET_TRAINER_CERTIFICATE_BY_Id(id);

    if (
      trainerCertificateList &&
      trainerCertificateList.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      trainerCertificates(trainerCertificateList.data);
    } else {
      toastError(
        trainerCertificateList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerCertificateList.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  } finally {
    setLoading(false);
  }
};

export const submitTrainerCertificateData = async (
  trainerCertificateData: IAddITrainerCertificates,
  t: TUseTranslationTfn
) => {
  try {
    const resultTrainerCertificate = await ADD_TRAINER_CERTIFICATE(
      trainerCertificateData
    );

    if (
      resultTrainerCertificate &&
      resultTrainerCertificate.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      toastSuccess(resultTrainerCertificate.message);
    } else {
      toastError(
        resultTrainerCertificate.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerCertificate?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};

export const updateTrainerCertificateData = async (
  trainerCertificateData: IAddITrainerCertificates,
  id: number,
  t: TUseTranslationTfn
) => {
  try {
    const resultTrainerCertificate = await UPDATE_TRAINER_CERTIFICATE_BY_Id(
      trainerCertificateData,
      id
    );

    if (
      resultTrainerCertificate &&
      resultTrainerCertificate.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      toastSuccess(resultTrainerCertificate.message);
    } else {
      toastError(
        resultTrainerCertificate.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(error.response.data.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};

export const deleteTrainerCertificateData = async (
  id: number,
  t: TUseTranslationTfn
) => {
  try {
    const trainerCertificateDelete = await DELETE_TRAINER_CERTIFICATE(id);

    if (
      trainerCertificateDelete &&
      trainerCertificateDelete.code === DEFAULT_STATUS_CODE_SUCCESS
    ) {
      toastSuccess(trainerCertificateDelete.message);
    } else {
      toastError(
        trainerCertificateDelete.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
      );
    }
  } catch (error: any) {
    toastError(
      error?.trainerCertificateDelete?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED
    );
  }
};
