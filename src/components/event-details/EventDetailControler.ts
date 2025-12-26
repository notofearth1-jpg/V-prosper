import { TReactSetState, TUseTranslationTfn } from "../../data/AppType";
import { IEditUser } from "../../screens/header/profile/EditProfileController";
import { EVENT_REGISTRATION } from "../../services/Endpoints";
import {
  DEFAULT_STATUS_CODE_SUCCESS,
  MESSAGE_UNKNOWN_ERROR_OCCURRED,
} from "../../utils/AppConstants";
import {
  getLocalDate,
  prepareMessageFromParams,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import { SweetAlertError } from "../common/sweetAlertError";

import * as Yup from "yup";

export interface IRegistrationForm {
  event_id: number | null;
  first_name: string;
  last_name: string;
  participant_age: string;
  email_address: string;
  mobile_number?: string;
}

interface IName {
  firstName: string;
  lastName?: string;
}

function splitName(fullName?: string): IName {
  if (!fullName) {
    return { firstName: "", lastName: "" };
  }

  const nameParts = fullName.split(" ");

  if (nameParts.length === 1) {
    return { firstName: nameParts[0] };
  } else {
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
    return { firstName, lastName };
  }
}

function calculateAge(dateString?: string): string | undefined {
  if (!dateString) {
    return;
  }

  const [month, day, year] = dateString.split("/").map(Number);

  const birthDate = new Date(year, month - 1, day);
  const today = getLocalDate();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age.toString();
}

export const initialValuesEventForm = (id: number, userData?: IEditUser) => {
  const { firstName, lastName } = userData?.full_name
    ? splitName(userData.full_name)
    : { firstName: "", lastName: "" };

  return {
    event_id: id,
    first_name: firstName || "",
    last_name: lastName || "",
    participant_age: calculateAge(userData?.dob) || "",
    email_address: userData?.email || "",
    mobile_number: userData?.app_user?.username || undefined,
  };
};

export const registrationFormValidationSchema = (t: TUseTranslationTfn) =>
  Yup.object().shape({
    first_name: Yup.string().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("first_name")],
      ])
    ),
    last_name: Yup.string().required(
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("last_name")],
      ])
    ),
    email_address: Yup.string()
      .test(
        "is-email-or-mobile",
        prepareMessageFromParams(t("error_message_required"), [
          ["fieldName", t("email")],
        ]),
        function (value) {
          const { mobile_number } = this.parent;
          return !!value || !!mobile_number;
        }
      )
      .email(t("error_message_invalid_email")),
    mobile_number: Yup.string().test(
      "is-email-or-mobile",
      prepareMessageFromParams(t("error_message_required"), [
        ["fieldName", t("mobile_number")],
      ]),
      function (value) {
        const { email_address } = this.parent;
        return !!value || !!email_address;
      }
    ),
  });

export const handleSubmitRegistrationForm = async (
  values: IRegistrationForm,
  setShowRegistrationModal: TReactSetState<boolean>
) => {
  try {
    const resultRegistration = await EVENT_REGISTRATION({
      ...values,
      mobile_number: values.mobile_number?.toString(),
    });
    if (resultRegistration.code === DEFAULT_STATUS_CODE_SUCCESS) {
      setShowRegistrationModal(false);
      sweetAlertSuccess(resultRegistration.message);
    } else {
      sweetAlertError(resultRegistration.message);
    }
  } catch (e: any) {
    SweetAlertError(e?.resultBlogs?.message || MESSAGE_UNKNOWN_ERROR_OCCURRED);
  }
};
