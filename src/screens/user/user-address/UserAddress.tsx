import { useEffect, useState } from "react";
import {
  IDefultLocation,
  ILocationType,
  addressType,
  addressValidationSchema,
  fetchLocation,
  fetchUserCites,
  fetchUserStates,
  submitUserAddressInfo,
} from "./UserAddressController";
import { useFormik } from "formik";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { IDDL, IDDLCities } from "../../../data/AppInterface";
import {
  additionalAddressIcon,
  addressLabel,
  arrowDownIcon,
  cityIcon,
  downArrowIcon,
  downChevronIcon,
  fullArrowDownIcon,
  locationIcon,
  pinCodeIcon,
  stateIcon,
  streetOneIcon,
  streetTwoIcon,
} from "../../../assets/icons/SvgIconList";
import { TReactSetState } from "../../../data/AppType";
import ICTextInput from "../../../core-component/ICTextInput";
import ICDropDown from "../../../core-component/ICDropDown";
import ICButton from "../../../core-component/ICButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICProgressLine from "../../../core-component/ICProgressLine";
import {
  IAddress,
  getGeocode,
} from "../../user-location/UserLocation.controller";
import { handleNumericInput } from "../../../utils/AppFunctions";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserAddress: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [location, setLocation] = useState<IDefultLocation | undefined>();
  const [loading, setLoading] = useState(true);
  const [relation, setRelation] = useState<IDDL[]>([]);
  const [cities, setCities] = useState<IDDLCities[]>([]);
  const [selectedRelationId, setSelectedRelationId] = useState<number | null>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isPrevious, setIsPrevious] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState<string | null>(
    null
  );

  const initialValuesAddress = {
    type: "address",
    value: {
      address_line_1:
        localStorageUtils.getUserAddressLine1() ||
        location?.address_line_1 ||
        "",
      address_line_2:
        localStorageUtils.getUserAddressLine2() ||
        location?.address_line_2 ||
        "",
      address_line_3:
        localStorageUtils.getUserAddressLine3() == "undefined"
          ? undefined
          : localStorageUtils.getUserAddressLine3() || undefined,
      city: localStorageUtils.getUserCity() || "",
      state_id: localStorageUtils.getUserStateId()
        ? parseInt(localStorageUtils.getUserStateId() || "0", 10)
        : null,
      country_id: 1,
      postcode: localStorageUtils.getUserPostCode() || location?.postcode || "",
      address_label: localStorageUtils.getAddressLabel() || "Home",
    },
  };

  const formik = useFormik({
    validationSchema: addressValidationSchema(t),
    enableReinitialize: true,
    initialValues: initialValuesAddress,
    onSubmit: async (values) => {
      !isPrevious ? formik.setSubmitting(true) : formik.setSubmitting(false);
      let location;

      const address = `${values.value.address_line_1}, ${values.value.city}, ${values.value.postcode}`;
      location = await getGeocode(address);

      await submitUserAddressInfo(
        {
          ...values,
          value: {
            ...values.value,
            state_id: values.value.state_id,
            postcode: values.value.postcode.toString(),
            address_line_3: values.value.address_line_3
              ? values.value.address_line_3
              : undefined,
            latitude: location?.lat,
            longitude: location?.lng,
          },
        },
        setCurrentIndex,
        isPrevious
      );
      formik.setSubmitting(false);
    },
  });

  const handleOptionClick = (selected_id: number) => {
    formik.setFieldValue("value.state_id", selected_id);
    setSelectedRelationId(selected_id);
    formik.setFieldValue("value.city", "");
    setSelectedCity(null);
  };

  const handleSelectCity = (selected_city: string) => {
    formik.setFieldValue("value.city", selected_city);
    setSelectedCity(selected_city);
  };

  const handleSelectAddressType = (selected_address_type: string) => {
    formik.setFieldValue("value.address_label", selected_address_type);
    setSelectedAddressType(selected_address_type);
  };

  const previous = async () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  useEffect(() => {
    const storedRelationId = localStorageUtils.getUserStateId();
    const city = localStorageUtils.getUserCity();
    const addressLabel = localStorageUtils.getAddressLabel();

    if (storedRelationId) {
      const selectedRelation = relation.find(
        (data) => data.data_value === parseInt(storedRelationId, 10)
      );

      if (selectedRelation) {
        setSelectedRelationId(selectedRelation.data_value);
      }
    }
    setSelectedCity(city);
    setSelectedAddressType(addressLabel ? addressLabel : "Home");
  }, [relation]);

  useEffect(() => {
    fetchUserStates(setRelation, setLoading);
  }, []);

  useEffect(() => {
    if (selectedRelationId) {
      fetchUserCites(setCities, selectedRelationId);
    }
  }, [selectedRelationId]);

  const getLocation = async () => {
    const data = await fetchLocation(setLoading, t);

    if (!data) {
      return;
    }

    const addressParts = data?.formatted_address?.split(",");

    let addressLine1 = "";
    let addressLine2 = "";
    let postcode = "";
    let state = "";
    let city = "";

    if (data) {
      data?.address_components.forEach((item: any) => {
        if (item.types.includes("route")) {
          addressLine1 = item.long_name;
        } else if (
          item.types.includes("sublocality") ||
          item.types.includes("sublocality_level_1") ||
          item.types.includes("sublocality_level_2")
        ) {
          addressLine2 = addressLine2
            ? addressLine2 + ", " + item.long_name
            : item.long_name;
        } else if (item.types.includes("postal_code")) {
          postcode = item.long_name;
        } else if (item.types.includes("administrative_area_level_1")) {
          state = item.long_name;
        } else if (item.types.includes("locality")) {
          city = item.long_name;
        }
      });
    }

    if (!addressLine1 && data?.address_components.length > 1) {
      addressLine1 = addressParts[0].trim() + "," + addressParts[1].trim();
    }

    const location = {
      address_line_1: addressLine1,
      address_line_2: addressLine2,
      postcode: postcode,
      state: state,
      city: city,
    };

    setLocation(location);

    let getAllCities: IDDL[];
    let getStates: IDDL[];

    getStates = await fetchUserStates(setRelation, setLoading);
    const foundState = getStates.find(
      (stateItem) => stateItem.display_value === state
    );

    if (foundState) {
      setSelectedRelationId(foundState.data_value);
      await formik.setFieldValue("value.state_id", foundState.data_value);

      getAllCities = await fetchUserCites(setCities, foundState.data_value);

      if (getAllCities.length > 0) {
        const foundCity = getAllCities.find(
          (cityItem) => cityItem.display_value === city
        );
        if (foundCity) {
          setSelectedCity(foundCity.display_value);
          await formik.setFieldValue("value.city", foundCity.display_value);
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
          <div className="">
            <div className=" mt-5">
              <div className="Address">
                <ICProgressLine percent={25} strokeWidth={2} />
                <div className="top">
                  <p className="alt-mobile">
                    {t("whats_your_registration_address")}
                  </p>
                </div>
                <div className="top">
                  <div className="mt-3 flex">
                    <div className="pl-1 w-8 h-8">{addressLabel}</div>
                    <div className="ml-4 w-full">
                      <ICDropDown
                        label={t("address_label")}
                        selected={
                          selectedAddressType ? selectedAddressType : undefined
                        }
                        className={"w-full"}
                        options={addressType.map((data, index) => ({
                          label: data.display_value,
                          value: data.data_value,
                        }))}
                        onSelect={(option) =>
                          handleSelectAddressType(option.value)
                        }
                        errorMessage={
                          formik.touched.value?.address_label &&
                          formik.errors.value?.address_label
                            ? formik.errors.value?.address_label
                            : undefined
                        }
                      />
                    </div>
                  </div>
                  <div className="flex mt-3">
                    <ICTextInput
                      leading={<div className="w-6	h-6">{streetOneIcon}</div>}
                      placeholder={t("street1_fully_written_out")}
                      name="value.address_line_1"
                      value={formik.values.value.address_line_1}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched.value?.address_line_1 &&
                        formik.errors.value?.address_line_1
                          ? formik.errors.value?.address_line_1
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex mt-3">
                    <ICTextInput
                      leading={<div className="w-6 h-6">{streetTwoIcon}</div>}
                      placeholder={t("street2_fully_written_out")}
                      name="value.address_line_2"
                      value={formik.values.value.address_line_2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched.value?.address_line_2
                          ? formik.errors.value?.address_line_2
                          : undefined
                      }
                    />
                  </div>
                  <div className="flex mt-3">
                    <ICTextInput
                      leading={
                        <div className="w-7 h-7">{additionalAddressIcon}</div>
                      }
                      placeholder={t("additional_address")}
                      name="value.address_line_3"
                      value={formik.values.value.address_line_3}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched.value?.address_line_3
                          ? formik.errors.value?.address_line_3
                          : undefined
                      }
                    />
                  </div>
                  <div className="mt-3 flex">
                    <div className="pl-1 w-8 h-8">{stateIcon}</div>
                    <div className="ml-6 w-full">
                      <ICDropDown
                        label={t("select_state")}
                        selected={
                          selectedRelationId ? selectedRelationId : undefined
                        }
                        className={"w-full"}
                        options={relation.map((data, index) => ({
                          label: data.display_value,
                          value: data.data_value,
                        }))}
                        onSelect={(option) => handleOptionClick(option.value)}
                        errorMessage={
                          formik.touched.value?.state_id
                            ? formik.errors.value?.state_id
                            : undefined
                        }
                        searchable
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex">
                    <div className="pl-1 w-8 h-8">{cityIcon}</div>
                    <div className="ml-6 w-full">
                      <ICDropDown
                        label={t("city")}
                        selected={selectedCity ? selectedCity : undefined}
                        className={"w-full"}
                        options={cities.map((data, index) => ({
                          label: data.display_value,
                          value: data.data_value,
                        }))}
                        onSelect={(option) => handleSelectCity(option.value)}
                        errorMessage={
                          formik.touched.value?.city
                            ? formik.errors.value?.city
                            : undefined
                        }
                        searchable
                      />
                    </div>
                  </div>

                  <div className="flex mt-3">
                    <ICTextInput
                      type="text"
                      leading={<div className="w-8 h-8">{pinCodeIcon}</div>}
                      placeholder={t("postcode")}
                      name="value.postcode"
                      value={formik.values.value.postcode}
                      onChange={(event) => {
                        handleNumericInput(event);
                        formik.setFieldValue(
                          "value.postcode",
                          event.target.value ? event.target.value : ""
                        );
                      }}
                      onBlur={formik.handleBlur}
                      errorMessage={
                        formik.touched.value?.postcode
                          ? formik.errors.value?.postcode
                          : undefined
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center flex-col">
            <div className="comman-black-big !font-bold ">
              {t("click_here_auto_fill")}
            </div>
            <div className="h-10 w-10 animate-bounce svg-color mt-2">
              {fullArrowDownIcon}
            </div>
            <div
              className="h-16 w-16 bg-main-primary rounded-full p-2 cursor"
              onClick={() => {
                getLocation();
              }}
            >
              {locationIcon}
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase mb-5 
               !w-full `}
              onClick={previous}
            />

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase mb-5 sm:!ml-10 !w-full ${
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
    </>
  );
};

export default UserAddress;
