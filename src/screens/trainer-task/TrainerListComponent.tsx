import React, { useEffect, useState } from "react";
import {
  calculateDaysLeft,
  convertTimeStringToTime,
  dateFormat,
  ensureHttpsUrl,
  getLocalDate,
} from "../../utils/AppFunctions";
import {
  ISession,
  endOfflineSession,
  isDateBetween,
  resendSessionOtp,
  startOfflineSession,
} from "./TrainerTaskController";
import {
  FILE_UPLOAD_TYPE,
  IMAGE_TYPE,
  IS_OFFLINE,
  IS_OFFLINE_VALUES,
} from "../../utils/AppEnumerations";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { useNavigate } from "react-router-dom";
import ICCustomModal from "../../components/common/ICCustomModal";
import { fetchUploadImageService } from "../image-service/ImageServices";
import ICOtpInput from "../../core-component/ICOtpInput";
import ICTextArea from "../../core-component/ICTextArea";
import ICFileUpload from "../../core-component/ICFileUpload";
import { routeTrainer } from "../../routes/RouteTrainer";
import { IPagination } from "../../data/AppInterface";
import NoData from "../../components/common/NoData";
import SessionJoinButton from "./SessionJoinButton";
import Timer from "../../core-component/ICTimer";
import { calculateEndTime } from "../booking/BookingController";

interface ITrainerListComponent {
  sessionList: ISession[];
  fetchSession: (
    isAppend: boolean,
    paginationPayload: IPagination,
    showHistorical: boolean
  ) => void;
  showHistorical: boolean;
  pagination: IPagination;
}

const TrainerListComponent: React.FC<ITrainerListComponent> = ({
  sessionList,
  fetchSession,
  showHistorical,
  pagination,
}) => {
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showEndModel, setShowEndModel] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<number>(0);
  const [otpValue, setOtpValue] = useState("");
  const [note, setNote] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const handleOtpChange = (otp: string) => {
    setOtpValue(otp);
  };
  const trainerOfflineDetails = (
    <div className="flex flex-col items-center justify-center">
      <div>
        <ICOtpInput value={otpValue} onChange={handleOtpChange} numInputs={4} />
      </div>
      <div className="mt-4">
        <Timer
          initialTime="0:30"
          maxResends={3}
          onResend={() => resendSessionOtp(sessionId)}
        />
      </div>
    </div>
  );

  const handleNote = (e: any) => {
    setNote(e.target.value);
  };

  const trainerEndOfflineDetails = (
    <div>
      <ICTextArea
        name={"notes"}
        placeholder={t("notes")}
        value={note}
        onChange={handleNote}
      />
      <div className="top">
        <ICFileUpload
          title={t("upload_other_files")}
          maxFiles={2}
          maxFileSizeMB={20}
          acceptedFileTypes={[
            FILE_UPLOAD_TYPE.Jpg,
            FILE_UPLOAD_TYPE.Png,
            FILE_UPLOAD_TYPE.Jpeg,
            FILE_UPLOAD_TYPE.Video,
          ]}
          onFilesSelected={setSelectedFiles}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </div>
    </div>
  );

  const uploadEndSessionContent = async () => {
    let updateEndSessionContent = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const formData = new FormData();
      formData.append(`myImageFile`, selectedFiles[i]);
      formData.append("type", IMAGE_TYPE.Session);
      const mediaUrl = await fetchUploadImageService(formData);
      const newMediaItem = {
        media_type: selectedFiles[i].type.startsWith("image") ? "i" : "v",
        media_url: mediaUrl,
        media_title: selectedFiles[i].name,
      };
      updateEndSessionContent.push(newMediaItem);
    }

    const endSessionPayload = {
      notes: note,
      session_media: updateEndSessionContent,
    };

    await endOfflineSession(endSessionPayload, sessionId, setLoading, t);
    setShowEndModel(false);
    setNote("");
    setSelectedFiles([]);
    fetchSession(false, pagination, showHistorical);
  };

  const openModel = (sessionId: number) => {
    setSessionId(sessionId);
    setShowModel(true);
  };

  const openEndModel = (sessionId: number) => {
    setSessionId(sessionId);
    setShowEndModel(true);
  };

  const startSession = async () => {
    const sessionPayload = {
      otp: otpValue,
    };
    await startOfflineSession(sessionPayload, sessionId, setLoading, t);
    await fetchSession(false, pagination, showHistorical);
    setShowModel(false);
    setOtpValue("");
    setSessionId(0);
  };

  useEffect(() => {
    if (showEndModel === false) {
      setOtpValue("");
      setSessionId(0);
      setSelectedFiles([]);
      setNote("");
    }
  }, [showEndModel]);

  return (
    <>
      {sessionList && sessionList.length > 0 ? (
        sessionList.map((value, index) => (
          <>
            <div
              className={`mt-5 ${
                calculateDaysLeft(value.session_start_date) > 0
                  ? "task-box-grey"
                  : isDateBetween(
                      value.session_start_date,
                      value.session_end_date
                    )
                  ? "task-box-blue"
                  : "task-box-green"
              }`}
              key={index}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="comman-black-text text-wrap flex space-x-1">
                    <div> {value.service_title} </div>
                  </div>
                  <div className="subscription-list-subtitle-font-size comman-grey">
                    {` ${dateFormat(
                      getLocalDate(value.session_start_date)
                    )} - ${dateFormat(getLocalDate(value.session_end_date))}`}
                  </div>
                  <div className="subscription-list-subtitle-font-size comman-grey">
                    {`${convertTimeStringToTime(
                      value.session_start_time
                    )} - ${calculateEndTime(
                      value.session_start_time,
                      value.session_duration
                    )}`}
                  </div>
                  <div className="subscription-list-subtitle-font-size comman-grey">
                    {`${t("number_of_participants")}-${value.total_bookings}`}
                  </div>
                  {value.address && (
                    <div className="subscription-list-subtitle-font-size comman-grey">
                      <span className="font-semibold">{t("address")}-</span>{" "}
                      {`${value.address.address_line_1}, ${
                        value.address.address_line_2
                      }, ${
                        value.address?.address_line_3 &&
                        value.address.address_line_3
                      },${value.address.city},${value.address.state_name},${
                        value.address.postcode
                      }`}
                    </div>
                  )}
                  {value.actual_session_end_time && (
                    <div className="">
                      <div className="subscription-list-subtitle-font-size">
                        {`${t("completed")} - ${dateFormat(
                          getLocalDate(value.actual_session_end_time)
                        )} `}
                      </div>
                    </div>
                  )}
                </div>
                <div className="mr-2 w-fit">
                  {value.is_offline === IS_OFFLINE.Yes && (
                    <>
                      <div className="comman-border !bg-white px-1 flex items-center justify-center text-xs mb-2 ">
                        {t(IS_OFFLINE_VALUES.Offline)}
                      </div>
                    </>
                  )}
                  {!value.actual_session_end_time &&
                    getLocalDate() <
                      getLocalDate(value.session_end_date + "T23:59:59") && (
                      <SessionJoinButton
                        schedule_time={value.session_start_time}
                        schedule_start_date={value.session_start_date}
                        schedule_end_date={value.session_end_date}
                        isOffline={value.is_offline}
                        actual_session_start_time={
                          value.actual_session_start_time
                        }
                        onClickJoin={(event) => {
                          event.stopPropagation();
                          // navigate(routeTrainer.zoom, {
                          //   state: { sessionId: value.id },
                          // });
                          window.open(
                            ensureHttpsUrl(value.meeting_link),
                            "_blank"
                          );
                        }}
                        onClickEndSession={(event) => {
                          event.stopPropagation();
                          openEndModel(value.id);
                        }}
                        onClickStartSession={(event) => {
                          event.stopPropagation();
                          openModel(value.id);
                        }}
                      />
                    )}
                </div>
              </div>

              <ICCustomModal
                title={t("start_session")}
                content={trainerOfflineDetails}
                buttonTitle={t("verify_and_continue")}
                isModalShow={showModel}
                setIsModalShow={setShowModel}
                handleSubmitButton={() => {
                  startSession();
                }}
                disabled={otpValue.length !== 4}
              />

              <ICCustomModal
                title={t("end_session")}
                content={trainerEndOfflineDetails}
                buttonTitle={t("end_session")}
                isModalShow={showEndModel}
                setIsModalShow={setShowEndModel}
                handleSubmitButton={() => {
                  uploadEndSessionContent();
                }}
                disabled={note.length <= 5}
              />
            </div>
          </>
        ))
      ) : (
        <NoData title={t("task")} height={100} width={100} />
      )}
    </>
  );
};

export default TrainerListComponent;
