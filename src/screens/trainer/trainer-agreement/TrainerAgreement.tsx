import React, { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import { TReactSetState } from "../../../data/AppType";
import { useFormik } from "formik";
import {
  ITrainerAggrementValue,
  fetchTrainerAggrement,
  initialAgreementValues,
  submitTrainerAgreementDetails,
} from "./TrainerAgreementController";
import { ITrainerDetails, fetchTrainerDetails } from "../trainerController";
import BackButton from "../../../components/common/BackButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import {
  SYSTEM_CONFIGURATION_KEYS,
  TRAINER_ON_BOARD,
} from "../../../utils/AppEnumerations";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import ICCheckbox from "../../../core-component/ICCheckbox";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import ICCommonModal from "../../../components/common/ICCommonModel";
import CustomEditor from "../../product-services/Web/CustomEditor";
import { useLocation } from "react-router-dom";

interface ITrainerAgreement {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerAgreement: React.FC<ITrainerAgreement> = ({ setCurrentIndex }) => {
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [trainerAllDetails, setTrainerAllDetails] = useState<
    ITrainerDetails | undefined
  >();

  const [loading, setLoading] = useState(true);
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const userId = localStorageUtils.getUserId();
  const location = useLocation();

  const [trainerAggrementData, setTrainerAggrementData] = useState<
    ITrainerAggrementValue | undefined
  >();

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
    initialValues: initialAgreementValues(trainerDetails),
    enableReinitialize: true,
    onSubmit: async (values) => {
      let overview_section_status;

      if (
        trainerDetails?.overview_section_status &&
        Array.isArray(trainerDetails.overview_section_status.completed) &&
        trainerDetails.overview_section_status.completed.length === 4 &&
        trainerDetails.overview_section_status.completed.every(
          (value, index) => value === index + 1
        ) &&
        Array.isArray(trainerDetails.overview_section_status.in_progress)
      ) {
        overview_section_status = {
          completed: trainerDetails.overview_section_status.completed,
          in_progress: trainerDetails.overview_section_status.in_progress,
        };
      } else {
        overview_section_status = {
          completed: [1],
          in_progress: [2],
        };
      }

      await submitTrainerAgreementDetails(
        { ...values, overview_section_status },
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("qa", 1)
      );
      await fetchTrainerDetails(
        setTrainerAllDetails,
        Number(userId),
        setLoading,
        t
      );
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      fetchTrainerDetails(setTrainerAllDetails, Number(userId), setLoading, t);
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setTrainerDetails(updatedDetails);
      }
    };
    fetchData();
  }, []);

  if (trainerAllDetails) {
    const serializedDetails = JSON.stringify(trainerDetails);
    localStorageUtils.setTrainerDetails(serializedDetails);
  }

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
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
    fetchTrainerAggrement(
      setTrainerAggrementData,
      setLoading,
      SYSTEM_CONFIGURATION_KEYS.FrameworkAgreement
    );
  }, []);

  const trainerAggrement = (
    <div>
      {trainerAggrementData && trainerAggrementData.config_value && (
        <CustomEditor serviceDesc={trainerAggrementData.config_value} />
      )}
    </div>
  );

  return (
    <div className="flex justify-center">
      <div
        ref={mainBgRef}
        className={`${
          isFullHeight ? "h-[96vh]" : "h-auto"
        } xl:w-1/2 flex flex-col justify-between`}
      >
        <div className="grid grid-cols-1 gap-0 lg:gap-5">
          <div className="flex justify-between items-center">
            <BackButton />
            <BackToOverviewButton onClick={backOverview} />
          </div>
          <div className="flex justify-center">
            <ICImage
              src={require("../../../assets/image/aggrement.png")}
              scaled={false}
              className="rounded-lg"
            />
          </div>
          <div>
            <div className="text-center top">
              <p className="trainer-font">{t("framework_agreement")}</p>
            </div>

            <div className="text-center top">
              <p className="comman-SubFont">{t("sign_framework_agreement")}</p>
            </div>

            <div className="top">
              <p className="comman-SubFont">
                <strong>{t("please_note_that")}</strong>{" "}
                {t("our_framework_agreement")}
              </p>
            </div>

            <div className="top">
              <div className="flex items-center mb-4">
                <ICCheckbox
                  id={`checkbox`}
                  name="framework_consent"
                  checked={formik.values.framework_consent}
                  onChange={formik.handleChange}
                  labelComponent={
                    <p className="inline-flex">{t("agree_to_sign")}</p>
                  }
                />
                <p
                  className="mx-2 comman-blue cursor"
                  onClick={() => setIsBottomDivVisible(true)}
                >
                  {t("framework_agreement")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ICCommonModal
          title={
            trainerAggrementData?.user_friendly_name
              ? trainerAggrementData?.user_friendly_name
              : t("framework_agreement")
          }
          content={trainerAggrement}
          isModalShow={isBottomDivVisible}
          setIsModalShow={setIsBottomDivVisible}
        />
        <div className="buttons p-3 mt-4 flex flex-col sm:flex-row items-center justify-center">
          <ICButton
            type="button"
            className={`uppercase sm:ml-10${
              !formik.values.framework_consent
                ? "cursor-not-allowed comman-disablebtn"
                : "comman-btn"
            }`}
            onClick={() => formik.handleSubmit()}
            disabled={!formik.values.framework_consent}
          >
            {t("get_started")}
          </ICButton>
        </div>
      </div>
    </div>
  );
};

export default TrainerAgreement;
