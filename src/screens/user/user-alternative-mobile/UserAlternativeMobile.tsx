import React, { useEffect, useState } from "react";
import {
  getUserRelation,
  submitAlternativeUserInfo,
  validationSchemaUserAlternativeNumber,
} from "./UserAlternativeMobileController";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { IDDL } from "../../../data/AppInterface";
import Loader from "../../../components/common/Loader";
import { TReactSetState } from "../../../data/AppType";
import ICDropDown from "../../../core-component/ICDropDown";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import ICTextInput from "../../../core-component/ICTextInput";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICButton from "../../../core-component/ICButton";
import ICProgressLine from "../../../core-component/ICProgressLine";
import { editIcon, infoIcon } from "../../../assets/icons/SvgIconList";
import { handleNumericInput } from "../../../utils/AppFunctions";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserAlternativeMobile: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [selectedRelationId, setSelectedRelationId] = useState<number | null>(
    null
  );

  const [relation, setRelation] = useState<IDDL[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<number | null>(1);
  const validationSchema = validationSchemaUserAlternativeNumber(t);
  const [isAlternateVerify, setIsAlternateVerify] = useState(false);
  const [isPrevious, setIsPrevious] = useState(false);

  const initialValues = {
    alternate_phone: localStorageUtils.getAlternatePhone() || "",
    relation_id: parseInt(localStorageUtils.getUserRelation() || "0", 10),
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await submitAlternativeUserInfo(
        { ...values, relation_id: values.relation_id },
        navigate,
        setCurrentIndex,
        isPrevious
      );
      formik.setSubmitting(false);
    },
  });

  const handleOptionClick = (option: string, selected_id: number) => {
    formik.setFieldValue("relation_id", selected_id);
    setSelectedRelationId(selected_id);
  };

  useEffect(() => {
    getUserRelation(setRelation, setLoading, t);
  }, []);

  useEffect(() => {
    const storedRelationId = localStorageUtils.getUserRelation();
    if (storedRelationId) {
      const selectedRelation = relation.find(
        (data) => data.data_value === parseInt(storedRelationId, 10)
      );
      if (selectedRelation) {
        setSelectedRelationId(selectedRelation.data_value);
      }
    }
  }, [relation]);

  // const handelAlternateVerify = () => {
  //   localStorageUtils.setIsAlternateMobileVerify("false");
  //   setIsAlternateVerify(false);
  // };

  // useEffect(() => {
  //   const verifyStatus = localStorageUtils.getIsAlternateMobileVerify();
  //   setIsAlternateVerify(verifyStatus === "true");
  // }, []);

  const previous = async () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  const skipAlternateVerification = () => {
    setCurrentIndex((prevIndex) => prevIndex + 2);
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
          <div className="col-span-12 sm:col-span-9 mt-5">
            <div className="alternate mobile number">
              <ICProgressLine percent={12.5} strokeWidth={2} />
              <div className="top flex justify-between">
                <div>
                  <p className="alt-mobile">{t("alternate_mobile")}</p>
                  <p className="alt-mobile">{t("number")}</p>
                </div>

                <div className="comman-black-text  svg-color flex flex-col items-center justify-center">
                  <p
                    className="skip-btn p-2 cursor"
                    onClick={skipAlternateVerification}
                  >
                    {t("skip")}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="top">
                  <ICDropDown
                    label={t("select_relation")}
                    selected={
                      selectedRelationId ? selectedRelationId : undefined
                    }
                    className={"w-full"}
                    options={relation.map((data, index) => ({
                      label: data.display_value,
                      value: data.data_value,
                    }))}
                    onSelect={(option) =>
                      handleOptionClick(option.label, option.value)
                    }
                    showBlank
                  />
                </div>

                <div className="flex space-x-3 top items-center">
                  <ICDropDown
                    label={t("country")}
                    selected={selectedCountry ? selectedCountry : undefined}
                    options={[
                      {
                        label: "+91",
                        value: 1,
                      },
                    ]}
                    textSpacing="mobile-number-spacing"
                    className={"!w-[60px] mt-[5.5px] "}
                    onSelect={(option) => setSelectedCountry(option.value)}
                    disabled={isAlternateVerify == true ? true : false}
                  />

                  <ICTextInput
                    type="text"
                    textClass="mobile-number-spacing"
                    placeholder={t("alternate_mobile_number")}
                    name="alternate_phone"
                    value={formik.values.alternate_phone}
                    onChange={(event) => {
                      handleNumericInput(event);
                      formik.setFieldValue(
                        "alternate_phone",
                        event.target.value
                          ? Number(event.target.value)
                          : undefined
                      );
                    }}
                    onBlur={formik.handleBlur}
                    // autoFocus
                    // readOnly={isAlternateVerify == true ? true : false}
                  />

                  {/* {isAlternateVerify == true && (
                    <div
                      className="w-10 h-15 svg-color cursor"
                      onClick={handelAlternateVerify}
                    >
                      {editIcon}
                    </div>
                  )} */}
                </div>

                {formik.errors.alternate_phone && (
                  <div className="text-skin-error mt-1">
                    {formik.errors.alternate_phone}
                  </div>
                )}
              </div>
              <div className="top grid grid-cols-12 text-justify space-x-1.5">
                <div className="h-4 w-4 col-span-1">{infoIcon}</div>
                <div className="comman-grey col-span-11">
                  {t("alternative_number_note")}
                </div>
              </div>
            </div>
          </div>

          <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              children={t("previous")}
              className={`uppercase mb-5 sm:!ml-10 !w-full ${
                !formik.isValid || !selectedRelationId
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              disabled={
                !formik.isValid || formik.isSubmitting || !selectedRelationId
              }
              onClick={previous}
            />

            <ICButton
              type="button"
              children={t("next")}
              loading={formik.isSubmitting}
              className={`uppercase !mb-5 sm:!ml-10 !w-full ${
                !formik.isValid || !selectedRelationId
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={
                !formik.isValid || formik.isSubmitting || !selectedRelationId
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default UserAlternativeMobile;
