import React, { useEffect, useRef, useState } from "react";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import BackButton from "../../components/common/BackButton";
import Loader from "../../components/common/Loader";
import {
  clipIcon,
  closeSideIcon,
  deleteIcon,
  editIcon,
  sendIcon,
} from "../../assets/icons/SvgIconList";
import {
  getLocalDate,
  getTimeOrDate,
  sweetAlertError,
  trailingDotAddition,
} from "../../utils/AppFunctions";
import { useLocation, useNavigate } from "react-router-dom";
import ICTextInput from "../../core-component/ICTextInput";
import {
  GrievancesStatus,
  IMAGE_TYPE,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import {
  addGrievanceConversation,
  getGrievanceByID,
  IGrievanceConversation,
  markReadGrievance,
  updateGrievanceConversation,
} from "./grievanceController";
import useLongPress from "../../hooks/UseLongPress";
import { userRoute } from "../../routes/RouteUser";
import { TOnChangeInput } from "../../data/AppType";
import { fetchUploadImageService } from "../image-service/ImageServices";
import ICImage from "../../core-component/ICImage";
function GrievanceConversation() {
  const [grievanceConversation, setGrievanceConversation] = useState<
    IGrievanceConversation[] | undefined
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const [messageLoder, setMessageLoader] = useState(false);
  const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
  const [comment, setComment] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { t } = UseTranslationHook();
  const navigate = useNavigate();
  const location = useLocation();
  const grievance = location?.state;
  const messagesEndRef: any = useRef(null);
  const userId = localStorageUtils.getUserId();
  const textInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getGrievanceByID(
      setLoading,
      setGrievanceConversation,
      setHasUnreadMessage,
      t,
      grievance.grievance_id
    );
  }, []);

  useEffect(() => {
    if (hasUnreadMessage) {
      markReadGrievance(grievance.grievance_id);
      setHasUnreadMessage(false);
    }
  }, [hasUnreadMessage]);

  useEffect(() => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
      }
    }, 400);
  }, [grievanceConversation, messageLoder]);

  const sendComment = async (grievanceConversationId = 0) => {
    if (comment === null && selectedFile === null) return;
    setLoading(true);
    let imageUrl = null;
    if (selectedFile) {
      const formData = new FormData();
      formData.append("myImageFile", selectedFile);
      formData.append("type", IMAGE_TYPE.Grievances);
      formData.append("typeId", grievance.grievance_id);
      const response = await fetchUploadImageService(formData);
      imageUrl = response;
    }
    if (grievanceConversationId > 0)
      updateGrievanceConversation(
        setGrievanceConversation,
        t,
        grievanceConversation,
        grievanceConversationId,
        {
          comment: comment,
          grievance_id: grievance.grievance_id,
          file_path: null,
        }
      );
    else {
      grievanceConversationId === 0 &&
        addGrievanceConversation(
          setMessageLoader,
          setGrievanceConversation,
          grievanceConversation,
          t,
          {
            grievance_id: grievance.grievance_id,
            comment: imageUrl ? null : comment,
            file_path: imageUrl,
          }
        );
    }

    setComment(null);
    setSelectedFile(null);
    setSelectedId(0);
    setLoading(false);
  };

  const longPressProps = useLongPress();
  const focusTextInput = () =>
    setTimeout(() => {
      textInputRef?.current?.focus();
    }, 500);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event: TOnChangeInput) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      if (
        (file.type === "image/png" ||
          file.type === "image/jpeg" ||
          file.type === "image/jpg") &&
        file.size <= 10 * 1024 * 1024
      ) {
        setSelectedFile(file);
      } else {
        sweetAlertError(t("max_size_error_certificate"));
      }
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding !overflow-hidden h-svh md:h-[calc(100vh-76px)] flex flex-col">
          <div className="flex border-b border-b-gray-400">
            <div>
              <BackButton />
            </div>
            <div className="items-center ml-4 ">
              <p className="comman-black-text">
                {trailingDotAddition(grievance.complaint_title, 25)}
              </p>
              <p className="comman-grey">
                {trailingDotAddition(grievance.complaint_detail, 25)}
              </p>
            </div>
            {grievance.grievance_status === GrievancesStatus[1] && (
              <div
                className="ml-4 h-7 w-7 cursor"
                onClick={() =>
                  navigate(userRoute.addUpdateGrievance, {
                    state: {
                      id: grievance.grievance_id,
                      complaint_title: grievance.complaint_title,
                      complaint_detail: grievance.complaint_detail,
                      booking_id: grievance.booking_id,
                    },
                  })
                }
              >
                {editIcon}
              </div>
            )}
          </div>
          {selectedFile ? (
            <div className="flex items-center justify-center flex-col flex-1 relative">
              <div className="w-full md:w-3/4 lg:w-1/2 aspect-16/9 object-contain overflow-hidden border-dashed border-black border">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full aspect-16/9 object-contain"
                />
                <button
                  type="button"
                  className="text-skin-trainer-validation mt-2 absolute top-0 right-0 cursor"
                  onClick={() => setSelectedFile(null)}
                >
                  <div className="w-10 h-10 cursor">{deleteIcon}</div>
                </button>
                <button
                  type="button"
                  className="text-skin-trainer-validation mt-2 absolute bottom-1 right-0 cursor"
                  onClick={() => sendComment()}
                >
                  <div className="w-10 h-10 cursor">{sendIcon}</div>
                </button>
              </div>
            </div>
          ) : (
            <div className="md:flex md:justify-center overflow-y-scroll flex-1">
              <div className="min-w-full h-full md:min-w-96 max-w-screen-sm flex flex-col">
                <div
                  ref={messagesEndRef}
                  className="flex-1 flex flex-col overflow-auto remove-scrollbar-width pt-2"
                >
                  {grievanceConversation && grievanceConversation.length > 0 ? (
                    <>
                      {grievanceConversation.map(
                        (i: IGrievanceConversation, index: number) => (
                          <>
                            <div
                              key={index}
                              className={`flex ${
                                i?.modified_by != userId
                                  ? `self-start`
                                  : `self-end`
                              } `}
                            >
                              {i?.modified_date != null ? (
                                <p className={`text-[0.7rem] mr-2`}>(edited)</p>
                              ) : null}
                              <p className={`text-[0.7rem] mr-1`}>
                                {i?.modified_by == userId
                                  ? "You"
                                  : i?.modified_by_name}
                                :
                              </p>
                              <p className={`text-[0.7rem] mr-2`}>
                                {getTimeOrDate(
                                  getLocalDate(
                                    i?.modified_date
                                      ? i?.modified_date
                                      : i?.log_date
                                  )
                                )}
                              </p>
                            </div>
                            {i.comment && (
                              <div
                                className={`border-solid border rounded-xl p-2 max-w-[80%] ${
                                  i?.modified_by != userId
                                    ? "self-start rounded-tl-none"
                                    : "rounded-br-none self-end"
                                } ${
                                  selectedId === i.id
                                    ? `border-red-500 bg-red-50`
                                    : `border-gray-400 bg-white`
                                } mb-2`}
                                {...longPressProps(() => {
                                  if (
                                    i.role_id !== USER_ROLE.Customer &&
                                    i?.modified_by !== userId
                                  )
                                    return;
                                  setSelectedId(i.id);
                                  setComment(i.comment);
                                  focusTextInput();
                                })}
                              >
                                <div>
                                  <p className="w-full">{i.comment}</p>
                                </div>
                              </div>
                            )}
                            {i.file_path && (
                              <div
                                className={`border-solid border rounded-xl p-2 max-w-[80%] ${
                                  i?.modified_by != userId
                                    ? "self-start rounded-tl-none"
                                    : "rounded-br-none self-end"
                                } ${
                                  selectedId === i.id
                                    ? `border-red-500 bg-red-50`
                                    : `border-gray-400 bg-white`
                                } mb-2`}
                              >
                                <div>
                                  <div className="min-h-32 w-full aspect-16/9">
                                    <ICImage
                                      imageUrl={i.file_path}
                                      className="w-full aspect-16/9 object-contain"
                                      isPrivate
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        )
                      )}
                      {messageLoder && (
                        <div className=" self-end">
                          <img
                            src={require("../../assets/image/loader-1.gif")}
                            alt={t("loading")}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className=" flex justify-center items-center h-screen">
                      <div className="text-center">
                        <p className="text-xl mb-4 -mt-3 ">
                          {t("no_conversation_yet")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {grievance?.grievance_status !== GrievancesStatus[3] ? (
                  <>
                    <div className="w-full flex justify-start items-center relative">
                      <>
                        {selectedId !== 0 ? (
                          <div
                            className="w-10 cursor"
                            onClick={() => {
                              setSelectedId(0);
                              setComment(null);
                            }}
                          >
                            {closeSideIcon}
                          </div>
                        ) : null}
                        <ICTextInput
                          className={`${
                            selectedId !== 0
                              ? `border border-gray-400 `
                              : `border-blue-500`
                          } h-12 pl-2 pr-10 !w-full   border border-gray-400 rounded`}
                          type="text"
                          autoFocus
                          placeholder={t("reply_grievance")}
                          name="username"
                          reference={textInputRef}
                          value={comment ? comment : ""}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setComment(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              selectedId !== 0
                                ? sendComment(selectedId)
                                : sendComment(0);
                            }
                          }}
                        />
                      </>
                      <div
                        className="ml-2 w-10 cursor"
                        onClick={() =>
                          selectedId !== 0
                            ? sendComment(selectedId)
                            : sendComment(0)
                        }
                      >
                        {sendIcon}
                      </div>
                      <input
                        type="file"
                        accept=".png, .jpeg, .jpg"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                      {selectedId === 0 && (
                        <div
                          className="absolute right-12 top-3 w-5 h-5 cursor"
                          onClick={handleIconClick}
                        >
                          {clipIcon}
                        </div>
                      )}
                    </div>
                    <p className="text-[0.7em]  text-grey-100 italic mt-1">
                      {t("long_press_to_edit")}
                    </p>
                  </>
                ) : (
                  <div className="text-center mb-8 text-red-500 font-bold">
                    <p className="text-lg">{t("grievance_closed")}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default GrievanceConversation;
