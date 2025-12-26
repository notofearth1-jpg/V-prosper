import React, { useEffect, useState } from "react";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  addGrievance,
  addGrievanceValidationSchema,
  fetchBookingListApi,
  IAddGrievance,
  IGrievanceBooking,
  initialGrievanceValues,
  updateGrievance,
} from "./grievanceController";
import { useFormik } from "formik";
import ICTextInput from "../../core-component/ICTextInput";
import ICFormikTextArea from "../../components/formik-input/ICFormikTextIArea";
import ICButton from "../../core-component/ICButton";
import ICCheckbox from "../../core-component/ICCheckbox";
import ICDropDown from "../../core-component/ICDropDown";
import {
  prepareMessageFromParams,
  trailingDotAddition,
} from "../../utils/AppFunctions";

const AddUpdateGrievance = () => {
  const [loading, setLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const location = useLocation();
  const isUpdate = location?.state?.id ? true : false;
  const [bookings, setBookings] = useState<IGrievanceBooking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState(0);

  useEffect(() => {
    setIsBooking(location?.state?.booking_id ? true : false);
    handleSelectedBooking(
      location?.state?.booking_id ? location?.state?.booking_id : 0
    );
  }, [bookings]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...initialGrievanceValues,
      complaint_detail: location?.state?.complaint_detail,
      complaint_title: location?.state?.complaint_title,
      booking_id: location?.state?.booking_id,
    },
    validationSchema: addGrievanceValidationSchema(t),

    onSubmit: async (values) => {
      const payload: IAddGrievance = {
        complaint_title: formik.values.complaint_title,
        complaint_detail: formik.values.complaint_detail,
        booking_id: formik.values.booking_id,
      };
      if (isBooking && (selectedBooking === 0 || !selectedBooking)) {
        formik.setFieldError(
          "booking_id",
          prepareMessageFromParams(t("error_message_required"), [
            ["fieldName", t("booking")],
          ])
        );
        return;
      }
      isUpdate
        ? await updateGrievance(
            setLoading,
            navigate,
            t,
            payload,
            location?.state?.id
          )
        : await addGrievance(setLoading, navigate, t, payload);
    },
  });

  const handleSelectedBooking = (selected_id: number) => {
    formik.setFieldValue("booking_id", selected_id === 0 ? null : selected_id);
    setSelectedBooking(selected_id);
  };

  useEffect(() => {
    fetchBookingListApi(setLoading, setBookings, bookings);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding overflow-scroll h-svh">
          <div>
            <BackButton />
          </div>
          <div className="md:flex md:justify-center">
            <div className="min-w-full md:min-w-96 ">
              <div className="flex justify-center items-center">
                <p className="comman-black-big">
                  {isUpdate ? t("update_grievance") : t("add_grievance")}
                </p>
                <div></div>
              </div>
              <div className="top edit-container m-4">
                <div className="top">
                  <ICTextInput
                    placeholder={t("complaint_title")}
                    name="complaint_title"
                    value={formik.values.complaint_title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                      formik.touched.complaint_title
                        ? formik.errors.complaint_title
                        : undefined
                    }
                  />
                </div>
                <div className="top">
                  <ICFormikTextArea
                    {...formik}
                    name={"complaint_detail"}
                    placeholder={t("complaint_detail")}
                  />
                </div>
                <div className="top">
                  <ICCheckbox
                    onChange={() => {
                      setIsBooking(!isBooking);
                      handleSelectedBooking(0);
                    }}
                    label="Is this related to any Booking?"
                    checked={isBooking}
                  />
                </div>
                {isBooking ? (
                  <div className="top">
                    <ICDropDown
                      onSelect={(book) => handleSelectedBooking(book.value)}
                      label={t("select_booking")}
                      selected={selectedBooking ? selectedBooking : undefined}
                      options={bookings.map((data, index) => ({
                        label: trailingDotAddition(
                          data?.service_title + ", " + data?.schedule_date,
                          46
                        ),
                        value: data.id,
                      }))}
                    />
                    {formik.errors.booking_id ? (
                      <div className="text-red-400">
                        {prepareMessageFromParams(t("error_message_required"), [
                          ["fieldName", t("booking")],
                        ])}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <div className="w-full mt-4">
                  <ICButton
                    ClassName="w-full cursor"
                    onClick={() => formik.handleSubmit()}
                  >
                    {isUpdate ? t("update") : t("submit")}
                  </ICButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUpdateGrievance;
