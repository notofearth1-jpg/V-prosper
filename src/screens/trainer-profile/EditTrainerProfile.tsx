import React, { useEffect, useRef, useState } from "react";
import {
  deleteUser,
  editValidationSchema,
} from "../header/profile/EditProfileController";
import { useNavigate } from "react-router-dom";
import { IDDL } from "../../data/AppInterface";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { useFormik } from "formik";
import { MESSAGE_UNKNOWN_ERROR_OCCURRED } from "../../utils/AppConstants";
import { encryptData, toastError } from "../../utils/AppFunctions";
import { TOnChangeInput } from "../../data/AppType";
import Select, { GroupBase } from "react-select";
import { fetchUserGender } from "../user/user-gender/UserGenderController";
import { fetchUserLanguages } from "../user/user-languages/UserLanguageController";
import Loader from "../../components/common/Loader";
import BackButton from "../../components/common/BackButton";
import { cameraIcon, deleteProfileIcon } from "../../assets/icons/SvgIconList";
import {
  IEditTrainer,
  getInitialValuesTrainer,
  getTrainerData,
  submitEditTrainer,
} from "./EditTrainerProfileController";
import {
  DELETE_PRESIGNED_URL,
  ITrainerField,
} from "../../services/user/UserServices";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import ICCommonModal from "../../components/common/ICCommonModel";
import { fetchUploadImageService } from "../image-service/ImageServices";
import { IMAGE_TYPE } from "../../utils/AppEnumerations";
import ICImage from "../../core-component/ICImage";
import Swal from "sweetalert2";
import ICButton from "../../core-component/ICButton";
import { getUserBloodGroup } from "../user/user-health/UserHealthController";
import ICDropDown from "../../core-component/ICDropDown";

interface ITransformedOption {
  value: number;
}

const EditProfile = () => {
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [userData, setUserData] = useState<IEditTrainer | undefined>();
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState<IDDL[]>([]);
  const [languages, setLanguages] = useState<IDDL[]>([]);
  const [selectedGender, setSelectedGender] = useState(1);
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const trainerId = localStorageUtils.getTrainerId();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBloodGroupId, setSelectedBloodGroupId] = useState<
    number | null
  >(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(
    null
  );
  const [bloodGroup, setBloodGroup] = useState<IDDL[]>([]);

  const profileUrl = localStorageUtils.getProfileUrl();
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
    }
    setIsBottomDivVisible(false);
  };

  const handleEditClick = () => {
    setIsBottomDivVisible(true);
  };

  const handleCancelClick = () => {
    setIsBottomDivVisible(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValuesTrainer(userData),
    validationSchema: editValidationSchema(t),

    onSubmit: async (values) => {
      let profileValue: any = null;
      if (selectedImage) {
        const formData = new FormData();
        formData.append("myImageFile", selectedImage);
        formData.append("type", IMAGE_TYPE.Profile);
        trainerId && formData.append("typeId", trainerId);
        const response = await fetchUploadImageService(formData);
        if (response) {
          profileValue = {
            media_type: "i",
            media_url: response,
          };
        } else {
          toastError(MESSAGE_UNKNOWN_ERROR_OCCURRED);
        }
      }

      const trainerPayload: ITrainerField[] = [
        { type: "full_name", value: formik.values.full_name },
        { type: "email", value: formik.values.email },
        { type: "gender", value: selectedGender },
        { type: "languages", value: formik.values.languages },
        {
          type: "trainerInfo",
          value: {
            has_own_session_space: formik.values.has_own_session_space,
            has_space_for_rent: formik.values.has_space_for_rent,
            is_marketing_partner: formik.values.is_marketing_partner,
            headline: formik.values.headline,
            bio: formik.values.bio,
          },
        },
      ];

      if (selectedBloodGroup || formik.values.blood_group) {
        trainerPayload.push({
          type: "blood_group",
          value: selectedBloodGroup || formik.values.blood_group,
        });
      }

      if (formik.values.app_media.media_url || profileValue) {
        const profile = profileValue
          ? profileValue
          : {
              media_type: "i",
              media_url: formik.values.app_media.media_url,
            };

        trainerPayload.push({
          type: "profile",
          value: profile,
        });
      }

      localStorageUtils.setProfileUrl(
        profileValue
          ? profileValue.media_url
          : formik.values.app_media.media_url
      );

      await submitEditTrainer(trainerPayload, navigate, t);
    },
  });

  const transformLanguagesToOptions = (languages: IDDL[]): any[] => {
    return languages.map((language) => ({
      value: language.data_value,
      label: language.display_value,
    }));
  };

  const groupedOptions: GroupBase<ITransformedOption>[] = [
    {
      label: "Languages",
      options: transformLanguagesToOptions(languages),
    },
  ];

  const handleSelectChange = (selectedOptions: any) => {
    formik.setFieldValue(
      "languages",
      selectedOptions.map((option: { value: any }) => option.value)
    );
  };

  useEffect(() => {
    getTrainerData(setUserData, setLoading);
    fetchUserGender(setGender, setLoading, t);
    fetchUserLanguages(setLanguages, setLoading, t);
  }, []);

  useEffect(() => {
    setSelectedGender(userData?.gender_id ?? -1);
  }, [userData]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleRemovePicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setSelectedImage(null);
      formik.setFieldValue("app_media.media_url", "");
      profileUrl && DELETE_PRESIGNED_URL(encryptData(profileUrl));
    }
    setIsBottomDivVisible(false);
  };

  useEffect(() => {
    getUserBloodGroup(setBloodGroup, setLoading);
  }, []);

  useEffect(() => {
    if (userData && userData.blood_group) {
      const selectedRelation = bloodGroup.find(
        (data) => data.display_value === userData.blood_group
      );
      if (selectedRelation) {
        setSelectedBloodGroup(selectedRelation.display_value);
        setSelectedBloodGroupId(selectedRelation.data_value);
      }
    }
  }, [userData, bloodGroup]);

  const editPictureOptions = (
    <>
      <div className="flex items-center mt-5">
        <label
          htmlFor="imageInput"
          className="cursor-pointer flex items-center"
        >
          <div className="w-6 h-6 mr-2">{cameraIcon}</div>
          <p className="comman-black-big">{t("take_a_picture")}</p>
        </label>
        <input
          type="file"
          id="imageInput"
          accept=".jpg, .jpeg, .png"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      <div
        className="flex items-center mt-5 cursor"
        onClick={handleRemovePicture}
      >
        <div className="w-6 h-6">{deleteProfileIcon}</div>
        <p className="comman-black-big ml-2">{t("remove_current_picture")}</p>
        <input
          type="file"
          id="imageInput"
          accept=".jpg, .jpeg, .png"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>
    </>
  );

  const handleOptionClick = (option: string, selected_id: number) => {
    setSelectedBloodGroupId(selected_id);
    setSelectedBloodGroup(option);
  };

  const handleConfirm = () => {
    Swal.fire({
      title: t("delete_confirmation"),
      text: t("not_able_revert"),
      icon: "warning",
      input: "text",
      inputPlaceholder: t("permanently_delete"),
      inputValidator: (value) => {
        // Validate input (case-insensitive)
        if (value.toLowerCase() !== "permanently delete") {
          return t("must_type_permanently_delete");
        }
      },
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(setLoading, navigate);
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="container mx-auto comman-padding h-svh md:h-[calc(100vh-76px)] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center">
            <BackButton />
            <p className="comman-black-text !text-[16px]">{t("my_profile")}</p>
            <div className="w-7"></div>
          </div>
          <div className="flex justify-center flex-1 overflow-y-scroll remove-scrollbar-width">
            <div className={` w-full lg:w-1/2 `}>
              <div className="top">
                <div className="flex justify-center items-center w-full">
                  <div className="profile-image border-2 border-profile rounded-full overflow-hidden p-1 ">
                    {selectedImage ? (
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <ICImage
                        className="w-full h-full object-cover rounded-full"
                        imageUrl={formik.values.app_media.media_url}
                        fallbackSrc={require("../../assets/image/avatar.png")}
                        alt={t("image")}
                        isPrivate
                      />
                    )}
                  </div>
                </div>
              </div>
              <div
                className="top comman-blue text-center cursor"
                onClick={handleEditClick}
              >
                <p>{t("edit_picture_or_avatar")}</p>
              </div>
              <div className="top edit-container">
                <div className="comman-black-text !text-[16px]">
                  <p>{t("name")}</p>
                  <input
                    type="text"
                    className={`border-b-2 border-r-0 border-t-0 border-l-0 border-solid input-border focus:outline-none w-full mt-2 bg-transparent ${
                      isBottomDivVisible ? "edit-input-bg" : ""
                    }`}
                    name="full_name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-skin-trainer-validation">
                    {formik.touched.full_name &&
                      formik.errors?.full_name &&
                      formik.errors?.full_name}
                  </div>
                </div>
                <div className="comman-black-text !text-[16px] top">
                  <p>{t("email")}</p>
                  <input
                    type="text"
                    className={`border-b-2 border-r-0 border-t-0 border-l-0 border-solid input-border focus:outline-none w-full mt-2 bg-transparent ${
                      isBottomDivVisible ? "edit-input-bg" : ""
                    }`}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <div className="text-skin-trainer-validation">
                    {formik.touched.email &&
                      formik.errors?.email &&
                      formik.errors?.email}
                  </div>
                </div>

                <div className="top">
                  <ICDropDown
                    label={t("select_blood_group")}
                    selected={
                      selectedBloodGroupId ? selectedBloodGroupId : undefined
                    }
                    className={"w-full"}
                    options={bloodGroup.map((data, index) => ({
                      label: data.display_value,
                      value: data.data_value,
                    }))}
                    onSelect={(option) =>
                      handleOptionClick(option.label, option.value)
                    }
                  />
                </div>
                <div className="comman-black-text !text-[16px] top">
                  <p>{t("language")}</p>
                  <div className="mt-2">
                    <Select
                      isMulti
                      options={groupedOptions as GroupBase<never>[]}
                      onChange={handleSelectChange}
                      value={transformLanguagesToOptions(languages).filter(
                        (option) =>
                          formik.values.languages.includes(
                            option.value as never
                          )
                      )}
                      placeholder="Select languages..."
                    />
                    <div className="text-skin-trainer-validation">
                      {formik.touched.languages &&
                        formik.errors?.languages &&
                        formik.errors?.languages}
                    </div>
                  </div>
                </div>
                <div className="top">
                  <p className="comman-black-text !text-[16px]">
                    {t("gender")}
                  </p>
                  <div className="flex items-center mt-2">
                    {gender
                      .filter((data) => data.data_value === selectedGender)
                      .map((data, index) => (
                        <div
                          className="mb-4 mr-3 flex items-center"
                          key={index}
                        >
                          <input
                            type="radio"
                            value={data.data_value}
                            checked={selectedGender === data.data_value}
                            // onChange={handleRadioChange}
                            className={`w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input`}
                          />
                          <label className="ms-2 text-sm font-medium comman-black-text !text-[16px]">
                            {data.display_value}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="comman-black-text !text-[16px] top">
                  <p className="mb-3">{t("would_you_like")}</p>
                  <div className="top flex items-center">
                    <div className="flex items-center mb-4 mr-2">
                      <input
                        id="default-radio-1"
                        type="radio"
                        name="default-radio"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="1"
                        checked={formik.values.is_marketing_partner === "1"}
                        onChange={() =>
                          formik.setFieldValue("is_marketing_partner", "1")
                        }
                      />
                      <label
                        htmlFor="default-radio-1"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("Yes")}
                      </label>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        id="default-radio-2"
                        type="radio"
                        name="default-radio"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="0"
                        checked={formik.values.is_marketing_partner === "0"}
                        onChange={() =>
                          formik.setFieldValue("is_marketing_partner", "0")
                        }
                      />
                      <label
                        htmlFor="default-radio-2"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("no")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="comman-black-text !text-[16px] top">
                  <p className="mb-3">{t("do_you_own")}</p>
                  <div className="top flex items-center">
                    <div className="flex items-center mb-4 mr-2">
                      <input
                        id="default-radio-1-1"
                        type="radio"
                        name="default-radio-own"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="1"
                        checked={formik.values.has_own_session_space === "1"}
                        onChange={() =>
                          formik.setFieldValue("has_own_session_space", "1")
                        }
                      />
                      <label
                        htmlFor="default-radio-1-1"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("Yes")}
                      </label>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        id="default-radio-1-2"
                        type="radio"
                        name="default-radio-own"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="0"
                        checked={formik.values.has_own_session_space === "0"}
                        onChange={() =>
                          formik.setFieldValue("has_own_session_space", "0")
                        }
                      />
                      <label
                        htmlFor="default-radio-1-2"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("no")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="comman-black-text !text-[16px] top ">
                  <p className="mb-3">{t("do_you_rent")}</p>
                  <div className="top flex items-center">
                    <div className="flex items-center mb-4 mr-2">
                      <input
                        id="default-radio-2-1"
                        type="radio"
                        name="default-radio-rent"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="1"
                        checked={formik.values.has_space_for_rent === "1"}
                        onChange={() =>
                          formik.setFieldValue("has_space_for_rent", "1")
                        }
                      />
                      <label
                        htmlFor="default-radio-2-1"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("Yes")}
                      </label>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        id="default-radio-2-2"
                        type="radio"
                        name="default-radio-rent"
                        className="w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input"
                        value="0"
                        checked={formik.values.has_space_for_rent === "0"}
                        onChange={() =>
                          formik.setFieldValue("has_space_for_rent", "0")
                        }
                      />
                      <label
                        htmlFor="default-radio-2-2"
                        className="ms-2 text-sm font-medium"
                      >
                        {t("no")}
                      </label>
                    </div>
                  </div>
                </div>

                <div className="comman-black-text !text-[16px] top">
                  <p>{t("headline")}</p>
                  <input
                    type="text"
                    className={`border-b-2 border-r-0 border-t-0 border-l-0 border-solid input-border bg-tranceperent-input focus:outline-none w-full mt-2 ${
                      isBottomDivVisible ? "edit-input-bg" : ""
                    }`}
                    name="headline"
                    value={formik.values.headline}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>

                <div className="comman-black-text !text-[16px] top">
                  <p>{t("bio")}</p>
                  <textarea
                    className="w-full input-shadow text-area input-placehoder top"
                    placeholder={t("enter_bio")}
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  ></textarea>
                </div>
                <div className="top">
                  <ICButton
                    type="button"
                    children={t("save")}
                    loading={formik.isSubmitting}
                    className={`uppercase`}
                    onClick={() => formik.handleSubmit()}
                    disabled={formik.isSubmitting}
                  />
                </div>
              </div>
              {/* for future use */}
              <div className="top">
                <ICButton
                  className="cursor uppercase !text-white !bg-red-600"
                  onClick={handleConfirm}
                  children={t("delete_your_account")}
                ></ICButton>
              </div>
            </div>

            {isBottomDivVisible && (
              <ICCommonModal
                title={t("select_profile_picture")}
                content={editPictureOptions}
                isModalShow={isBottomDivVisible}
                setIsModalShow={setIsBottomDivVisible}
                handleCloseButton={handleCancelClick}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
