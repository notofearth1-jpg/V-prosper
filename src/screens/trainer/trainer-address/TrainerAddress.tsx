import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { IDDL, IDDLCities } from "../../../data/AppInterface";
import {
  additionalAddressIcon,
  cityIcon,
  pinCodeIcon,
  stateIcon,
  streetOneIcon,
  streetTwoIcon,
} from "../../../assets/icons/SvgIconList";
import { TReactSetState } from "../../../data/AppType";
import {
  fetchUserCites,
  fetchUserStates,
} from "../../user/user-address/UserAddressController";
import { ITrainerDetails } from "../trainerController";
import {
  submitTrainerAddressDetails,
  trainerAddressValidationSchema,
  trainerInitialAddressValues,
} from "./TrainerAddressController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import ICTextInput from "../../../core-component/ICTextInput";
import ICDropDown from "../../../core-component/ICDropDown";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerAddress: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(true);
  const [relation, setRelation] = useState<IDDL[]>([]);
  const [cities, setCities] = useState<IDDLCities[]>([]);
  const [selectedOption, setSelectedOption] = useState<number>();
  const [listTrainerDetails, setListTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const userId = localStorageUtils.getUserId();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const locationData = useLocation();

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(locationData.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const formik = useFormik({
    validationSchema: trainerAddressValidationSchema(t),
    initialValues: trainerInitialAddressValues(listTrainerDetails),
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      await submitTrainerAddressDetails(
        values,
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 4)
      );
      formik.setSubmitting(false);
    },
  });

  const handleOptionClick = (selected_id: number) => {
    formik.setFieldValue("address.state_id", selected_id);
    setSelectedOption(selected_id);
    formik.setFieldValue("address.city", "");
    setSelectedCity(null);
  };

  const handleSelectCity = (option: string, selected_city: string) => {
    formik.setFieldValue("address.city", selected_city);
    setSelectedCity(selected_city);
  };

  useEffect(() => {
    const storedRelationId = listTrainerDetails?.address?.state_id;
    const city = listTrainerDetails?.address?.city || "";

    if (storedRelationId) {
      const selectedRelation = relation.find(
        (data) => data.data_value === storedRelationId
      );

      if (selectedRelation) {
        setSelectedOption(selectedRelation.data_value);
      }
    }
    setSelectedCity(city);
  }, [relation]);

  useEffect(() => {
    const fetchData = async () => {
      fetchUserStates(setRelation, setLoading);

      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setListTrainerDetails(updatedDetails);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();

  const privious = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("qa", 3);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  useEffect(() => {
    if (selectedOption) {
      fetchUserCites(setCities, selectedOption);
    }
  }, [selectedOption]);

  return (
    <div className="md:flex md:justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`${
            isFullHeight ? "h-[96vh]" : "h-auto"
          } xl:w-1/2 flex flex-col justify-between`}
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="">
              <div className="Address">
                <div className="flex items-center justify-between">
                  <ICProgressLine percent={28} strokeWidth={2} />
                  <div className="ml-2">
                    <BackToOverviewButton onClick={backOverview} />
                  </div>
                </div>
                <div className="top">
                  <p className="trainer-font">
                    {t("whats_your_registration_address")}
                  </p>
                </div>
                <div className="top">
                  <ICTextInput
                    leading={<div className="w-6 h-6">{streetOneIcon}</div>}
                    placeholder={t("street1_fully_written_out")}
                    name="address.address_line_1"
                    value={formik.values.address.address_line_1}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                      formik.touched?.address?.address_line_1
                        ? formik.errors.address?.address_line_1
                        : undefined
                    }
                  />
                  <div className=" mt-5">
                    <ICTextInput
                      leading={<div className="w-6 h-6 ">{streetTwoIcon}</div>}
                      placeholder={t("street2_fully_written_out")}
                      name="address.address_line_2"
                      value={formik.values.address.address_line_2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched?.address?.address_line_2
                          ? formik.errors.address?.address_line_2
                          : undefined
                      }
                    />
                  </div>
                  <div className="mt-5">
                    <ICTextInput
                      leading={
                        <div className="w-6 h-6">{additionalAddressIcon}</div>
                      }
                      placeholder={t("additional_address")}
                      name="address.address_line_3"
                      value={formik.values.address.address_line_3}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched?.address?.address_line_3
                          ? formik.errors.address?.address_line_3
                          : undefined
                      }
                    />
                  </div>

                  <div className="flex space-x-5 mt-5">
                    <div className="w-6	h-6">{stateIcon}</div>
                    <div className="w-full">
                      <ICDropDown
                        label={t("select_state")}
                        selected={selectedOption ? selectedOption : undefined}
                        options={relation.map((data, index) => ({
                          label: data.display_value,
                          value: data.data_value,
                        }))}
                        onSelect={(option) => handleOptionClick(option.value)}
                        errorMessage={
                          formik.touched.address?.state_id
                            ? formik.errors.address?.state_id
                            : undefined
                        }
                        searchable
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex">
                    <div className="pl-1 w-8 h-8">{cityIcon}</div>
                    <div className="ml-3 w-full">
                      <ICDropDown
                        label={t("city")}
                        selected={selectedCity ? selectedCity : undefined}
                        className={"w-full"}
                        options={cities.map((data, index) => ({
                          label: data.display_value,
                          value: data.data_value,
                        }))}
                        onSelect={(option) =>
                          handleSelectCity(option.label, option.value)
                        }
                        errorMessage={
                          formik.touched?.address?.city
                            ? formik.errors.address?.city
                            : undefined
                        }
                        searchable
                      />
                    </div>
                  </div>

                  <div className="flex mt-5">
                    <ICTextInput
                      leading={<div className="w-6 h-6">{pinCodeIcon}</div>}
                      placeholder={t("postcode")}
                      name="address.postcode"
                      value={formik.values.address.postcode}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched?.address?.postcode
                          ? formik.errors.address?.postcode
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="buttons p-3 mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase sm:mr-1 sm:mb-0 mb-2`}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase sm:ml-10 ${
                !formik.isValid
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={!formik.isValid || formik.isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAddress;
