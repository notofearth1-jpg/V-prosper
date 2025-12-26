import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import {
  initialBirthDateValues,
  submitTrainerBirthDetails,
} from "./TrainerBirthDateController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { getLocalDate } from "../../../utils/AppFunctions";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import { TRAINER_ON_BOARD } from "../../../utils/AppEnumerations";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerBirthDate: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const userId = localStorageUtils.getUserId();
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
    enableReinitialize: true,
    initialValues: initialBirthDateValues(startDate),
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitTrainerBirthDetails(
        {
          ...values,
          dob: startDate ? moment(startDate).format("DD/MM/YYYY") : "",
        },
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 6)
      );
      formik.setSubmitting(false);
    },
  });

  const navigate = useNavigate();

  const privious = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("qa", 5);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setStartDate(moment(updatedDetails.dob, "DD/MM/YYYY").toDate());
      } else {
        setStartDate(getLocalDate());
      }
    };

    fetchData();
  }, []);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  return (
    <div className="md:flex md:justify-center">
      <div
        ref={mainBgRef}
        className={`${
          isFullHeight ? "h-[96vh]" : "h-auto"
        } xl:w-1/2 flex flex-col justify-between`}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="">
            <div className="birth-date">
              <div className="flex items-center justify-between">
                <ICProgressLine percent={56} strokeWidth={2} />
                <div className="ml-2">
                  <BackToOverviewButton onClick={backOverview} />
                </div>
              </div>
              <div className="top">
                <p className="trainer-font">{t("when_you_born")}</p>
              </div>
              <div className="top">
                {startDate && (
                  <ReactDatePicker
                    showIcon
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showMonthDropdown
                    peekNextMonth
                    showYearDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                    maxDate={getLocalDate()}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="buttons p-3 flex flex-col sm:flex-row w-full items-center justify-center">
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
            className={`uppercase sm:ml-10`}
            onClick={() => formik.handleSubmit()}
            disabled={formik.isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default TrainerBirthDate;
