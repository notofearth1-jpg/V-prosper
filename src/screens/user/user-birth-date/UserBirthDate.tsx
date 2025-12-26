import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import { Line } from "rc-progress";
import ReactDatePicker from "react-datepicker";
// it is use for future
// import "../../../style/ReactDatePicker.css"
import moment from "moment";
import { submitUserBirthDate } from "./UserBirthDateCotroller";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ICButton from "../../../core-component/ICButton";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICProgressLine from "../../../core-component/ICProgressLine";
interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const UserBirthDate: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isPrevious, setIsPrevious] = useState(false);

  const initialValuesBirthDate = {
    type: "dob",
    value: startDate ? moment(startDate).format("DD/MM/YYYY") : null,
  };
  const formik = useFormik({
    initialValues: initialValuesBirthDate,

    onSubmit: async (values) => {
      !isPrevious ? formik.setSubmitting(true) : formik.setSubmitting(false);
      await submitUserBirthDate(
        {
          ...values,
          value: startDate ? moment(startDate).format("DD/MM/YYYY") : "",
        },
        navigate,
        setCurrentIndex,
        t,
        isPrevious
      );
      formik.setSubmitting(false);
    },
  });

  const previous = () => {
    setIsPrevious(true);
    formik.handleSubmit();
  };

  useEffect(() => {
    const storedType = localStorageUtils.getUserBirthDayType();
    const storedValue = localStorageUtils.getUserBirthDayValue();
    if (storedType && storedValue) {
      setStartDate(moment(storedValue, "DD/MM/YYYY").toDate());
      formik.setValues({
        type: storedType,
        value: storedValue,
      });
    }
  }, []);

  return (
    <>
      <div className="h-[95vh] flex flex-col justify-between max-w-[500px] w-full">
        <div className="">
          <div className=" mt-5">
            <div className="birth-date">
              <ICProgressLine percent={50} strokeWidth={2} />
              <div className="top">
                <p className="alt-mobile">{t("when_you_born")}</p>
              </div>
              <div className="top">
                <ReactDatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  open
                  showMonthDropdown
                  peekNextMonth
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="buttons mt-4 flex flex-col sm:flex-row items-center justify-center">
          <ICButton
            type="button"
            children={t("previous")}
            className={`uppercase mb-5 sm:!ml-10 !w-full ${
              !startDate || formik.isSubmitting
                ? "cursor-not-allowed comman-disablebtn"
                : "comman-btn"
            }`}
            disabled={!startDate || formik.isSubmitting}
            onClick={previous}
          />

          <ICButton
            type="button"
            children={t("next")}
            loading={formik.isSubmitting}
            className={`uppercase mb-5 sm:!ml-10 !w-full ${
              !startDate || formik.isSubmitting
                ? "cursor-not-allowed comman-disablebtn"
                : "comman-btn"
            }`}
            onClick={() => formik.handleSubmit()}
            disabled={!startDate || formik.isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

export default UserBirthDate;
