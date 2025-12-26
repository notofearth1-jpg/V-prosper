import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import Loader from "../../../components/common/Loader";
import { TReactSetState } from "../../../data/AppType";
import Select, { GroupBase } from "react-select";
import { IService } from "../../product-services/ProductServiceCategoryController";
import {
  submitTrainerDetails,
  trainerCategoryValidationSchema,
} from "./TrainerCategoryController";
import { ITrainerSkills } from "../../../services/trainer/TrainerService";
import { ITrainerDetails, fetchTrainerDetails } from "../trainerController";
import { useLocation } from "react-router-dom";
import { SweetAlertError } from "../../../components/common/sweetAlertError";
import BackButton from "../../../components/common/BackButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { fetchServiceApi } from "../../product-services/ProductServiceController";
import { arraysAreEqual } from "../../../utils/AppFunctions";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface ITrainerCategory {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerCategory: React.FC<ITrainerCategory> = ({ setCurrentIndex }) => {
  const [servicesData, setServicesData] = useState<IService[]>([]);
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [loading, setLoading] = useState(true);
  const userId = localStorageUtils.getUserId();
  const { t } = UseTranslationHook();

  useEffect(() => {
    const fetchData = async () => {
      fetchServiceApi(setServicesData, setLoading, t);
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setTrainerDetails(updatedDetails);
      }
    };

    fetchData();
  }, []);

  const location = useLocation();

  const updateQueryStringParameter = (
    paramKey: string,
    paramValue: number | string
  ) => {
    const params = new URLSearchParams(location.search);
    params.set(paramKey, String(paramValue));
    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const formik = useFormik({
    initialValues: {
      skill_set: [],
    } as ITrainerSkills,
    validationSchema: trainerCategoryValidationSchema(t),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const selectedIds = values.skill_set.map((option) =>
        parseInt(option.value)
      ); // Convert to number

      const payload = { skill_set: selectedIds as number[] };

      await submitTrainerDetails(
        payload as any,
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 2)
      );
      formik.setSubmitting(false);
    },
  });

  const selectedValues = formik.values.skill_set;

  const [filteredGroupedOptions, setFilteredGroupedOptions] = useState<
    GroupBase<{ value: string; label: string }>[]
  >([]);

  useEffect(() => {
    if (
      trainerDetails &&
      trainerDetails &&
      trainerDetails.skill_set &&
      servicesData.length > 0
    ) {
      const selectedOptions = trainerDetails.skill_set.map((skillId) => ({
        value: String(skillId), // Convert skillId to string
        label:
          servicesData.find((service) => service.id === skillId)
            ?.category_title || "",
      }));
      formik.setFieldValue("skill_set", selectedOptions);
    }
  }, [trainerDetails, servicesData]);

  const handleSelectChange = (selectedOption: any) => {
    formik.setFieldValue("skill_set", selectedOption);
  };

  const groupedOptions: GroupBase<{ value: string; label: string }>[] = [
    {
      label: "Service categories",
      options: servicesData.map((service) => ({
        value: service.id.toString(),
        label: service.category_title,
      })),
    },
  ];

  // Function to compare two arrays of objects for equality

  useEffect(() => {
    const filteredOptions = groupedOptions.map((group) => ({
      ...group,
      options: group.options.filter(
        (option) =>
          !selectedValues.some((selected) => selected.value === option.value)
      ),
    }));

    // Check if the filtered options are different from the previous state before updating
    if (!arraysAreEqual(filteredOptions, filteredGroupedOptions)) {
      setFilteredGroupedOptions(filteredOptions);
    }
  }, [selectedValues, groupedOptions, filteredGroupedOptions]);

  const navigate = useNavigate();

  const privious = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("fa", 1);
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

  return (
    <div className="flex justify-center">
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
            <div className="flex items-center justify-between">
              <ICProgressLine percent={0} strokeWidth={2} />
              <div className="ml-2">
                <BackToOverviewButton onClick={backOverview} />
              </div>
            </div>
            <div className="flex justify-center top">
              <ICImage
                src={require("../../../assets/image/Vector1.png")}
                scaled={false}
                className="rounded-lg"
              />
            </div>
            <div>
              <div className="text-center top">
                <p className="trainer-font">
                  {t("what_offerings_can_you_contribute_in")}
                </p>
              </div>

              <div className="top">
                {servicesData && (
                  <Select
                    options={filteredGroupedOptions as GroupBase<never>[]}
                    onChange={handleSelectChange}
                    value={formik.values.skill_set}
                    isSearchable
                    isMulti
                    minMenuHeight={300}
                    menuPlacement="auto"
                    placeholder="Select a Category..."
                  />
                )}
                {formik.errors.skill_set ? (
                  <SweetAlertError message={formik.errors.skill_set as any} />
                ) : null}
              </div>
            </div>
          </div>
          <div className="buttons mt-4 p-3 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase sm:mr-1 sm:mb-0 mb-2 `}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>
            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase sm:ml-10 mt-auto ${
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

export default TrainerCategory;
