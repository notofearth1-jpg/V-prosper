import React, { useEffect, useState } from "react";
import {
  infoIcon,
  pinCodeIcon,
  stateIcon,
} from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICCommonModal from "../../components/common/ICCommonModel";
import { useFormik } from "formik";
import ICDropDown from "../../core-component/ICDropDown";
import ICTextInput from "../../core-component/ICTextInput";
import { IDDL } from "../../data/AppInterface";
import { fetchUserStates } from "../user/user-address/UserAddressController";
import ICButton from "../../core-component/ICButton";
import { useAddressContext } from "../../context/AddressContext";
import { handleNumericInput } from "../../utils/AppFunctions";
import {
  addressModelValidationSchema,
  addUserAddress,
} from "./AddressController";
import { getGeocode } from "../user-location/UserLocation.controller";
import { TReactSetState } from "../../data/AppType";

interface IAddressModelProps {
  modelOpen: boolean;
  setModelOpen: TReactSetState<boolean>;
}

const AddressModel: React.FC<IAddressModelProps> = ({
  modelOpen,
  setModelOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();
  const [state, setState] = useState<IDDL[]>([]);
  const [stateId, setStateId] = useState<number | null>(null);
  const { fetchAddress } = useAddressContext();

  const initialValuesAddress = {
    state_id: "",
    country_id: 1,
    postcode: "",
  };

  const formik = useFormik({
    validationSchema: addressModelValidationSchema(t),
    initialValues: initialValuesAddress,
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const address = `${values.postcode}`;
      const location = await getGeocode(address);

      if (!location) {
        return;
      }

      await addUserAddress(
        {
          ...values,
          state_id: Number(values.state_id),
          latitude: location?.lat,
          longitude: location?.lng,
        },
        setLoading
      );
      fetchAddress();
      handelClear();
    },
  });

  const handelClear = () => {
    formik.setSubmitting(false);
    setModelOpen(false);
    formik.resetForm();
  };

  const handleOptionClick = (selected_id: number) => {
    formik.setFieldValue("state_id", selected_id);
    setStateId(selected_id);
  };

  useEffect(() => {
    fetchUserStates(setState, setLoading);
  }, []);

  const addressContent = (
    <>
      <div className="mt-3 flex">
        <div className="pl-1 w-8 h-8">{stateIcon}</div>
        <div className="ml-6 w-full">
          <ICDropDown
            label={t("select_state")}
            selected={stateId ? stateId : undefined}
            className={"w-full"}
            options={state.map((data, index) => ({
              label: data.display_value,
              value: data.data_value,
            }))}
            onSelect={(option) => handleOptionClick(option.value)}
            errorMessage={
              formik.touched.state_id ? formik.errors.state_id : undefined
            }
            searchable
          />
        </div>
      </div>

      <div className="flex mt-5">
        <ICTextInput
          leading={<div className="w-8 h-8">{pinCodeIcon}</div>}
          type="text"
          placeholder={t("postcode")}
          name="postcode"
          value={formik.values.postcode}
          onChange={(event) => {
            handleNumericInput(event);
            formik.setFieldValue(
              "postcode",
              event.target.value ? event.target.value : undefined
            );
          }}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.postcode ? formik.errors.postcode : undefined
          }
        />
      </div>

      <div className="grid grid-cols-12 text-justify space-x-1.5 top">
        <div className="h-4 w-4 col-span-1">{infoIcon}</div>
        <div className="comman-grey col-span-11">
          <strong>{t("important_notice")}: </strong>
          {t("address_consent")}
          <div className="mt-3">{t("thank_you_for_cooperation")}</div>
        </div>
      </div>

      <div className="mt-5">
        <ICButton
          type="button"
          children={t("add_address")}
          loading={formik.isSubmitting}
          className={`uppercase !mb-2  ${
            !formik.isValid
              ? "cursor-not-allowed comman-disablebtn"
              : "comman-btn"
          }`}
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || formik.isSubmitting}
        />
      </div>
    </>
  );

  return (
    <>
      <ICCommonModal
        title={t("add_address")}
        content={addressContent}
        isModalShow={modelOpen}
        setIsModalShow={setModelOpen}
        handleCloseButton={handelClear}
      />
    </>
  );
};

export default AddressModel;
