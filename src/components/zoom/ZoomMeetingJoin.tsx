import React, { useState, useEffect } from "react";
import { ZoomMtg } from "@zoom/meetingsdk";
import {
  joinMeeting,
  fetchServiceCourseContentApi,
  trainerCourse,
  fetchMeeting,
  ISessionServicInfo,
  IMeetingInfo,
  IServiceCourse,
} from "./ZoomMeetingJoinController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ICButton from "../../core-component/ICButton";
import Loader from "../common/Loader";
import { useLocation, useNavigate } from "react-router-dom";
import { ZOOM_MEETING_ROLE } from "../../utils/AppEnumerations";
import { APP_HOST_URL, ZOOM_API_KEY } from "../../config/AppConfig";
import {
  convertTimeStringToTime,
  dateFormat,
  decryptData,
  encryptData,
  getLocalDate,
} from "../../utils/AppFunctions";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";
import { userRoute } from "../../routes/RouteUser";
import { routeTrainer } from "../../routes/RouteTrainer";
import {
  crossRemove,
  doneIcon,
  linkShareIcon,
  watchIcon,
} from "../../assets/icons/SvgIconList";
import { CrossIcon } from "react-select/dist/declarations/src/components/indicators";
import { commonRoute } from "../../routes/RouteCommon";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
// To preload zoom details. It is fetch intial data of zoom and create zmmtg tag at body
// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

const ZoomMeetingJoin = ({ role }: { role: number }) => {
  const { isMobile } = UseMobileLayoutHook();
  const [isMeetingLoading, setIsMeetingLoading] = useState(true);
  const [meetingData, setMeetingData] = useState<IMeetingInfo>();
  const [serviceInfo, setServiceInfo] = useState<ISessionServicInfo>();
  const [serviceCourseContentList, setServiceCourseContentList] = useState<
    IServiceCourse[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const sessionId = location?.state?.sessionId;
  const { t } = UseTranslationHook();
  const userId = localStorageUtils.getUserId();

  const handleClick = (id: number, isFolder: boolean = false) => {
    const url = `${
      isFolder ? commonRoute.folderDetail : userRoute.libraryDetails
    }?id=${encryptData(id.toString() + "|hst" + `|${userId}`)}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    fetchServiceCourseContentApi(
      setServiceCourseContentList,
      setServiceInfo,
      sessionId
    );
  }, []);

  useEffect(() => {
    const handlePopstate = (event: PopStateEvent) => {
      window.location.reload();
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      // Popstate is not working if add below remove event listnerd
      // window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const startMeeting = async () => {
    try {
      if (!meetingData) {
        return;
      }

      const meetingPayload = {
        meetingNumber: decryptData(meetingData?.meeting_number),
        role: ZOOM_MEETING_ROLE.Trainer === role ? "1" : "0",
      };

      const signature = await joinMeeting(meetingPayload);
      if (!signature) {
        return;
      }

      ZoomMtg.preLoadWasm();
      ZoomMtg.prepareWebSDK();

      await new Promise((res, rej) => setTimeout(res, 2000));

      ZoomMtg.init({
        showMeetingHeader: false,
        // disableInvite: true, // Enables or disables the invite function
        disableRecord: true, // Enables or disables the call out function
        // showPureSharingContent: true, // Enables or disables the audio and video features
        // isSupportChat: false, // nables or disables the chat feature
        // isSupportQA: false, // Enables or disables the webinar Q&A feature
        // isSupportCC: false, // Enables or disables the meeting closed caption feature
        // isSupportPolling: false, // Enables or disables the meeting polling feature
        // isSupportBreakout: false, //  Enables or disables the meeting breakout room feature
        // screenShare: false, // Enables or disables the browser URL sharing feature (Chrome only)
        // videoDrag: false, //Enable or disable the drag video tile feature
        // videoHeader: false, // Shows or hides the video tile header
        // isLockBottom: true, // Shows or hides the footer
        meetingInfo: ["topic"], //  ['topic','host','mn','pwd','telPwd','invite','participant','dc', 'enctype', 'report']
        disablePreview: true, // Enables or disables the audio and video preview features
        defaultView: "speaker", // 'gallery' or 'speaker'. Optional. Sets the default video layout to gallery view (if supported) or 'speaker' (default value)
        disablePictureInPicture: true, // Enables or disables the Picture in Picture feature.
        disableZoomPhone: false, // Enables or disables the Invite->Zoom Phone feature.
        // disableCORP: true,
        // disableCallOut: true,
        disableInvite: true,
        // disableJoinAudio: true,
        // disableReport: true,
        // disableVoIP: true,
        leaveUrl:
          role === ZOOM_MEETING_ROLE.User
            ? APP_HOST_URL + userRoute.bookingList
            : APP_HOST_URL + routeTrainer.trainerHome,
        patchJsMedia: true,
        debug: true,
        success: () => {
          ZoomMtg.join({
            signature: signature,
            sdkKey: ZOOM_API_KEY,
            meetingNumber: decryptData(meetingData.meeting_number),
            passWord: decryptData(meetingData.password),
            userName: meetingData.name,
            ...(meetingData.email ? { userEmail: meetingData.email } : {}),
            tk: "",
            zak: "",
            success: () => {
              setLoading(false);
              setIsMeetingLoading(false);
            },
            error: () => {
              setLoading(false);
              setIsMeetingLoading(false);
            },
          });
        },
        error: () => {},
      });
    } catch (e) {}
  };

  useEffect(() => {
    startMeeting();
  }, [meetingData]);

  useEffect(() => {
    fetchMeeting(setMeetingData, sessionId, setLoading);
  }, [sessionId]);

  const [expanded, setExpanded] = useState(true);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedIds((prevIds) => [...prevIds, id]);
    } else {
      setSelectedIds((prevIds) =>
        prevIds.filter((selectedId) => selectedId !== id)
      );
    }
  };

  const addCourseCompleted = async () => {
    const payload = {
      session_id: sessionId,
      course_ids: selectedIds,
    };
    await trainerCourse(payload, setLoading);
    await fetchServiceCourseContentApi(
      setServiceCourseContentList,
      setServiceInfo,
      sessionId
    );
    setSelectedIds([]);
  };

  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleExpend = (id: number | undefined) => {
    if (id === undefined) {
      return;
    }

    if (id === expandedId) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {!isMeetingLoading && (
        <div
          className={`absolute h-full ${
            expanded ? "!w-[100%]" : "md:!w-[70%] lg:!w-[80%]"
          }`}
        >
          <Loader />
        </div>
      )}
      <div
        className={`${
          !expanded
            ? `${
                isMobile ? "w-[100%]" : "md:w-[30%]"
              } h-full absolute z-20 top-0 right-0 left-transition bg-white`
            : ""
        }`}
      >
        <div className={`h-full flex flex-col ${expanded ? "hidden" : ""}`}>
          <div className="border-b-2 !text-white comman-black-big main-identity !font-semibold">
            <div className="mx-1">
              {t("service_title")}: {serviceInfo?.service_title}
            </div>
            {serviceInfo && (
              <div className="mx-1">
                <div className="mt-2">
                  {t("date")}:{" "}
                  {dateFormat(getLocalDate(serviceInfo.session_start_date))}
                </div>
                <div className="mt-2">
                  {t("time")}:{" "}
                  {convertTimeStringToTime(serviceInfo.session_start_time)}
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 py-4 ml-1 mr-8 md:mr-1 course-box">
            {serviceCourseContentList &&
              serviceCourseContentList.length > 0 &&
              serviceCourseContentList.map((item, index) => {
                return (
                  <>
                    <div
                      key={index}
                      className="flex justify-between items-center px-4 cursor"
                      onClick={() => handleExpend(item.id)}
                    >
                      <div className="mt-2">
                        <div className="list-inside flex">
                          <div>
                            {role === ZOOM_MEETING_ROLE.Trainer ? (
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  className={`w-4 h-4 text-skin-selected-interest bg-skin-selected-interests border-skin-selected-interests
                                      focus:ring-0 dark:focus:ring-0 focus:border-0 checkbox-color`}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, item.id)
                                  }
                                  checked={
                                    selectedIds.includes(item.id) ||
                                    (item?.SCE?.completion_date ? true : false)
                                  }
                                  disabled={
                                    item?.SCE?.completion_date ? true : false
                                  }
                                />
                                <label
                                  htmlFor="1"
                                  className="ms-2 text-sm font-medium text-skin-interest"
                                ></label>
                                <div className="comman-black-big ml-1">
                                  {item.content_title}
                                </div>
                              </div>
                            ) : (
                              <div className="comman-black-big flex items-center">
                                {item?.SCE?.completion_date ? (
                                  <div className="h-5 w-5">{doneIcon}</div>
                                ) : (
                                  <div className="task-panding"></div>
                                )}
                                <div className="ml-3">{item.content_title}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-5 h-5">{watchIcon}</div>
                        <span className="ml-2">
                          {item.content_delivery_time} {t("m")}
                        </span>
                      </div>
                    </div>

                    {expandedId === item.id && (
                      <div className="expandable-content">
                        {item.library_content &&
                          item.library_content.length > 0 &&
                          item.library_content.map((data, idx) => (
                            <div
                              className="flex items-center justify-between px-4 mt-2"
                              key={idx}
                            >
                              <li className="comman-grey">{data.title}</li>
                              <div
                                className="w-4 h-5 cursor"
                                onClick={() => handleClick(data.id)}
                              >
                                {linkShareIcon}
                              </div>
                            </div>
                          ))}
                        {item.library_directory &&
                          item.library_directory.length > 0 &&
                          item.library_directory.map((data, idx) => (
                            <div
                              className="flex items-center justify-between px-4 mt-2"
                              key={idx}
                            >
                              <li className="comman-grey">{data.title}</li>
                              <div
                                className="w-4 h-5 cursor"
                                onClick={() => handleClick(data.id, true)}
                              >
                                {linkShareIcon}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}

                    <div className="p-4">
                      <div className="message-border-bottom"></div>
                    </div>
                  </>
                );
              })}
          </div>
          {ZOOM_MEETING_ROLE.Trainer === role && (
            <div className="text-center m-4">
              <ICButton
                className={`
                    focus:outline-none w-full ${
                      selectedIds.length === 0
                        ? "cursor-not-allowed comman-disablebtn"
                        : "comman-btn"
                    }`}
                disabled={selectedIds.length === 0}
                onClick={addCourseCompleted}
              >
                <p className="comman-white-text">{t("mark_as_completed")}</p>
              </ICButton>
            </div>
          )}
        </div>
      </div>

      {!expanded && (
        <div
          className="absolute top-0 right-0 w-10 h-10 z-50 cursor"
          onClick={toggleExpansion}
        >
          {crossRemove}
        </div>
      )}

      {expanded &&
        serviceCourseContentList &&
        serviceCourseContentList.length > 0 && (
          <div
            className="expend-course cursor-pointer"
            onClick={toggleExpansion}
          >
            <div>
              <p className="comman-white-text">{t("course_content")}</p>
            </div>
          </div>
        )}

      <div
        className={`${
          ZOOM_MEETING_ROLE.Trainer !== role ? "hide-zoom-control-footer" : ""
        }  zmmtg-root absolute z-10 h-full ${
          expanded ? "!w-[100%]" : "md:!w-[70%] lg:!w-[70%]"
        }`}
        id="zmmtg-root"
      ></div>
      <div id="aria-notify-area"></div>
    </div>
  );
};

export default ZoomMeetingJoin;
