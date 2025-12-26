import React, { useEffect, useRef, useState } from "react";
import { TOnChangeInput, TReactSetState } from "../../../data/AppType";
import { useFormik } from "formik";
import Loader from "../../../components/common/Loader";
import {
  ICertificate,
  fetchTrainerCertificate,
  initialCertificatesValues,
  monthsDropdown,
  submitTrainerCertificateDetails,
} from "./TraiinerCertificatesController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { IDDL } from "../../../data/AppInterface";
import {
  addCertificateIcon,
  crossRemove,
  deleteIcon,
  exitArrow,
} from "../../../assets/icons/SvgIconList";
import {
  encryptData,
  sweetAlertError,
  toastError,
} from "../../../utils/AppFunctions";
import { ITrainerCertificates } from "../../../services/trainer/TrainerService";
import { useLocation, useNavigate } from "react-router-dom";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import {
  IMAGE_TYPE,
  PROFILE_OVERVIEW,
  TRAINER_APPLICATION_DOCUMENT_SECTION,
  TRAINER_ON_BOARD,
} from "../../../utils/AppEnumerations";
import ICDropDown from "../../../core-component/ICDropDown";
import ICTextInput from "../../../core-component/ICTextInput";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import {
  IReview,
  fetchTrainerReview,
} from "../trainer-application-overview/TrainerApplicationOverviewController";
import ICImage from "../../../core-component/ICImage";
import { fetchUploadImageService } from "../../image-service/ImageServices";
import { DELETE_PRESIGNED_URL } from "../../../services/user/UserServices";
import ICCommonModal from "../../../components/common/ICCommonModel";
import ICButton from "../../../core-component/ICButton";

interface ITrainerAgreement {
  setCurrentIndex: TReactSetState<number>;
}
interface ITrainerCertificate {
  certificates: ICertificate[];
}

const TrainerCertificates: React.FC<ITrainerAgreement> = ({
  setCurrentIndex,
}) => {
  const [trainerDetails, setTrainerDetails] = useState<ITrainerCertificates>();
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const { t } = UseTranslationHook();
  const [trainerCertificateType, setTrainerCertificateType] = useState<IDDL[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [certificateType, setCertificateType] = useState<number>(0);
  const [certificateTitle, setCertificateTitle] = useState<string>("");
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number | null>(null);
  const [certificate, setCertificate] = useState<ICertificate[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [trainerReviewDetails, setTrainerReviewDetails] = useState<
    IReview | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setTrainerDetails(updatedDetails);
        if (updatedDetails && updatedDetails.certificates) {
          setCertificate(updatedDetails.certificates);
        }
      }
    };
    fetchData();
  }, []);

  const handleEditClick = () => {
    setIsBottomDivVisible(true);
  };

  const onCancel = () => {
    setIsBottomDivVisible(false);
  };

  useEffect(() => {
    fetchTrainerCertificate(setTrainerCertificateType, setLoading, t);
    if (certificate.length > 0) {
      setIsBottomDivVisible(false);
    } else {
      setIsBottomDivVisible(true);
    }
  }, [certificate]);

  const handleCertificateTypeSelect = (
    displayValue: string,
    dataValue: number
  ) => {
    setCertificateType(dataValue);
    setCertificateTitle(displayValue);
  };

  const handleMonthSelect = (dataValue: number) => {
    setMonth(dataValue);
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        sweetAlertError(t("max_size_error_certificate"));
      }
    }
  };

  const handleDelete = () => {
    setSelectedFile(null);
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click
    }
  };

  const handleUpload = async () => {
    let errorMessage = "";

    switch (true) {
      case certificateType === 0:
        errorMessage = t("select_certificate");
        break;
      case month === 0:
        errorMessage = t("select_month");
        break;
      case year === null || year === 0:
        errorMessage = t("select_year");
        break;
      case !selectedFile:
        errorMessage = t("select_file");
        break;
      default:
        break;
    }

    if (errorMessage) {
      sweetAlertError(errorMessage);
      return;
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append("myImageFile", selectedFile);
      formData.append("type", IMAGE_TYPE.Certificates);
      userId && formData.append("typeId", userId);

      try {
        setLoading(true);
        const response = await fetchUploadImageService(formData);
        const newCertificate = {
          type: certificateType,
          category_name: certificateTitle,
          exp_month: month,
          exp_year: year,
          certificate_image_url: response,
        };
        // Update state with the new certificate object
        setCertificate([...certificate, newCertificate]);
        setCertificateType(0);
        setYear(null);
        setMonth(0);
        onCancel();
        setSelectedFile(null);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteCertificate = (index: number, imgUrl: string) => {
    imgUrl && DELETE_PRESIGNED_URL(encryptData(imgUrl));
    const updatedCertificate = [...certificate];
    updatedCertificate.splice(index, 1);
    setCertificate(updatedCertificate);
  };

  const userId = localStorageUtils.getUserId();
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
    initialValues: initialCertificatesValues(trainerDetails),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const certificatesPayload: ITrainerCertificate = {
        certificates: certificate,
      };
      let overview_section_status;

      if (
        trainerDetails?.overview_section_status &&
        Array.isArray(trainerDetails.overview_section_status.completed) &&
        trainerDetails.overview_section_status.completed.length === 4 &&
        trainerDetails.overview_section_status.completed.every(
          (value, index) => value === index + 1
        ) &&
        Array.isArray(trainerDetails.overview_section_status.in_progress)
      ) {
        overview_section_status = {
          completed: trainerDetails.overview_section_status.completed,
          in_progress: trainerDetails.overview_section_status.in_progress,
        };
      } else {
        overview_section_status = {
          completed: [1, 2, 3],
          in_progress: [4],
        };
      }

      if (
        !(
          !trainerReviewDetails?.section_review_status ||
          trainerReviewDetails?.section_review_status?.find(
            (review) =>
              review.section === PROFILE_OVERVIEW.UploadDocuments &&
              review.status ===
                TRAINER_APPLICATION_DOCUMENT_SECTION.AddressVerification
          )
        )
      ) {
        await submitTrainerCertificateDetails(
          { ...certificatesPayload, overview_section_status },
          Number(userId),
          setCurrentIndex,
          t,
          true,
          true,
          () => updateQueryStringParameter("id", 1)
        );
      } else {
        await submitTrainerCertificateDetails(
          { ...certificatesPayload, overview_section_status },
          Number(userId),
          setCurrentIndex,
          t,
          true,
          false,
          () => updateQueryStringParameter("id", 1)
        );
      }
    },
  });

  const previous = async () => {
    const certificatesPayload: ITrainerCertificate = {
      certificates: certificate,
    };

    let overview_section_status;

    if (trainerDetails?.overview_section_status) {
      overview_section_status = {
        completed: trainerDetails.overview_section_status.completed,
        in_progress: trainerDetails.overview_section_status.in_progress,
      };
    } else {
      overview_section_status = {
        completed: [1, 2, 3],
        in_progress: [4],
      };
    }

    await submitTrainerCertificateDetails(
      { ...certificatesPayload, overview_section_status },
      Number(userId),
      setCurrentIndex,
      t,
      false,
      false,
      () => updateQueryStringParameter("id", 1)
    );
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

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  useEffect(() => {
    fetchTrainerReview(setTrainerReviewDetails, Number(userId), setLoading, t);
  }, []);

  const handleYearChange = (e: TOnChangeInput) => {
    const value = e.target.value;
    // Ensure the value is numeric and contains at most 4 digits
    const newValue = value.replace(/\D/g, "").slice(0, 4);
    const parsedValue = newValue === "" ? null : parseInt(newValue, 10); // Convert to number if not empty
    setYear(parsedValue);
    if (parsedValue !== null && (parsedValue < 1975 || parsedValue > 2075)) {
      setError(t("please_input_valid_year"));
    } else {
      setError("");
      setYear(parsedValue);
    }
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  const certificateContent = (
    <div>
      <div className="comman-black-big">
        <p>{t("upload_certificate")}</p>
      </div>
      <div className="top">
        <ICDropDown
          label={t("certificate_type")}
          selected={certificateType ? certificateType : undefined}
          className={"w-full"}
          options={trainerCertificateType.map((data, index) => ({
            label: data.display_value,
            value: data.data_value,
          }))}
          onSelect={(option) =>
            handleCertificateTypeSelect(option.label, option.value)
          }
        />
      </div>
      <div className="top flex space-x-5 ">
        <ICDropDown
          label={t("expire_month")}
          selected={month ? month : undefined}
          className={"!w-[200px] mt-[6px]"}
          options={monthsDropdown.map((data, index) => ({
            label: data.display_value,
            value: data.data_value,
          }))}
          onSelect={(option) => handleMonthSelect(option.value)}
        />

        <ICTextInput
          placeholder={t("expiry_year")}
          value={year === null ? "" : year}
          onChange={handleYearChange}
        />
      </div>
      {error && <div className="text-red-500">{error}</div>}

      <div className="top">
        {selectedFile ? (
          <div className="border-box flex items-center justify-center flex-col relative">
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="h-full w-100"
            />
            <button
              type="button"
              className="text-red-500 mt-2 absolute top-0 right-0 cursor"
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
      </div>

      <button
        type="button"
        className={`cursor text-skin-trainer px-6 py-3 text-sm font-medium uppercase rounded shadow-[0_4px_9px_-4px_#3b71ca]
                 focus:outline-none w-full sm:w-fit sm:ml-10 mt-auto top  ${
                   certificateType === 0 ||
                   month === 0 ||
                   year === null ||
                   year === 0 ||
                   !selectedFile
                     ? "cursor-not-allowed comman-disablebtn"
                     : "comman-btn"
                 }`}
        onClick={handleUpload}
        disabled={
          certificateType === 0 ||
          month === 0 ||
          year === null ||
          year === 0 ||
          !selectedFile
        }
      >
        {t("add_certificate")}
      </button>
    </div>
  );

  const setNext = () => {
    setCurrentIndex((prevIndex) => prevIndex + 1);
    updateQueryStringParameter("s", 2);
  };

  return (
    <div className="flex justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`${
            isFullHeight ? "h-[96vh]" : "h-auto"
          } xl:w-1/2 w-full flex flex-col justify-between`}
        >
          <div className="grid grid-cols-1">
            <div className="flex items-center justify-between">
              <div className="w-7 cursor-pointer" onClick={previous}>
                {exitArrow}
              </div>
              <div>
                <BackToOverviewButton onClick={backOverview} />
              </div>
            </div>
            {certificate && certificate.length > 0 && (
              <div className="grid xl:grid-cols-3 gap-2">
                {certificate.map((cert, index) => (
                  <div className="top review-helth" key={index}>
                    <div className=" relative ">
                      <ICImage
                        imageUrl={cert.certificate_image_url}
                        scaled={false}
                        className="rounded-lg w-full"
                        isPrivate
                      />
                      <div
                        className="absolute top-0 right-0 cursor favorites cursor"
                        onClick={() =>
                          handleDeleteCertificate(
                            index,
                            cert.certificate_image_url
                          )
                        }
                      >
                        <div className="w-7 h-7">{deleteIcon}</div>
                      </div>
                    </div>
                    <div className="mt-2">{cert.category_name}</div>
                  </div>
                ))}
              </div>
            )}

            <ICCommonModal
              title={t("upload_certificate")}
              content={certificateContent}
              isModalShow={isBottomDivVisible}
              setIsModalShow={setIsBottomDivVisible}
            />
            {certificate.length > 0 && (
              <div className="flex items-center justify-center top">
                <button
                  type="button"
                  className={`
              bg-transparent bg-main-primary rounded-full`}
                >
                  <div
                    className="w-10 h-10 cursor-pointer"
                    onClick={handleEditClick}
                  >
                    {addCertificateIcon}
                  </div>
                </button>
              </div>
            )}
          </div>
          {certificate.length === 0 && (
            <div className="flex items-center justify-center">
              <button
                type="button"
                className={`
                bg-transparent bg-main-primary rounded-full`}
              >
                <div
                  className="w-10 h-10 cursor-pointer"
                  onClick={handleEditClick}
                >
                  {addCertificateIcon}
                </div>
              </button>
            </div>
          )}
          <div className="buttons p-3 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase  sm:mr-1 sm:mb-0 mb-2`}
              onClick={previous}
            >
              {t("previous")}
            </ICButton>

            {certificate.length > 0 ? (
              <ICButton
                type="button"
                className={`uppercase  sm:ml-10`}
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                {t("next")}
              </ICButton>
            ) : (
              <ICButton
                type="button"
                className={`uppercase  sm:ml-10`}
                onClick={setNext}
              >
                {t("skip")}
              </ICButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerCertificates;
