import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../components/common/BackButton";
import Loader from "../../components/common/Loader";
import ICButton from "../../core-component/ICButton";
import {
  addCertificateIcon,
  editProfileIcon,
  linkShareIcon,
} from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  ITrainerAvailability,
  ITrainerMeeting,
  addTrainerMeeting,
  fetchServiceDdl,
  fetchTrainerAvailabilityApi,
  fetchTrainerMeeting,
  handleDeleteTrainerAvailability,
  handleHasTrainerBankInfo,
  trainerMeetingValidationSchema,
} from "./TrainerAvailabilityController";
import {
  dateFormat,
  ensureHttpsUrl,
  getLocalDate,
} from "../../utils/AppFunctions";
import TrainerAvailabilityFormView from "./TrainerAvailabilityFormView";
import ICSweetAlertModal from "../../core-component/ICSweetAlertModal";
import ICDropDown from "../../core-component/ICDropDown";
import { IDDL, IPagination } from "../../data/AppInterface";
import usePaginationHook from "../../hooks/UsePaginationHook";
import { PAGINATION_PER_PAGE_ROWS } from "../../utils/AppConstants";
import { TScrollEvent } from "../../data/AppType";
import NoData from "../../components/common/NoData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { routeTrainer } from "../../routes/RouteTrainer";
import { BIT_VALUE } from "../../utils/AppEnumerations";
import { useFormik } from "formik";
import ICCommonModal from "../../components/common/ICCommonModel";
import ICTextInput from "../../core-component/ICTextInput";
import ShrinkText from "../../components/common/ShrinkText";

const TrainerAvailabilityView = () => {
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const listInnerRef = useRef<HTMLDivElement>(null);
  let timer: NodeJS.Timeout;
  const [loading, setLoading] = useState(true);
  const [trainerAvailabilityList, setTrainerAvailabilityList] = useState<
    ITrainerAvailability[]
  >([]);
  const [trainerAvailabilityToEdit, setTrainerAvailabilityToEdit] =
    useState<ITrainerAvailability>();
  const [showForm, setShowForm] = useState(false);
  const [servicesDdl, setServicesDdl] = useState<IDDL[]>([]);
  const [selectedRelationId, setSelectedRelationId] = useState<number>();
  const [showHistoricalCheck, setShowHistoricalCheckCheck] =
    useState<boolean>();
  const [hasBankInfo, setHasBankInfo] = useState(false);
  const [loadingBankInfoDetails, setLoadingBankInfoDetails] = useState(true);
  const [meetingData, setMeetingData] = useState<ITrainerMeeting | null>(null);
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const { pagination, setPagination } = usePaginationHook({
    pagination: {
      per_page_rows: Number(PAGINATION_PER_PAGE_ROWS.Ten),
      current_page: 1,
      sort_by: "",
      order_by: "ASC",
    },
  });

  useEffect(() => {
    fetchBlog(false, pagination);
    fetchServiceDdl(setServicesDdl);
    handleHasTrainerBankInfo(setHasBankInfo, setLoadingBankInfoDetails);
  }, [selectedRelationId, showHistoricalCheck]);

  const handleCloseForm = (status: boolean) => {
    setShowForm(false);
    if (trainerAvailabilityToEdit) {
      setTrainerAvailabilityToEdit(undefined);
    }
    if (status) {
      fetchBlog(false, pagination);
    }
  };

  const handleDeleteCfm = async (id: number) => {
    const data = await handleDeleteTrainerAvailability(id);
    if (data) {
      fetchBlog(false, pagination);
    }
  };
  const handleOptionClick = (option: string, selectedId: number) => {
    setSelectedRelationId(selectedId);
  };
  const fetchBlog = (append = false, payloadPagination: IPagination) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(async () => {
      fetchTrainerAvailabilityApi(
        setTrainerAvailabilityList,
        setLoading,
        selectedRelationId,
        showHistoricalCheck,
        setPagination,
        payloadPagination,
        trainerAvailabilityList,
        append
      );
    }, 500);
  };

  const onScroll = (event: TScrollEvent) => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;
      if (
        isNearBottom &&
        trainerAvailabilityList &&
        pagination.total_count > trainerAvailabilityList.length
      ) {
        fetchBlog(true, {
          ...pagination,
          current_page: pagination.current_page + 1,
        });

        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = listInnerRef.current;
    if (listInnerElement) {
      listInnerElement.addEventListener(
        "scroll",
        onScroll as unknown as EventListener
      );
      return () => {
        listInnerElement.removeEventListener(
          "scroll",
          onScroll as unknown as EventListener
        );
      };
    }
  }, [pagination]);

  const handleOpenForm = () => {
    if (!hasBankInfo) {
      Swal.fire({
        titleText: t("bank_info"),
        text: t("bank_info_required"),
        showCancelButton: true,
        confirmButtonText: t("add"),
      }).then(function (result) {
        if (result.isConfirmed) {
          navigate(routeTrainer.trainerBankInfo);
        }
      });
    } else {
      setShowForm(true);
    }
  };

  useEffect(() => {
    fetchTrainerMeeting(setMeetingData, setLoading);
  }, []);

  const initialValuesMeeting = {
    meeting_link: meetingData?.meeting_link || "",
  };

  const formik = useFormik({
    validationSchema: trainerMeetingValidationSchema(t),
    initialValues: initialValuesMeeting,
    enableReinitialize: true,
    onSubmit: async (values) => {
      formik.setSubmitting(true);
      await addTrainerMeeting(values, setLoading);
      formik.setSubmitting(false);
      setIsBottomDivVisible(false);
      formik.resetForm();
      await fetchTrainerMeeting(setMeetingData, setLoading);
    },
  });

  const meetingContent = (
    <>
      <div className="flex">
        <ICTextInput
          placeholder={t("meeting_link")}
          name="meeting_link"
          value={formik.values.meeting_link}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          errorMessage={
            formik.touched.meeting_link && formik.errors.meeting_link
              ? formik.errors.meeting_link
              : undefined
          }
        />
      </div>
      <div className="mt-10">
        <ICButton
          type="button"
          children={t(meetingData ? "update_meeting_link" : "add_meeting_link")}
          loading={formik.isSubmitting}
          className={`uppercase !mb-2  ${
            !formik.isValid
              ? "cursor-not-allowed comman-disablebtn"
              : "comman-btn"
          }`}
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || formik.isSubmitting}
        />
      </div>
    </>
  );

  const handelLink = (url: string) => {
    window.open(ensureHttpsUrl(url), "_black");
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col pb-3 overflow-hidden h-svh md:h-[calc(100vh-76px)]">
          <div className="comman-padding ">
            <BackButton />
          </div>
          <div className="flex items-center flex-col flex-1 overflow-hidden">
            <div className="w-11/12 lg:w-1/2 rounded-lg h-full flex flex-col pb-3 bg-skin-grey-bg">
              <div className=" comman-padding space-y-2 ">
                <div className="comman-black-big flex justify-between items-center">
                  <p>{t("my_availability")}</p>
                  <p
                    onClick={() => {
                      setIsBottomDivVisible(true);
                    }}
                    className="cursor skip-btn p-2 comman-blue"
                  >
                    {t("meeting_link")}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="comman-black-big !text-skin-err mr-2">
                    {meetingData ? (
                      <div
                        className="mt-3 cursor flex"
                        onClick={() => {
                          handelLink(meetingData.meeting_link);
                        }}
                      >
                        <div className="flex items-center">
                          <ShrinkText
                            text={meetingData.meeting_link}
                            maxLength={40}
                            className="comman-blue !text-sm"
                          />
                          <div className="size-3 ml-2">{linkShareIcon}</div>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-3">{t("please_add_meeting_link")}</p>
                    )}
                  </div>
                  {/* <div>
                    <ICButton
                      children={t(
                        meetingData ? "update_meeting_link" : "add_meeting_link"
                      )}
                      className="!w-[74px] h-[40px] !p-1"
                      onClick={() => {
                        setIsBottomDivVisible(true);
                      }}
                    />
                  </div> */}
                </div>
                <div className="flex justify-between !mt-5">
                  <div className="w-full">
                    <ICDropDown
                      label={t("select_your_offering")}
                      selected={
                        selectedRelationId ? selectedRelationId : undefined
                      }
                      className={"w-full"}
                      options={servicesDdl.map((data) => ({
                        label: data.display_value,
                        value: data.data_value,
                      }))}
                      onSelect={(option) => {
                        handleOptionClick(option.label, option.value);
                      }}
                      searchable
                      showBlank
                    />
                  </div>

                  <div className="ml-3">
                    {!loadingBankInfoDetails && (
                      <ICButton
                        onClick={handleOpenForm}
                        disabled={!meetingData}
                        className={`!rounded-full !p-0 ${
                          !meetingData
                            ? "cursor-not-allowed comman-disablebtn"
                            : "comman-btn"
                        }`}
                      >
                        <div className="h-8 w-8 rounded-full border">
                          {addCertificateIcon}
                        </div>
                      </ICButton>
                    )}
                  </div>
                </div>
                {/* for future update */}
                {/* <div className="flex ">
                <ICCheckbox
                  id={`checkbox`}
                  name="framework_consent"
                  checked={showHistoricalCheck}
                  onChange={(e) =>
                    setShowHistoricalCheckCheck(e.target.checked)
                  }
                  label={t("show_historical_record")}
                />
              </div> */}
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="overflow-y-scroll flex-1" ref={listInnerRef}>
                  {trainerAvailabilityList &&
                  trainerAvailabilityList.length > 0 ? (
                    trainerAvailabilityList.map((item, index) => {
                      return (
                        <div
                          key={index}
                          className="grid grid-cols-12 mx-3 border-2  mb-3 comman-padding  break-words "
                        >
                          <div className="col-span-12 flex justify-between mb-2">
                            <div>
                              {item.is_available === BIT_VALUE.One ? (
                                <div className="text-skin-payment-successful">
                                  {t("available")}
                                </div>
                              ) : (
                                <div className="text-skin-payment-cancelled">
                                  {t("not_available")}
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-2 items-center">
                              <div
                                className="h-4 w-4 cursor"
                                onClick={() => {
                                  setShowForm(true);
                                  setTrainerAvailabilityToEdit(item);
                                }}
                              >
                                {editProfileIcon}
                              </div>
                              <div
                                className="h-5 w-5 cursor"
                                title={t("delete_tooltip_icon")}
                              >
                                <ICSweetAlertModal
                                  title={t("would_you_like_proceed")}
                                  text={t("your_slot_delete")}
                                  onConfirm={handleDeleteCfm}
                                  itemId={item.id}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-span-4 comman-black-text">
                            {t("services")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            {item.service_title}
                          </div>
                          <div className="col-span-4 comman-black-text">
                            {t("peer_to_peer")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            <p className="comman-black-text">
                              {item?.is_peer_to_peer === BIT_VALUE.One
                                ? `${t("yes")}`
                                : `${t("no")}`}
                            </p>
                          </div>
                          <div className="col-span-4 comman-black-text">
                            {t("gender_specific")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            <p className="comman-black-text">
                              {item?.is_gender_specific === BIT_VALUE.One
                                ? `${t("yes")}`
                                : `${t("no")}`}
                            </p>
                          </div>

                          {/*   for future update */}
                          {/* <div className="col-span-4 comman-black-text">
                          {t("from_date")}
                        </div>
                        <div className="col-span-8 comman-black-text">
                          {dateFormat(getLocalDate(item.start_date))}
                        </div>
                        <div className="col-span-4 comman-black-text">
                          {t("to_date")}
                        </div>
                        <div className="col-span-8 comman-black-text">
                          {dateFormat(getLocalDate(item.end_date))}
                        </div> */}
                          <div className="col-span-4 comman-black-text">
                            {t("services_duration")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            {item.service_duration} {item.unit_type_text}
                          </div>
                          <div className="col-span-4 comman-black-text">
                            {t("session_duration")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            {item.session_duration}&nbsp;{t("min")}
                          </div>
                          <div className="col-span-4 comman-black-text">
                            {t("total_selected_slot")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            {item.total_selected_slot}
                          </div>
                          <div className="col-span-4 comman-black-text">
                            {t("modified_date")}
                          </div>
                          <div className="col-span-8 comman-black-text">
                            {item.modified_date
                              ? dateFormat(getLocalDate(item.modified_date))
                              : "-"}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <NoData title={t("availability")} height={75} width={75} />
                  )}
                </div>
              )}
            </div>
            {showForm && (
              <TrainerAvailabilityFormView
                handleClose={handleCloseForm}
                trainerAvailabilityToEdit={trainerAvailabilityToEdit}
                showForm={showForm}
                setShowForm={setShowForm}
              />
            )}
            {showForm && <div className="model-disable"></div>}

            <ICCommonModal
              title={t(
                meetingData ? "update_meeting_link" : "add_meeting_link"
              )}
              content={meetingContent}
              isModalShow={isBottomDivVisible}
              setIsModalShow={setIsBottomDivVisible}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default TrainerAvailabilityView;
