import React, { useEffect, useState } from "react";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import { ITrainerDetails } from "../trainerController";
import {
  fetchTrainerSkills,
  submitTrainerApplication,
} from "./TrainerReviewApplicationController";
import { IDDL } from "../../../data/AppInterface";
import { fetchTrainerCites } from "../trainer-city/TrainerCityController";
import { fetchUserGender } from "../../user/user-gender/UserGenderController";
import { fetchTrainerHealthApi } from "../tariner-helth/TrainerHealthController";
import Loader from "../../../components/common/Loader";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { APPLICATION_STATUS } from "../../../utils/AppEnumerations";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import { forwordArrow } from "../../../assets/icons/SvgIconList";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerReviewApplication: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [trainerDetails, setTrainerDetails] = useState<
    ITrainerDetails | undefined
  >();
  const [skills, setSkills] = useState<IDDL[]>([]);
  const [cities, setCities] = useState<IDDL[]>([]);
  const [gender, setGender] = useState<IDDL[]>([]);
  const [filteredGender, setFilteredGender] = useState<string>("");
  const [healthQuestion, setHealthQuestion] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(false);
  const keyCode = localStorage.getItem("keyCode");

  const privious = () => {
    setCurrentIndex(2);
  };

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

  useEffect(() => {
    fetchTrainerSkills(setSkills, setLoading, t);
    fetchTrainerCites(setCities, setLoading, t);
    fetchUserGender(setGender, setLoading, t);
    fetchTrainerHealthApi(setHealthQuestion, setLoading, t);
  }, []);

  const filteredSkills = skills.filter((skill) =>
    trainerDetails?.skill_set?.includes(skill.data_value)
  );

  const filteredLocation = cities.filter((skill) =>
    trainerDetails?.preferred_location?.includes(skill.data_value)
  );

  const filteredHealthQuestions = healthQuestion.filter((question) =>
    trainerDetails?.health_questionnaire.some(
      (answer) => answer.question_id === question.data_value
    )
  );

  useEffect(() => {
    if (trainerDetails?.gender !== undefined) {
      const filteredGenderData = gender.find(
        (g) => g.data_value === trainerDetails.gender
      );
      setFilteredGender(
        filteredGenderData ? filteredGenderData.display_value : ""
      );
    }
  }, [trainerDetails?.gender, gender]);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 3);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const navigate = useNavigate();

  const initialValues = {
    status: APPLICATION_STATUS.SubmittedForReview,
  };

  const trainerId = localStorageUtils.getTrainerId();
  const applicationID = localStorageUtils.getApplicationId();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,

    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitTrainerApplication(values, Number(trainerId), navigate, t);
      formik.setSubmitting(false);
    },
  });

  return (
    <div className="flex justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="h-auto flex flex-col xl:w-1/2">
          {trainerDetails && (
            <div className="grid grid-cols-1 lg:grid-cols-1">
              <div className="!text-2xl !font-bold comman-black-big flex items-center">
                <p>
                  {t("review_application")} - {applicationID}
                </p>
              </div>

              <div className="review-helth top">
                <div className="comman-black-lg">
                  <p>{t("your_expertise")}</p>
                </div>
                {filteredSkills && filteredSkills.length > 0 && (
                  <div className="mt-2 recent-container flex flex-wrap">
                    {filteredSkills.map((skill, index) => (
                      <div
                        key={index}
                        className="recent-box flex items-center justify-center m-1"
                      >
                        <p className="comman-grey mx-2">
                          {skill.display_value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
                <div className="comman-black-lg top">
                  <p>{t("location_you_like")}</p>
                </div>
                {filteredLocation && filteredLocation.length > 0 && (
                  <div className="mt-2 recent-container flex flex-wrap">
                    {filteredLocation.map((skill, index) => (
                      <div
                        key={index}
                        className="recent-box flex items-center justify-center m-1"
                      >
                        <p className="comman-grey mx-2">
                          {skill.display_value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="review-helth top">
                {trainerDetails.address && (
                  <div className="flex">
                    <div className="comman-black-lg">
                      <p>{t("address")}:</p>
                    </div>
                    <div className="ml-2 comman-grey mt-1">
                      {trainerDetails?.address?.address_line_1} ,
                      {trainerDetails?.address?.address_line_2},
                      {trainerDetails?.address?.address_line_3},
                      {trainerDetails?.address?.city}-
                      {trainerDetails?.address?.postcode}
                    </div>
                  </div>
                )}
                {trainerDetails.gender && (
                  <div className="w-full flex mt-2">
                    <div className="flex items-center">
                      <p className="comman-black-lg">{t("gender")}:</p>
                      <p className="ml-2 comman-grey">{filteredGender}</p>
                    </div>
                  </div>
                )}
                {trainerDetails.dob && (
                  <div className="w-full flex mt-2">
                    <div className="flex items-center ">
                      <p className="comman-black-lg">{t("dob")}:</p>
                      <p className="ml-2 comman-grey">{trainerDetails?.dob}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="review-helth mt-2 top">
                <div className=" comman-black-lg">
                  <p>{t("health_details")}</p>
                </div>
                {filteredHealthQuestions.map((question, index) => {
                  const correspondingAnswer =
                    trainerDetails?.health_questionnaire.find(
                      (answer) => answer.question_id === question.data_value
                    );

                  return (
                    <div key={index}>
                      <div className="comman-question-text mt-2">
                        <p className="question ">{question.display_value}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="h-10 w-10 svg-color">
                          {forwordArrow}
                        </div>
                        <p className="answer ml-2 comman-grey">
                          {correspondingAnswer?.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="review-helth top">
                <div className="mt-2">
                  <p className="comman-black-lg">{t("would_you_like")}</p>

                  <div className="flex items-center">
                    <div className="h-10 w-10">{forwordArrow}</div>
                    <p className="answer ml-2 comman-grey">
                      {trainerDetails?.is_marketing_partner
                        ? t("yes")
                        : t("no")}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="comman-black-lg">{t("would_you_have")}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10">{forwordArrow}</div>
                    <p className="answer ml-2 comman-grey">
                      {trainerDetails?.has_own_session_space
                        ? t("yes")
                        : t("no")}
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="comman-black-lg">{t("rent_space")}</p>
                  <div className="flex items-center">
                    <div className="h-10 w-10">{forwordArrow}</div>
                    <p className="answer ml-2 comman-grey">
                      {trainerDetails?.has_space_for_rent ? t("yes") : t("no")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <div className="review-helth top flex items-center justify-center">
                  {trainerDetails?.identity_document_image_url && (
                    <div className="image w-full">
                      <p className="comman-black-lg">{t("identity_proof")}</p>
                      <div>
                        <ICImage
                          imageUrl={trainerDetails?.identity_document_image_url}
                          scaled={false}
                          className="rounded-lg w-full"
                          isPrivate
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="review-helth top flex items-center justify-center">
                  {trainerDetails?.address_document_image_url && (
                    <div className="image w-full">
                      <p className="comman-black-lg">{t("address_proof")}</p>
                      <div>
                        <ICImage
                          imageUrl={trainerDetails?.address_document_image_url}
                          scaled={false}
                          className="rounded-lg w-full"
                          isPrivate
                        />
                      </div>
                    </div>
                  )}
                </div>
                {trainerDetails?.keycode_document_url && (
                  <div className="top review-helth mb-2 flex items-center justify-center">
                    <div className="image w-full">
                      <p className="comman-black-lg">
                        {t("keyCode")} : {keyCode}
                      </p>
                      <div>
                        <ICImage
                          imageUrl={trainerDetails?.keycode_document_url}
                          scaled={false}
                          className="rounded-lg w-full"
                          isPrivate
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {trainerDetails.certificates &&
                trainerDetails.certificates.length > 0 && (
                  <div className="top review-helth">
                    <p className="comman-black-lg">{t("certificates")}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {trainerDetails.certificates.map((img, index) => (
                        <div
                          key={index}
                          className="flex justify-center items-center"
                        >
                          <ICImage
                            imageUrl={img?.certificate_image_url}
                            scaled={false}
                            className="rounded-lg w-full"
                            isPrivate
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <div className="buttons flex p-3 flex-col sm:flex-row w-full items-center justify-center">
                <ICButton
                  type="button"
                  className={`uppercase sm:mr-1 sm:mb-0`}
                  onClick={privious}
                >
                  {t("edit")}
                </ICButton>

                <ICButton
                  type="button"
                  children={t("submit")}
                  loading={formik.isSubmitting}
                  className={`uppercase sm:ml-10 !mt-2 md:!mt-0`}
                  onClick={() => formik.handleSubmit()}
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TrainerReviewApplication;
