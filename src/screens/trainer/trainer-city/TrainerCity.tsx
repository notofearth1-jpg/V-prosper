import React, { useEffect, useRef, useState } from "react";
import { TReactSetState } from "../../../data/AppType";
import { ITrainerCites } from "../../../services/trainer/TrainerService";
import { useFormik } from "formik";
import { ITrainerDetails } from "../trainerController";
import Select, { GroupBase } from "react-select";
import { IDDL } from "../../../data/AppInterface";
import {
  fetchTrainerCites,
  submitTrainerPreferredLocationDetails,
  trainerLocationValidationSchema,
} from "./TrainerCityController";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { SweetAlertError } from "../../../components/common/sweetAlertError";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { arraysAreEqual } from "../../../utils/AppFunctions";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface ITrainerCity {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerCity: React.FC<ITrainerCity> = ({ setCurrentIndex }) => {
  const [cities, setCities] = useState<IDDL[]>([]);
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [loading, setLoading] = useState(true);
  const userId = localStorageUtils.getUserId();
  const { t } = UseTranslationHook();

  useEffect(() => {
    const fetchData = async () => {
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
      preferred_location: [],
    } as ITrainerCites,
    validationSchema: trainerLocationValidationSchema(t),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      const selectedIds = (
        values.preferred_location as { value: string; label: string }[]
      ).map((option) => parseInt(option.value)); // Convert to number

      const payload = { preferred_location: selectedIds as number[] };

      await submitTrainerPreferredLocationDetails(
        payload as any,
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 3)
      );
      formik.setSubmitting(false);
    },
  });

  const selectedValues = formik.values.preferred_location;

  const [filteredGroupedOptions, setFilteredGroupedOptions] = useState<
    GroupBase<{ value: string; label: string }>[]
  >([]);

  useEffect(() => {
    if (
      trainerDetails &&
      trainerDetails &&
      trainerDetails.preferred_location &&
      cities.length > 0
    ) {
      const selectedOptions = trainerDetails.preferred_location.map(
        (skillId) => ({
          value: String(skillId), // Convert skillId to string
          label:
            cities.find((service) => service.data_value === skillId)
              ?.display_value || "",
        })
      );
      formik.setFieldValue("preferred_location", selectedOptions);
    }
  }, [trainerDetails, cities]);

  const handleSelectChange = (selectedOption: any) => {
    formik.setFieldValue("preferred_location", selectedOption);
  };

  const groupedOptions: GroupBase<{ value: string; label: string }>[] = [
    {
      label: t("select_location_label"),
      options: cities.map((service) => ({
        value: service.data_value.toString(),
        label: service.display_value,
      })),
    },
  ];

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
    // setCurrentIndex((prev) => prev - 1);
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("qa", 2);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    fetchTrainerCites(setCities, setLoading, t);
  }, []);

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
          <div className="grid grid-cols-1 gap-0 lg:gap-5">
            <div className="flex justify-center">
              <div className="w-full">
                <div className="flex items-center justify-between">
                  <ICProgressLine percent={14} strokeWidth={2} />
                  <div className="ml-2">
                    <BackToOverviewButton onClick={backOverview} />
                  </div>
                </div>
                <p className="trainer-font top">
                  {t("which_location_would_you_like")}
                </p>
                <div className="top">
                  {cities && (
                    <Select
                      options={filteredGroupedOptions as GroupBase<never>[]}
                      onChange={handleSelectChange}
                      value={formik.values.preferred_location}
                      isSearchable
                      isMulti
                      placeholder="Select a City..."
                      menuIsOpen
                    />
                  )}
                  {formik.errors.preferred_location ? (
                    <SweetAlertError
                      message={formik.errors.preferred_location as any}
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <div className="buttons p-3 mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase  sm:mr-1 sm:mb-0 mb-2`}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase sm:ml-10`}
              onClick={() => formik.handleSubmit()}
              disabled={formik.isSubmitting}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerCity;
