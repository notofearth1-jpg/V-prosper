import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import Loader from "../../components/common/Loader";
import {
  ITrainerRemainingService,
  ITrainerService,
  addTrainerPreferredLocationApi,
  deleteTrainerPreferredServiceCategoryApi,
  fetchRemainingServiceCategoryApi,
  fetchTrainerPreferredServicesApi,
} from "./TrainerPreferredServiceController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICButton from "../../core-component/ICButton";
import ICDropDownMultiSelect from "../../core-component/ICDropDownMultiSelect";
import {
  addCertificateIcon,
  crossRemove,
  deleteIcon,
} from "../../assets/icons/SvgIconList";
import { ISelectOptionType } from "../../data/AppType";
import BackButton from "../../components/common/BackButton";
import NoData from "../../components/common/NoData";
import ICCommonModal from "../../components/common/ICCommonModel";

interface IOptionValues {
  value: number;
  label: string;
}

interface ITransformedOption {
  value: IOptionValues[];
}

const TrainerPreferredServiceView: React.FC = () => {
  const { t } = UseTranslationHook();
  const [trainerServicesList, setTrainerServicesList] = useState<
    ITrainerService[]
  >([]);
  const [remainingServiceList, setRemainingServiceList] = useState<
    ITrainerRemainingService[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAddPreferredServiceModal, setShowAddPreferredServiceModal] =
    useState(false);

  useEffect(() => {
    fetchTrainerService();
    if (showAddPreferredServiceModal) {
      fetchRemainingServiceCategoryApi(setRemainingServiceList, setIsLoading);
    }
  }, [showAddPreferredServiceModal]);

  const fetchTrainerService = () => {
    fetchTrainerPreferredServicesApi(setTrainerServicesList, setLoading);
  };

  const initialValuesService: ITransformedOption = {
    value: [],
  };

  const formik = useFormik<ITransformedOption>({
    initialValues: initialValuesService,
    onSubmit: async (values) => {
      if (values.value.length === 0) return;
      const serviceIds: number[] = values.value.map((item) => item.value);
      const payLoad = { serviceCategoryIds: serviceIds };
      await addTrainerPreferredLocationApi(setLoading, payLoad);
      handleCancelClick();
      formik.resetForm();
    },
  });

  const handleDeleteService = async (id: number) => {
    await deleteTrainerPreferredServiceCategoryApi(id, setLoading);
    fetchTrainerService();
  };

  const transformServiceToOptions = (services: ITrainerRemainingService[]) => {
    return services?.map((service) => ({
      value: service.id,
      label: service.category_title,
    }));
  };

  const groupedOptions = [
    {
      label: t("select_service_category"),
      options: transformServiceToOptions(remainingServiceList),
    },
  ];

  const handleEditClick = () => {
    setShowAddPreferredServiceModal(true);
  };

  const handleCancelClick = () => {
    setShowAddPreferredServiceModal(false);
  };

  const handleSelectChange = (newValue: unknown) => {
    const selectedOptions = newValue as ISelectOptionType[];
    formik.setFieldValue("value", selectedOptions);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
          <div>
            <BackButton />
          </div>
          <div className="flex items-center flex-col flex-1 overflow-y-scroll remove-scrollbar-width">
            <div className="min-w-full md:min-w-96 ">
              <div className="my-2 flex justify-between">
                <div className="comman-black-lg flex items-center">
                  {t("preferred_service_category")}
                </div>
                {/* for future use */}
                {/* <div className="mr-0 md:mr-4">
                  <ICButton
                    className="!rounded-full !p-0"
                    onClick={handleEditClick}
                  >
                    <div className="h-8 w-8 cursor-pointer rounded-full border">
                      {addCertificateIcon}
                    </div>
                  </ICButton>
                </div> */}
              </div>

              {trainerServicesList && trainerServicesList.length > 0 ? (
                trainerServicesList.map((val, index) => (
                  <div
                    className="my-4 flex flex-col md:min-w-96 rounded-xl bg-clip-border"
                    key={index}
                  >
                    <div className="flex min-w-full md:min-w-96 flex-col">
                      <div
                        className="flex items-center w-full booking-info !py-1 !pl-4 !pr-1 leading-tight 
                        transition-all rounded-lg outline-none comman-black-text"
                      >
                        {val.category_title}
                        <div className="grid ml-auto place-items-center justify-self-end ">
                          <div
                            className="relative h-10 max-h-[40px] w-10 max-w-[40px] select-none rounded-lg text-center align-middle transition-all cursor-pointer"
                            onClick={() => handleDeleteService(val.id)}
                          >
                            <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 h-5 w-5">
                              {deleteIcon}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[80vh]">
                  <NoData
                    title={t("preferred_service_category")}
                    height={100}
                    width={100}
                  />
                </div>
              )}
              {showAddPreferredServiceModal && (
                <ICCommonModal
                  title={t("select_services")}
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
                          maxMenuHeight={300}
                          placeholder={t("select_services")}
                        />
                      </div>
                      <div className="fixed left-0 bottom-4 comman-padding w-full">
                        <ICButton
                          className={` ${
                            formik.values.value.length === 0
                              ? "cursor-not-allowed comman-disablebtn"
                              : ""
                          }`}
                          onClick={() => formik.handleSubmit()}
                          disabled={!formik.isValid}
                        >
                          {t("submit")}
                        </ICButton>
                      </div>
                    </div>
                  }
                  isModalShow={true}
                  setIsModalShow={setShowAddPreferredServiceModal}
                  handleCloseButton={() =>
                    setShowAddPreferredServiceModal(false)
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerPreferredServiceView;
