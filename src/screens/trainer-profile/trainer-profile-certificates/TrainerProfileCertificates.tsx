import React, { useEffect, useRef, useState } from "react";
import {
  fetchTrainerCertificate,
  monthsDropdown,
} from "../../trainer/trainer-certificates/TraiinerCertificatesController";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { IDDL } from "../../../data/AppInterface";
import { TOnChangeInput } from "../../../data/AppType";
import {
  encryptData,
  handleNumericInput,
  sweetAlertError,
} from "../../../utils/AppFunctions";
import Loader from "../../../components/common/Loader";
import {
  addCertificateIcon,
  deleteIcon,
  editIcon,
} from "../../../assets/icons/SvgIconList";
import ICDropDown from "../../../core-component/ICDropDown";
import ICTextInput from "../../../core-component/ICTextInput";
import {
  ITrainerProfileCertificates,
  deleteTrainerCertificateData,
  getTrainerCertificateById,
  getTrainerCertificateData,
  submitTrainerCertificateData,
  trainerCertificateValidationSchema,
  updateTrainerCertificateData,
} from "./TrainerProfileCertificatesController";
import { useFormik } from "formik";
import ICButton from "../../../core-component/ICButton";
import ICImage from "../../../core-component/ICImage";
import BackButton from "../../../components/common/BackButton";
import { fetchUploadImageService } from "../../image-service/ImageServices";
import { IMAGE_TYPE } from "../../../utils/AppEnumerations";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import { DELETE_PRESIGNED_URL } from "../../../services/user/UserServices";
import ICCommonModal from "../../../components/common/ICCommonModel";

const TrainerProfileCertificates: React.FC = ({}) => {
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const { t } = UseTranslationHook();
  const [trainerCertificateType, setTrainerCertificateType] = useState<IDDL[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [certificateId, setCertificateId] = useState<number | null>(null);
  const [loadingCertificate, setLoadingCertificate] = useState(false);
  const [certificate, setCertificate] = useState<ITrainerProfileCertificates[]>(
    []
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const userId = localStorageUtils.getUserId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mainBgRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<ITrainerProfileCertificates>({
    cert_type: 0,
    exp_month: 1,
    exp_year: null,
    app_media: [],
    id: 0,
    category_title: "",
    cert_image_url: "",
  });
  const [deletedCertificate, setDeletedCertificate] = useState<string>("");

  const handleEditClick = () => {
    setIsBottomDivVisible(true);
  };

  const onCancel = () => {
    setIsBottomDivVisible(false);
    setValues((prevValues) => ({
      ...prevValues,
      cert_type: 0,
      exp_month: 1,
      exp_year: null,
      app_media: [],
      cert_image_url: "",
    }));
    setCertificateId(null);
    setSelectedFile(null);
  };

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

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteCertificate = async (id: number, imgUrl: string) => {
    await deleteTrainerCertificateData(id, t);
    imgUrl && (await DELETE_PRESIGNED_URL(encryptData(imgUrl)));
    await getTrainerCertificateData(setCertificate, setLoadingCertificate);
  };

  const handelUpdate = (id: number) => {
    setIsBottomDivVisible(true);
    getTrainerCertificateById(setValues, id, setLoading);
    setCertificateId(id);
  };

  const handleDelete = () => {
    setSelectedFile(null);
    setValues((prevValues) => ({
      ...prevValues,
      app_media: [],
      cert_image_url: "",
    }));
  };

  const handleDeleteUpdatedCertificate = async (imgUrl: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      app_media: [],
      cert_image_url: "",
    }));
    setDeletedCertificate(imgUrl);
  };

  const formik = useFormik({
    initialValues: values,
    validationSchema: trainerCertificateValidationSchema(t),
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      formik.setSubmitting(true);
      let imageUrl = null;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("myImageFile", selectedFile);
        formData.append("type", IMAGE_TYPE.Certificates);
        userId && formData.append("typeId", userId);
        const response = await fetchUploadImageService(formData);
        imageUrl = response;
      }

      const certificatePayload = {
        certificate: {
          media_type: "i",
          media_url: imageUrl
            ? imageUrl
            : values?.app_media[0]?.media_url
            ? values?.app_media[0]?.media_url
            : values?.cert_image_url,
          media_title: selectedFile?.name as string,
        },
        ...values,
      };

      if (certificateId) {
        await updateTrainerCertificateData(
          { ...certificatePayload },
          certificateId,
          t
        );
      } else {
        await submitTrainerCertificateData({ ...certificatePayload }, t);
      }
      deletedCertificate &&
        (await DELETE_PRESIGNED_URL(encryptData(deletedCertificate)));
      resetForm();
      setSelectedFile(null);
      setValues((prevValues) => ({
        ...prevValues,
        cert_type: 0,
        exp_month: 1,
        exp_year: null,
        cert_image_url: "",
      }));
      setCertificateId(null);
      setIsBottomDivVisible(false);
      setDeletedCertificate("");

      await getTrainerCertificateData(setCertificate, setLoading);
      formik.setSubmitting(false);
    },
  });

  useEffect(() => {
    getTrainerCertificateData(setCertificate, setLoading);
  }, []);

  useEffect(() => {
    fetchTrainerCertificate(
      setTrainerCertificateType,
      setLoadingCertificate,
      t
    );
    if (certificate.length > 0) {
      setIsBottomDivVisible(false);
    } else {
      setIsBottomDivVisible(true);
    }
  }, [certificate]);

  const certificateForm = (
    <>
      <div className="mt-5">
        <ICDropDown
          label={t("certificate_type")}
          selected={formik.values.cert_type}
          className={"w-full"}
          options={trainerCertificateType.map((data, index) => ({
            label: data.display_value,
            value: data.data_value,
          }))}
          onSelect={(option) => formik.setFieldValue("cert_type", option.value)}
          errorMessage={formik.errors.cert_type}
        />
      </div>

      <div className="top flex space-x-5 ">
        <ICDropDown
          label={t("expire_month")}
          selected={formik.values.exp_month}
          className={"!w-[250px] mt-[6px]"}
          options={monthsDropdown.map((data, index) => ({
            label: data.display_value,
            value: data.data_value,
          }))}
          onSelect={(option) => formik.setFieldValue("exp_month", option.value)}
          errorMessage={formik.errors.exp_month}
        />

        <ICTextInput
          placeholder={t("expiry_year")}
          type="text"
          name="exp_year"
          value={formik.values.exp_year as any}
          onChange={(event) => {
            handleNumericInput(event);
            formik.setFieldValue(
              "exp_year",
              event.target.value ? Number(event.target.value) : undefined
            );
          }}
          onBlur={formik.handleBlur}
          errorMessage={formik.errors.exp_year}
        />
      </div>

      <div className="top">
        {values?.app_media[0]?.media_url || values.cert_image_url ? (
          <div className="border-box flex items-center justify-center flex-col relative ">
            <ICImage
              imageUrl={
                values?.app_media[0]?.media_url
                  ? values?.app_media[0]?.media_url
                  : values.cert_image_url
              }
              alt="Certificate Preview"
              className="h-full w-100"
              isPrivate
            />
            <button
              type="button"
              className="text-skin-trainer-validation mt-2 absolute top-0 right-0 cursor"
              onClick={() => {
                handleDeleteUpdatedCertificate(
                  values?.app_media[0]?.media_url
                    ? values?.app_media[0]?.media_url
                    : values.cert_image_url
                );
              }}
            >
              <div className="w-10 h-10">{deleteIcon}</div>
            </button>
          </div>
        ) : selectedFile ? (
          <div className="border-box flex items-center justify-center flex-col relative ">
            <ICImage
              src={URL.createObjectURL(selectedFile)}
              alt="Preview"
              className="h-full w-100"
            />

            <div
              className="w-10 h-10 absolute top-0 right-0 text-skin-trainer-validation cursor"
              onClick={handleDelete}
            >
              {deleteIcon}
            </div>
          </div>
        ) : (
          <div className="border-box flex items-center justify-center flex-col comman-padding">
            <div className="w-[150px]">
              <ICButton
                type="button"
                className={`cursor text-skin-trainer px-6 py-3 text-sm font-medium rounded shadow-[0_4px_9px_-4px_#3b71ca]
                comman-btn focus:outline-none`}
                onClick={handleBrowseClick}
              >
                <p className="comman-white-text">{t("browse")}</p>
              </ICButton>
            </div>
            <p className="comman-black-text top">
              {t("max_size_error_certificate")}
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".png, .jpeg, .jpg"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        <div className="top">
          {certificateId ? (
            <ICButton
              onClick={() => {
                formik.handleSubmit();
              }}
              loading={formik.isSubmitting}
              disabled={
                !formik.isValid ||
                formik.isSubmitting ||
                (!selectedFile &&
                  (!values.app_media?.length ||
                    !values.app_media[0]?.media_url) &&
                  !values.cert_image_url)
              }
              className={`uppercase ${
                !formik.isValid ||
                formik.isSubmitting ||
                (!selectedFile &&
                  (!values.app_media?.length ||
                    !values.app_media[0]?.media_url) &&
                  !values.cert_image_url)
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
            >
              {t("update_certificate")}
            </ICButton>
          ) : (
            <ICButton
              onClick={() => {
                formik.handleSubmit();
              }}
              disabled={!selectedFile || formik.isSubmitting || !formik.isValid}
              loading={formik.isSubmitting}
              className={`uppercase  ${
                !formik.isValid || !selectedFile
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
            >
              {t("add_certificate")}
            </ICButton>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div
          className={`comman-padding flex flex-col  overflow-hidden h-svh md:h-[calc(100vh-76px)]`}
        >
          <div className="flex items-start justify-start">
            <BackButton />
          </div>
          {certificate && certificate.length > 0 ? (
            <div className="flex-1 justify-center flex overflow-y-scroll remove-scrollbar-width">
              <div
                className="flex justify-center  w-full sm:w-96"
                ref={mainBgRef}
              >
                <div className="w-screen sm:w-96">
                  {certificate.map((cert, index) => (
                    <div className="top review-helth" key={index}>
                      <div className="w-full aspect-16/9 flex justify-center items-center image relative ">
                        <ICImage
                          imageUrl={
                            cert?.app_media[0]?.media_url
                              ? cert?.app_media[0]?.media_url
                              : cert.cert_image_url
                          }
                          alt={"no_image"}
                          className="w-full h-full"
                          isPrivate
                        />
                        {/* this nay need in future */}
                        {/* <div
                          className="w-5 h-5 absolute top-0 right-2 m-2 cursor favorites-icon text-skin-trainer-validation"
                          onClick={() =>
                            handleDeleteCertificate(
                              cert.id,
                              cert?.app_media[0]?.media_url
                            )
                          }
                        >
                          {deleteIcon}
                        </div> */}
                        <div
                          className="w-5 h-5 absolute top-0 right-0 m-2 cursor favorites-icon theme-bg cursor"
                          onClick={() => handelUpdate(cert.id)}
                        >
                          {editIcon}
                        </div>
                      </div>
                      <div className="mt-2 comman-black-text">
                        {cert.category_title}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-center top">
                    <div>
                      <button
                        type="button"
                        className={`bg-transparent bg-main-primary rounded-full`}
                      >
                        <div
                          className="w-10 h-10 cursor"
                          onClick={handleEditClick}
                        >
                          {addCertificateIcon}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-svh md:h-[calc(100vh-76px)] flex items-center justify-center">
              <div>
                <button
                  type="button"
                  className={`
                  bg-transparent bg-main-primary rounded-full`}
                >
                  <div className="w-10 h-10 cursor" onClick={handleEditClick}>
                    {addCertificateIcon}
                  </div>
                </button>
              </div>
            </div>
          )}

          {isBottomDivVisible && (
            <ICCommonModal
              title={t("upload_certificate")}
              content={certificateForm}
              isModalShow={isBottomDivVisible}
              setIsModalShow={setIsBottomDivVisible}
              handleCloseButton={onCancel}
            />
          )}
        </div>
      )}
    </>
  );
};

export default TrainerProfileCertificates;
