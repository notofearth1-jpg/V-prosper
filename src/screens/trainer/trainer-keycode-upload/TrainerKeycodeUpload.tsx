import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TOnChangeInput, TReactSetState } from "../../../data/AppType";
import { toastError } from "../../../utils/AppFunctions";
import { deleteIcon } from "../../../assets/icons/SvgIconList";
import {
  initialKeyCodeValue,
  keycodeValidationSchema,
  submitTrainerKeycodeDetails,
} from "./TrainerKeycodeUploadController";
import { useLocation } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import {
  ITrainerKeycode,
  fetchTrainerKeycode,
} from "../trainer-verification/TrainerVerificationController";
import { fetchUploadImageService } from "../../image-service/ImageServices";
import { IMAGE_TYPE } from "../../../utils/AppEnumerations";
import ICButton from "../../../core-component/ICButton";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerKeycodeUpload: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();

  const [loading, setLoading] = useState(false);
  const userId = localStorageUtils.getUserId();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [trainerKeycode, setTrainerKeycode] = useState<
    ITrainerKeycode | undefined
  >();
  const [timer, setTimer] = useState(0);
  const [timerText, setTimerText] = useState("");
  const trainerId = localStorageUtils.getTrainerId();

  useEffect(() => {
    if (trainerKeycode && trainerKeycode.keycode_expiry_seconds) {
      const expirationSeconds = trainerKeycode.keycode_expiry_seconds;
      setTimer(expirationSeconds);
    }
  }, [trainerKeycode]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [trainerKeycode]);

  useEffect(() => {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    setTimerText(
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
    );
  }, [timer]);

  const handleFileChange = (event: TOnChangeInput) => {
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
        toastError(t("max_size_error_certificate"));
      }
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const location = useLocation();

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
    enableReinitialize: true,
    initialValues: initialKeyCodeValue(selectedFile),
    validationSchema: keycodeValidationSchema(t),

    onSubmit: async (values) => {
      formik.setSubmitting(true);

      const formData = new FormData();
      formData.append("myImageFile", values.keycode_document_url as File);
      formData.append("type", IMAGE_TYPE.Identity);
      userId && formData.append("typeId", userId);
      const response = await fetchUploadImageService(formData);
      const updatedValues = {
        ...values,
        keycode_document_url: response,
      };

      const overview_section_status = {
        completed: [1, 2, 3, 4],
        in_progress: [5],
      };

      await submitTrainerKeycodeDetails(
        { ...updatedValues, overview_section_status },
        Number(userId),
        setCurrentIndex,
        t,
        () => updateQueryStringParameter("ra", 1)
      );

      formik.setSubmitting(false);
    },
  });

  const navigate = useNavigate();

  const privious = () => {
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const generateKeyCode = () => {
    fetchTrainerKeycode(
      setTrainerKeycode,
      Number(trainerId),
      setLoading,
      navigate,
      t
    );
  };

  useEffect(() => {
    fetchTrainerKeycode(
      setTrainerKeycode,
      Number(trainerId),
      setLoading,
      navigate,
      t
    );
  }, []);

  return (
    <div className="flex justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div className="h-[95vh] flex flex-col justify-between xl:w-9/12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            <div className="flex flex-col justify-between">
              <div className="image">
                <img
                  src={require("../../../assets/image/image 2.png")}
                  alt="no image"
                  className="w-full"
                />
              </div>
            </div>
            <div>
              {trainerKeycode && (
                <div className="text-center !text-4xl !font-bold top comman-black-big">
                  {trainerKeycode.keycode}
                </div>
              )}
              <div className="top comman-padding">
                {formik.values.keycode_document_url ? (
                  <div className="border-box flex items-center justify-center flex-col relative">
                    <img
                      src={URL.createObjectURL(
                        formik.values.keycode_document_url as File
                      )}
                      alt="Preview"
                      className="h-full w-100"
                    />
                    <button
                      type="button"
                      className="text-skin-trainer-validation mt-2 absolute top-0 right-0 cursor"
                      onClick={handleDelete}
                    >
                      <div className="w-10 h-10">{deleteIcon}</div>
                    </button>
                  </div>
                ) : (
                  <div className="border-box flex items-center justify-center flex-col p-2">
                    <button
                      type="button"
                      className={`text-skin-trainer px-6 py-3 text-sm font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca]
                      comman-btn focus:outline-none cursor`}
                      onClick={handleBrowseClick}
                    >
                      <p className="comman-white-text">{t("browse")}</p>
                    </button>
                    <p className="comman-black-text top">
                      {t("max_size_error_certificate")}
                    </p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".jpg, .jpeg, .png"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {formik.errors.keycode_document_url &&
                  formik.touched.keycode_document_url && (
                    <p className="text-skin-trainer-validation">
                      {formik.errors.keycode_document_url}
                    </p>
                  )}
              </div>
              <div className="top">
                {timer === 0 ? (
                  <div className="text-center">
                    <p className="comman-blue cursor" onClick={generateKeyCode}>
                      {t("generate_key_code")}
                    </p>
                  </div>
                ) : (
                  <div className="text-center comman-grey">
                    {t("expire_in")} {timerText}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="buttons flex flex-col sm:flex-row items-center justify-center comman-padding">
            <ICButton
              type="button"
              className={`text-skin-trainer px-6 py-3 text-sm font-medium uppercase rounded shadow-[0_4px_9px_-4px_#3b71ca]
              comman-btn focus:outline-none w-full sm:mr-1 sm:mb-0 mb-2 mt-auto cursor`}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>

            <ICButton
              type="button"
              className={`text-skin-trainer px-6 py-3 text-sm font-medium uppercase rounded shadow-[0_4px_9px_-4px_#3b71ca]
              focus:outline-none w-full  sm:ml-10 mt-auto ${
                timer === 0
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={() => formik.handleSubmit()}
              disabled={timer === 0 || formik.isSubmitting}
              loading={formik.isSubmitting}
            >
              {t("upload_keycode")}
            </ICButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerKeycodeUpload;
