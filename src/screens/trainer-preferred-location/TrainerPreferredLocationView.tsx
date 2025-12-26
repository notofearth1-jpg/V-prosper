import React, { useEffect, useState } from "react";
import { addCertificateIcon, deleteIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICButton from "../../core-component/ICButton";
import ICDropDownMultiSelect from "../../core-component/ICDropDownMultiSelect";
import { useFormik } from "formik";
import {
  ITrainerPreferredLocations,
  ITrainerRemainingLocations,
  addTrainerPreferredLocationApi,
  deleteTrainerPreferredLocationApi,
  fetchRemainingTrainerPreferredLocationsApi,
  fetchTrainerPreferredLocationsApi,
  initialValuesLocation,
} from "./TrainerPreferredLocationController";
import Loader from "../../components/common/Loader";
import { ISelectOptionType } from "../../data/AppType";
import BackButton from "../../components/common/BackButton";
import ICCustomModal from "../../components/common/ICCustomModal";
import ShrinkText from "../../components/common/ShrinkText";
import NoData from "../../components/common/NoData";
import { useTrainerLocationContext } from "../../context/TrainerDefaultLocationContext";

interface ILocationsValues {
  value: number;
  label: string;
}

interface ITransformedOption {
  value: ILocationsValues[];
}

const TrainerPreferredLocationView = () => {
  const { t } = UseTranslationHook();
  const [trainerSelectedLocationList, setTrainerSelectedLocationList] =
    useState<ITrainerPreferredLocations[]>([]);
  const [remainingLocationList, setRemainingLocationList] = useState<
    ITrainerRemainingLocations[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bufferLoading, setBufferLoading] = useState<boolean>(false);
  const [selectedLocationValue, setSelectedLocationValue] = useState<number>();
  const [showAddPreferredLocationModal, setShowAddPreferredLocationModal] =
    useState(false);
  const { fetchTrainerLocation } = useTrainerLocationContext();

  useEffect(() => {
    if (showAddPreferredLocationModal) {
      fetchRemainingTrainerPreferredLocationsApi(
        setRemainingLocationList,
        setLoading
      );
    }
    fetchLocations();
  }, [showAddPreferredLocationModal]);

  const fetchLocations = async () => {
    await fetchTrainerPreferredLocationsApi(
      setTrainerSelectedLocationList,
      setSelectedLocationValue,
      setLoading
    );
  };

  const handleOnchangeLocation = async (id: number) => {
    setSelectedLocationValue(id);
    const locationIds: number[] = trainerSelectedLocationList.map(
      (item) => item.location_id
    );
    const payLoad = { location_ids: locationIds, dl: id };
    await addTrainerPreferredLocationApi(setBufferLoading, payLoad, true, t);
    fetchTrainerLocation();
  };

  const formik = useFormik<ITransformedOption>({
    initialValues: initialValuesLocation,

    onSubmit: async (values) => {
      if (values.value.length === 0) return;
      const locationIds: number[] = values.value.map((item) => item.value);
      const payLoad = { location_ids: locationIds };
      await addTrainerPreferredLocationApi(setBufferLoading, payLoad, false, t);
      setShowAddPreferredLocationModal(false);
      formik.resetForm();
    },
  });

  const transformLocationsToOptions = (
    locations: ITrainerRemainingLocations[]
  ) => {
    return locations.map((location) => ({
      value: location.id,
      label: location.city_name,
    }));
  };

  const groupedOptions = [
    {
      label: t("locations"),
      options: transformLocationsToOptions(remainingLocationList),
    },
  ];

  const handleDeleteLocation = async (id: number) => {
    await deleteTrainerPreferredLocationApi(setLoading, id);
    fetchLocations();
  };

  const handleEditClick = () => {
    setShowAddPreferredLocationModal(true);
  };

  const handleSelectChange = (option: unknown) => {
    const selectedOptions = option as ISelectOptionType[];
    formik.setFieldValue("value", selectedOptions);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-78px)] flex flex-col">
          <div className="">
            <BackButton />
          </div>
          <div className="flex justify-center flex-1 overflow-y-scroll remove-scrollbar-width">
            <div className=" min-w-full md:min-w-96">
              <div className="mb-2 pb-2 flex justify-between">
                <div className="comman-black-lg flex items-center ">
                  {t("preferred_location")}
                </div>
                <div className="mr-0 md:mr-4">
                  <ICButton
                    className="!rounded-full !p-0"
                    onClick={handleEditClick}
                  >
                    <div className="h-8 w-8 cursor-pointer rounded-full border">
                      {addCertificateIcon}
                    </div>
                  </ICButton>
                </div>
              </div>
              <div>
                {trainerSelectedLocationList &&
                trainerSelectedLocationList.length > 0 ? (
                  trainerSelectedLocationList.map((val, index) => (
                    <div
                      className=" my-4 flex flex-col md:min-w-96 rounded-xl bg-clip-border"
                      key={index}
                    >
                      <div className="flex min-w-full md:min-w-96 flex-col">
                        <div
                          className=" h-12 flex items-center w-full booking-info !py-1 !pl-4 !pr-1 leading-tight transition-all 
                        rounded-lg outline-none text-start hover:bg-skin-hover-color-list hover:bg-opacity-80"
                        >
                          <input
                            className="cursor"
                            id={val.location_id.toString()}
                            type="radio"
                            value={val.location_id.toString()}
                            checked={selectedLocationValue === val.location_id}
                            onChange={() =>
                              handleOnchangeLocation(val.location_id)
                            }
                          />
                          <label
                            htmlFor={val.location_id.toString()}
                            className="ms-2 comman-black-text"
                          >
                            <ShrinkText
                              text={val.location_name}
                              maxLength={17}
                            />
                          </label>
                          {selectedLocationValue !== val.location_id && (
                            <div className="grid ml-auto place-items-center justify-self-end ">
                              <div
                                className="h-5 w-5 cursor-pointer"
                                onClick={() => handleDeleteLocation(val.id)}
                              >
                                {deleteIcon}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <NoData
                    title={t("preferred_location")}
                    height={100}
                    width={100}
                  />
                )}
              </div>
              {showAddPreferredLocationModal && (
                <ICCustomModal
                  title={t("select_locations")}
                  content={
                    <div className="top">
                      <div>
                        <ICDropDownMultiSelect
                          isMulti
                          options={groupedOptions}
                          onChange={handleSelectChange}
                          value={formik.values.value}
                          isSearchable
                          menuIsOpen
                          maxMenuHeight={500}
                          placeholder={t("select_locations")}
                        />
                      </div>
                    </div>
                  }
                  buttonTitle={t("submit")}
                  isModalShow={showAddPreferredLocationModal}
                  setIsModalShow={setShowAddPreferredLocationModal}
                  handleSubmitButton={() => formik.handleSubmit()}
                  disabled={formik.values.value.length === 0}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerPreferredLocationView;
