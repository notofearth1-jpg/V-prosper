import React, { useEffect, useRef, useState } from "react";
import { crossRemove } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  dateFormat,
  getLocalDate,
  sweetAlertInfo,
} from "../../utils/AppFunctions";

import CustomDatePicker from "../../components/common/CustomDatePicker";
import ICDropDown from "../../core-component/ICDropDown";
import {
  ITrainerAvailForm,
  IServiceScheduleInfo,
  fetchServiceScheduleInfo,
  fetchTrainerAvailabilityById,
  initialValuesTrainerAvailability,
  submitTrainerAvailability,
  trainerAvailabilityValidationSchema,
} from "./TrainerAvailabilityFormController";
import { IDDL } from "../../data/AppInterface";
import { useFormik } from "formik";
import {
  ITrainerAvailability,
  fetchServiceDdl,
  getTrainerApprovedServices,
} from "./TrainerAvailabilityController";
import ICButton from "../../core-component/ICButton";
import ICCommonModal from "../../components/common/ICCommonModel";
import { TReactSetState } from "../../data/AppType";
import { BIT_VALUE } from "../../utils/AppEnumerations";
interface ITrainerAvailabilityFormProps {
  handleClose: (status: boolean) => void;
  trainerAvailabilityToEdit?: ITrainerAvailability;
  showForm: boolean;
  setShowForm: TReactSetState<boolean>;
}

const TrainerAvailabilityFormView: React.FC<ITrainerAvailabilityFormProps> = ({
  handleClose,
  trainerAvailabilityToEdit,
  showForm,
  setShowForm,
}) => {
  const { t } = UseTranslationHook();
  const formRef = useRef<HTMLDivElement>(null);
  const [servicesDdl, setServicesDdl] = useState<IDDL[]>([]);
  const [scheduleInfo, setScheduleInfo] = useState<IServiceScheduleInfo>();
  const [tsInfo, setTSInfo] = useState<ITrainerAvailForm>();
  const [available, setAvailable] = useState<string>(BIT_VALUE.Zero);
  const [initValue, setInitValue] = useState(
    initialValuesTrainerAvailability(tsInfo)
  );
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: trainerAvailabilityValidationSchema(t),
    initialValues: initValue,
    onSubmit: async (values) => {
      if (scheduleInfo?.is_active === BIT_VALUE.One)
        await submitTrainerAvailability(
          { ...values, is_available: available },
          handleClose,
          trainerAvailabilityToEdit?.id
        );
      else {
        sweetAlertInfo(t("inactive_offering"));
      }
    },
  });

  useEffect(() => {
    setInitValue(initialValuesTrainerAvailability(tsInfo));
  }, [tsInfo]);

  useEffect(() => {
    if (formik.values.service_id) {
      fetchServiceScheduleInfo(setScheduleInfo, formik.values.service_id);
    }
  }, [formik.values.service_id]);

  useEffect(() => {
    getTrainerApprovedServices(setServicesDdl);
    if (trainerAvailabilityToEdit) {
      fetchServiceScheduleInfo(
        setScheduleInfo,
        trainerAvailabilityToEdit.service_id
      );
      fetchTrainerAvailabilityById(
        trainerAvailabilityToEdit.id,
        setTSInfo,
        setAvailable
      );
    }
  }, []);
  const handleItemClick = (slot: string, item: string) => {
    const findSlot = formik.values.day_slot_configuration.find(
      (FItem) => FItem.slot === slot && FItem.item === item
    );
    if (findSlot) {
      const filterSlot = formik.values.day_slot_configuration.filter(
        (SItem) => !(SItem.slot === slot && SItem.item === item)
      );
      formik.setFieldValue("day_slot_configuration", filterSlot);
    } else {
      formik.setFieldValue("day_slot_configuration", [
        ...formik.values.day_slot_configuration,
        { slot, item },
      ]);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleClose(false);
      }
    }

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm, handleClose]);

  return (
    <>
      {showForm && (
        <ICCommonModal
          title={t("trainer_availability")}
          content={
            <div className="">
              <div className="space-y-5 ">
                <>
                  {trainerAvailabilityToEdit ? (
                    <div className="flex items-center ">
                      <div className="!font-bold comman-black-tex">
                        {t("service_title")}
                      </div>
                      :
                      <div className="comman-black-text pt-0.5">
                        {trainerAvailabilityToEdit.service_title}
                      </div>
                    </div>
                  ) : (
                    <ICDropDown
                      label={t("select_your_offering")}
                      selected={formik.values.service_id}
                      className={"w-full"}
                      options={servicesDdl.map((data, index) => ({
                        label: data.display_value,
                        value: data.data_value,
                      }))}
                      onSelect={(option) => {
                        formik.setFieldValue("service_id", option.value);
                        formik.setFieldValue("day_slot_configuration", []);
                      }}
                      errorMessage={
                        (formik.touched as { service_id?: string }).service_id
                          ? (formik.errors as { service_id?: string })
                              .service_id
                          : undefined
                      }
                      searchable
                      disabled={trainerAvailabilityToEdit ? true : false}
                    />
                  )}
                </>
                {formik.values.service_id ? (
                  <div className="flex-col  font-medium text-skin-gender space-y-5 ">
                    {scheduleInfo?.service_duration && (
                      <div className="flex space-x-1 items-center">
                        <p className="!font-bold comman-black-text">
                          {t("service_duration")} :
                        </p>{" "}
                        <p className="comman-black-text">
                          {scheduleInfo.service_duration} &nbsp;
                          {scheduleInfo.unit_type_text}
                        </p>
                      </div>
                    )}
                    {scheduleInfo?.session_duration && (
                      <div className="flex space-x-1 items-center">
                        <p className="!font-bold comman-black-text">
                          {t("session_duration")} :
                        </p>
                        <p className="comman-black-text">
                          {scheduleInfo.session_duration}&nbsp;{t("min")}
                        </p>
                      </div>
                    )}
                    <div className="flex space-x-5 items-center">
                      {scheduleInfo?.service_for_gender_label && (
                        <div className="flex space-x-1 items-center">
                          <p className="!font-bold comman-black-text">
                            {t("gender")} :
                          </p>
                          <p className="comman-black-text">
                            {scheduleInfo.service_for_gender_label}
                          </p>
                        </div>
                      )}
                      {scheduleInfo?.is_offline && (
                        <div className="flex space-x-1 items-center">
                          <p className="!font-bold comman-black-text">
                            {t("offline")} :
                          </p>
                          <p className="comman-black-text">
                            {scheduleInfo?.is_offline === BIT_VALUE.One
                              ? `${t("yes")}`
                              : `${t("no")}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {(scheduleInfo?.service_age_min_criteria ||
                      scheduleInfo?.service_age_max_criteria) && (
                      <div className="flex space-x-2 comman-black-text">
                        <p className="!font-bold">{t("age_criteria")} :</p>
                        {scheduleInfo?.service_age_min_criteria && (
                          <p>
                            {t("min")}-{scheduleInfo?.service_age_min_criteria}
                          </p>
                        )}
                        {scheduleInfo?.service_age_max_criteria && (
                          <p>
                            {t("max")}-{scheduleInfo?.service_age_max_criteria}
                          </p>
                        )}
                      </div>
                    )}
                    {scheduleInfo?.is_gender_specific && (
                      <div className="flex space-x-1 items-center">
                        <p className="!font-bold comman-black-text">
                          {t("gender_specific")} :
                        </p>
                        <p className="comman-black-text">
                          {scheduleInfo?.is_gender_specific === BIT_VALUE.One
                            ? `${t("yes")}`
                            : `${t("no")}`}
                        </p>
                      </div>
                    )}
                    {scheduleInfo?.is_peer_to_peer && (
                      <div className="flex space-x-1 items-center">
                        <p className="!font-bold comman-black-text">
                          {t("peer_to_peer")} :
                        </p>
                        <p className="comman-black-text">
                          {scheduleInfo?.is_peer_to_peer === BIT_VALUE.One
                            ? `${t("yes")}`
                            : `${t("no")}`}
                        </p>
                      </div>
                    )}
                    {formik.values.service_id && (
                      <div className="flex space-x-2 items-center">
                        <p className="!font-bold comman-black-text">
                          {t("available")}:
                        </p>
                        <label className="inline-flex items-center me-5 cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={available === BIT_VALUE.One ? true : false}
                            onChange={() =>
                              setAvailable(
                                available === BIT_VALUE.One
                                  ? BIT_VALUE.Zero
                                  : BIT_VALUE.One
                              )
                            }
                          />
                          <div className="relative w-11 h-6  rounded-full peer peer-focus:ring-0 dark:peer-focus:ring-0 bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white  after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-skin-switch-ict"></div>
                        </label>
                      </div>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
                {/* for future use */}
                {/* <div className="lg:flex comman-black-text">
                  <label className="">
                    <h1 className="mt-1 !font-bold">{t("from_date")}</h1>
                    <CustomDatePicker
                      selectedDate={formik.values.from_date}
                      onChange={(date) =>
                        formik.setFieldValue("from_date", date)
                      }
                      showIcon
                      dateFormat={"dd/MM/yyy"}
                      showYearDropdown
                      yearDropdownItemNumber={5}
                      scrollableYearDropdown
                    />
                  </label>

                  {formik.errors.from_date && formik.touched.from_date && (
                    <div className="text-skin-error-message">
                      {JSON.stringify(formik.errors.from_date)}
                    </div>
                  )}
                  <label className=" ">
                    <h1 className="mt-1 font-bold"> {t("to_date")}</h1>
                    <CustomDatePicker
                      showIcon
                      selectedDate={formik.values.to_date}
                      onChange={(date) => formik.setFieldValue("to_date", date)}
                      minDate={formik.values.from_date}
                      dateFormat={"dd/MM/yyy"}
                      showYearDropdown
                      yearDropdownItemNumber={5}
                      scrollableYearDropdown
                    />
                  </label>
                  {formik.errors.to_date && formik.touched.to_date && (
                    <div className="text-skin-error-message">
                      {JSON.stringify(formik.errors.to_date)}{" "}
                    </div>
                  )}
                </div> */}

                {scheduleInfo &&
                  scheduleInfo.service_days &&
                  scheduleInfo.service_days.length > 0 && (
                    <div>
                      <p className="!font-bold comman-black-text">
                        {t("select_available_slots")}
                      </p>
                      <div className="mt-5 border-2 p-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {scheduleInfo?.service_days?.map((slot, index) => (
                          <>
                            {scheduleInfo &&
                              scheduleInfo.slot &&
                              scheduleInfo.slot.length > 0 &&
                              scheduleInfo?.slot?.map((item, itemIndex) => {
                                const isSelected =
                                  formik.values.day_slot_configuration.find(
                                    (selectedSlot1) =>
                                      selectedSlot1.slot === slot &&
                                      selectedSlot1.item === item
                                  );
                                return (
                                  <div
                                    key={`${index}-${itemIndex}`}
                                    onClick={() => handleItemClick(slot, item)}
                                    className={`col-span-1 text-center border p-2 rounded-lg  cursor-pointer gap-2 text-skin-trainer-availability-schedule-info  cursor
                                   ${
                                     isSelected
                                       ? "bg-skin-trainer-availability-schedule-info-selected"
                                       : "bg-skin-trainer-availability-schedule-info-un-selected"
                                   }
                                   `}
                                  >
                                    {`${slot} - ${item}`}
                                  </div>
                                );
                              })}
                          </>
                        ))}
                      </div>
                    </div>
                  )}
                {formik.values.day_slot_configuration &&
                  formik.values.day_slot_configuration.length > 0 && (
                    <div className="flex lg:justify-end ">
                      <ICButton
                        className={`cursor text-skin-trainer px-6 py-3 text-sm font-medium  rounded shadow-[0_4px_9px_-4px_#3b71ca]
                     focus:outline-none !w-full lg:!w-1/4 sm:ml-10 sm:w-1/5 sm:mr-1 sm:mb-0 mb-2 mt-auto comman-btn `}
                        onClick={() => formik.handleSubmit()}
                      >
                        {t("submit")}
                      </ICButton>
                    </div>
                  )}
              </div>
            </div>
          }
          isModalShow={showForm}
          setIsModalShow={setShowForm}
          handleCloseButton={() => handleClose(false)}
        />
      )}
    </>
  );
};

export default TrainerAvailabilityFormView;
