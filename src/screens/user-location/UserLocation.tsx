import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/common/BackButton";
import {
  addCertificateIcon,
  additionalAddressIcon,
  addressLabel,
  cityIcon,
  editProfileIcon,
  fullArrowDownIcon,
  locationIcon,
  pinCodeIcon,
  stateIcon,
  streetOneIcon,
  streetTwoIcon,
} from "../../assets/icons/SvgIconList";
import {
  IAddress,
  addUserAddress,
  changeDefaultUserAddress,
  deleteUserAddress,
  fetchUserAddress,
  fetchUserAddressById,
  getGeocode,
  updateUserAddress,
  userAddressValidationSchema,
} from "./UserLocation.controller";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICCommonModal from "../../components/common/ICCommonModel";
import { useFormik } from "formik";
import ICDropDown from "../../core-component/ICDropDown";
import ICTextInput from "../../core-component/ICTextInput";
import { IDDL, IDDLCities } from "../../data/AppInterface";
import {
  addressType,
  fetchLocation,
  fetchUserCites,
  fetchUserStates,
  IDefultLocation,
} from "../user/user-address/UserAddressController";
import ICButton from "../../core-component/ICButton";
import Loader from "../../components/common/Loader";
import ICSweetAlertModal from "../../core-component/ICSweetAlertModal";
import { useAddressContext } from "../../context/AddressContext";
import { handleNumericInput } from "../../utils/AppFunctions";
import { BIT_VALUE } from "../../utils/AppEnumerations";

const UserLocation = () => {
  const listInnerRef = useRef<HTMLDivElement>(null);
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [relation, setRelation] = useState<IDDL[]>([]);
  const [selectedRelationId, setSelectedRelationId] = useState<number | null>(
    null
  );
  const [id, setId] = useState<number | null>(null);
  const [addressData, setAddressData] = useState<IAddress | null>(null);
  const [cities, setCities] = useState<IDDLCities[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedAddressType, setSelectedAddressType] = useState("Home");

  useEffect(() => {
    fetchUserAddress(setAddressList, setLoading);
  }, []);

  const [location, setLocation] = useState<IDefultLocation | undefined>();

  const initialValuesAddress = {
    address_line_1:
      addressData?.address_line_1 || location?.address_line_1 || "",
    address_line_2:
      addressData?.address_line_2 || location?.address_line_2 || "",
    address_line_3: addressData?.address_line_3 || "",
    city: addressData?.city || "",
    state_id: addressData?.state_id || "",
    country_id: 1,
    postcode: addressData?.postcode || location?.postcode || "",
    address_label: addressData?.address_label || selectedAddressType,
  };

  const formik = useFormik({
    validationSchema: userAddressValidationSchema(t),
    initialValues: initialValuesAddress,
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const address = `${values.address_line_1}, ${values.city}, ${values.postcode}`;
      const location = await getGeocode(address);

      if (location) {
        const updatedValues: IAddress = {
          ...values,
          state_id: Number(values.state_id),
          latitude: location.lat,
          longitude: location.lng,
        };
      }

      if (id) {
        await updateUserAddress(
          {
            ...values,
            state_id: Number(values.state_id),
            latitude: location?.lat,
            longitude: location?.lng,
          },
          id,
          setLoading
        );
      } else {
        await addUserAddress(
          {
            ...values,
            state_id: Number(values.state_id),
            latitude: location?.lat,
            longitude: location?.lng,
          },
          setLoading
        );
      }
      handelClear();
      fetchAddress();
      await fetchUserAddress(setAddressList, setLoading);
    },
  });

  const handelClear = () => {
    formik.setSubmitting(false);
    setIsBottomDivVisible(false);
    formik.resetForm();
    setSelectedRelationId(null);
    setSelectedCity(null);
    setCities([]);
    setId(null);
    setAddressData(null);
    setSelectedAddressType("Home");
    setLocation(undefined);
  };

  const handleOptionClick = (selected_id: number) => {
    formik.setFieldValue("state_id", selected_id);
    setSelectedRelationId(selected_id);
    formik.setFieldValue("city", "");
    setSelectedCity(null);
  };

  const handleSelectCity = (selected_city: string) => {
    formik.setFieldValue("city", selected_city);
    setSelectedCity(selected_city);
  };

  const handleSelectAddressType = (selected_address_type: string) => {
    formik.setFieldValue("address_label", selected_address_type);
    setSelectedAddressType(selected_address_type);
  };

  useEffect(() => {
    fetchUserStates(setRelation, setLoading);
  }, []);

  const handelEditClick = async (id: number) => {
    await fetchUserAddressById(setAddressData, id, setLoading);
    setId(id);

    setIsBottomDivVisible(true);
  };

  useEffect(() => {
    if (addressData && addressData.state_id) {
      setSelectedRelationId(addressData.state_id);
      setSelectedCity(addressData.city);
    }
  }, [addressData]);

  useEffect(() => {
    if (selectedRelationId) {
      fetchUserCites(setCities, selectedRelationId);
    }
  }, [selectedRelationId]);

  const locationContent = (
    <>
      <div className="mt-3 flex">
        <div className="pl-1 w-8 h-8">{addressLabel}</div>
        <div className="ml-4 w-full">
          <ICDropDown
            label={t("address_label")}
            selected={formik.values.address_label}
            className={"w-full"}
            options={addressType.map((data, index) => ({
              label: data.display_value,
              value: data.data_value,
            }))}
            onSelect={(option) => handleSelectAddressType(option.value)}
            errorMessage={
              formik.touched.address_label && formik.errors.address_label
                ? formik.errors.address_label
                : undefined
            }
          />
        </div>
      </div>
      <div className="flex mt-5">
        <ICTextInput
          leading={<div className="w-6	h-6">{streetOneIcon}</div>}
          placeholder={t("street1_fully_written_out")}
          name="address_line_1"
          value={formik.values.address_line_1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.address_line_1 && formik.errors.address_line_1
              ? formik.errors.address_line_1
              : undefined
          }
        />
      </div>
      <div className="flex mt-5">
        <ICTextInput
          leading={<div className="w-6 h-6">{streetTwoIcon}</div>}
          placeholder={t("street2_fully_written_out")}
          name="address_line_2"
          value={formik.values.address_line_2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.address_line_2
              ? formik.errors.address_line_2
              : undefined
          }
        />
      </div>
      <div className="flex mt-5">
        <ICTextInput
          leading={<div className="w-7 h-7">{additionalAddressIcon}</div>}
          placeholder={t("additional_address")}
          name="address_line_3"
          value={formik.values.address_line_3}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.address_line_3
              ? formik.errors.address_line_3
              : undefined
          }
        />
      </div>
      <div className="mt-5 flex">
        <div className="pl-1 w-8 h-8">{stateIcon}</div>
        <div className="ml-6 w-full">
          <ICDropDown
            label={t("select_state")}
            selected={selectedRelationId ? selectedRelationId : undefined}
            className={"w-full"}
            options={relation.map((data, index) => ({
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
      <div className="mt-5 flex">
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
            errorMessage={formik.touched.city ? formik.errors.city : undefined}
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

      <div className="mt-5">
        <ICButton
          type="button"
          children={t(id ? "update_address" : "add_address")}
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
      <div className="flex items-center justify-center flex-col mt-4">
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
    </>
  );

  const handelDelete = async (id: number) => {
    await deleteUserAddress(id, setLoading);
    await fetchUserAddress(setAddressList, setLoading);
    handelClear();
  };
  const { fetchAddress } = useAddressContext();

  const handelDefaultAddressChange = async (id: number) => {
    await changeDefaultUserAddress({ id: id }, setLoading);
    await fetchUserAddress(setAddressList, setLoading);
    handelClear();
    fetchAddress();
  };

  const getLocation = async () => {
    const data = await fetchLocation(setLoading, t);

    if (!data) {
      return;
    }

    const addressParts = data.formatted_address.split(",");

    let addressLine1 = "";
    let addressLine2 = "";
    let postcode = "";
    let state = "";
    let city = "";

    data.address_components.forEach((item: any) => {
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

    if (!addressLine1 && data.address_components.length > 1) {
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
      await formik.setFieldValue("state_id", foundState.data_value);

      getAllCities = await fetchUserCites(setCities, foundState.data_value);

      if (getAllCities.length > 0) {
        const foundCity = getAllCities.find(
          (cityItem) => cityItem.display_value === city
        );
        if (foundCity) {
          setSelectedCity(foundCity.display_value);
          formik.setFieldValue("city", foundCity.display_value);
        }
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col comman-padding">
          <div className="flex items-center">
            <BackButton />
            <div className="ml-3 comman-black-big">{t("manage_address")}</div>
          </div>
          <div
            className="flex flex-col items-center flex-1 overflow-auto"
            ref={listInnerRef}
          >
            <div className="md:w-3/4 lg:w-1/2 w-full">
              <div
                className="top comman-border p-2 flex items-center cursor"
                onClick={() => {
                  setIsBottomDivVisible(true);
                }}
              >
                <div className="w-10 h-10 theme-bg">{addCertificateIcon}</div>
                <div className="ml-3 comman-black-big">
                  {addressList && addressList.length > 0
                    ? t("add_another_address")
                    : t("add_address")}
                </div>
              </div>
              {addressList && addressList.length > 0 && (
                <>
                  {addressList.map((item, index) => (
                    <div
                      className="top comman-border p-2 cursor"
                      key={index}
                      onClick={() => {
                        item.is_default === BIT_VALUE.Zero &&
                          handelDefaultAddressChange(item.id as number);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {item.address_label && (
                            <p className="comman-black-big !font-semibold mr-2">
                              {item.address_label}
                            </p>
                          )}
                          {item.is_default === "1" && (
                            <p className="comman-border  comman-black-text !text-xs px-2">
                              {t("defult")}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center">
                          <div
                            className="w-5 h-5 cursor"
                            onClick={(e) => {
                              e.stopPropagation();
                              handelEditClick(item.id as number);
                            }}
                          >
                            {editProfileIcon}
                          </div>
                          {item.is_default === BIT_VALUE.Zero && (
                            <div
                              className="w-7 h-7 ml-2 cursor"
                              title={t("delete_tooltip_icon")}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ICSweetAlertModal
                                title={t("delete_address")}
                                text={t("delete_address_confirm")}
                                onConfirm={handelDelete}
                                itemId={item.id}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="comman-black-text mt-2">
                        {item?.address_line_1
                          ? item?.address_line_1 + ","
                          : null}
                        {item?.address_line_2
                          ? item?.address_line_2 + ","
                          : null}
                        {item.address_line_3 ? item.address_line_3 + "," : null}
                        {item?.city ? item?.city + "-" : null} {item?.postcode},
                        {item?.state_name} ,{item?.country_name}
                      </div>
                    </div>
                  ))}
                </>
              )}

              <ICCommonModal
                title={t(
                  id
                    ? "update_address"
                    : addressList && addressList.length > 0
                    ? "add_another_address"
                    : "add_address"
                )}
                content={locationContent}
                isModalShow={isBottomDivVisible}
                setIsModalShow={setIsBottomDivVisible}
                handleCloseButton={handelClear}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserLocation;
