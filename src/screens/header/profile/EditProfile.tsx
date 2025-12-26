import React, { useEffect, useRef, useState } from "react";
import BackButton from "../../../components/common/BackButton";
import Loader from "../../../components/common/Loader";
import {
  IEditUser,
  IUserField,
  deleteUser,
  editValidationSchema,
  getUserData,
  submitEditUser,
} from "./EditProfileController";
import { useFormik } from "formik";
import { IDDL } from "../../../data/AppInterface";
import { fetchUserGender } from "../../user/user-gender/UserGenderController";
import Select, { GroupBase } from "react-select";
import { useNavigate } from "react-router-dom";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import {
  cameraIcon,
  deleteProfileIcon,
  editIcon,
} from "../../../assets/icons/SvgIconList";
import { fetchUserLanguages } from "../../user/user-languages/UserLanguageController";
import { encryptData, toastError } from "../../../utils/AppFunctions";
import { MESSAGE_UNKNOWN_ERROR_OCCURRED } from "../../../utils/AppConstants";
import ICTextInput from "../../../core-component/ICTextInput";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import ICCommonModal from "../../../components/common/ICCommonModel";
import { fetchUploadImageService } from "../../image-service/ImageServices";
import { IMAGE_TYPE } from "../../../utils/AppEnumerations";
import ICImage from "../../../core-component/ICImage";
import { DELETE_PRESIGNED_URL } from "../../../services/user/UserServices";
import Swal from "sweetalert2";
import ICButton from "../../../core-component/ICButton";
import { getUserBloodGroup } from "../../user/user-health/UserHealthController";
import ICDropDown from "../../../core-component/ICDropDown";
import AlternativeMobile from "./alternate-mobile/AlternateMobile";
import {
  IAlternateMobileNumber,
  submitAlternativeUserInfo,
} from "./alternate-mobile/AlternateMobileController";
import UserAltMobileVerify from "./verify-alternate-mobile/VerifyAlternateMobile";

interface ITransformedOption {
  value: number;
}

const EditProfile = () => {
  const [isBottomDivVisible, setIsBottomDivVisible] = useState(false);
  const [userData, setUserData] = useState<IEditUser | undefined>();
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState<IDDL[]>([]);
  const [languages, setLanguages] = useState<IDDL[]>([]);
  const [selectedGender, setSelectedGender] = useState(1);
  const navigate = useNavigate();
  const { t } = UseTranslationHook();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const userId = localStorageUtils.getUserId();
  const profileUrl = localStorageUtils.getProfileUrl();
  const [bloodGroup, setBloodGroup] = useState<IDDL[]>([]);
  const [selectedBloodGroupId, setSelectedBloodGroupId] = useState<
    number | null
  >(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(
    null
  );
  const hasMultipleProfile = localStorageUtils.getMultipleProfile();
  const [alternateMobileVerify, setAlternateMobileVerify] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [alternateMobile, setAlternateMobile] = useState("");
  const [selectedRelationId, setSelectedRelationId] = useState<
    number | null | undefined
  >(null);

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
    setAlternateMobileVerify(false);
    setAlternateMobile("");
    setSelectedRelationId(null);
    setShowOtpVerification(false);
  };

  const initialValuesAddress = {
    full_name: userData?.full_name || "",
    email: userData?.email || "",
    blood_group: userData?.blood_group || "",
    gender_title: userData?.gender_title || "",
    gender_id: userData?.gender_id || "",
    languages: userData?.languages || [],
    app_media: {
      media_url: userData?.app_user?.pp?.media_url || "",
    },
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesAddress,
    validationSchema: editValidationSchema(t),

    onSubmit: async (values) => {
      let profileValue: any = null;

      if (selectedImage) {
        const formData = new FormData();
        formData.append("myImageFile", selectedImage);
        formData.append("type", IMAGE_TYPE.Profile);
        userId && formData.append("typeId", userId);
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

      const userPayload: IUserField[] = [
        { type: "full_name", value: formik.values.full_name },
        { type: "email", value: formik.values.email },
        { type: "gender", value: selectedGender },
        { type: "languages", value: formik.values.languages },
      ];

      if (selectedBloodGroup || formik.values.blood_group) {
        userPayload.push({
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

        userPayload.push({
          type: "profile",
          value: profile,
        });
      }

      localStorageUtils.setProfileUrl(
        profileValue
          ? profileValue.media_url
          : formik.values.app_media.media_url
      );

      await submitEditUser(userPayload, navigate, t);
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
    getUserData(setUserData, setLoading);
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

  const editPictureOptions = (
    <>
      <div className="flex items-center">
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
        className="flex items-center mt-4 cursor"
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

  const handleAlternativeMobileSubmit = async (
    values: IAlternateMobileNumber
  ) => {
    const alternativeUserInfo = await submitAlternativeUserInfo(values);
    if (alternativeUserInfo) {
      setShowOtpVerification(true);
      setAlternateMobile(values.alternate_phone);
      setSelectedRelationId(values.relation_id);
    }
  };

  const alternativeInitialValue = {
    alternate_phone:
      alternateMobile ||
      (userData &&
        userData.alternate_phone &&
        userData.alternate_phone.toString()) ||
      "",
    relation_id:
      selectedRelationId || (userData && userData.relation_id) || null,
  };
  const [selectedRelation, setSelectedRelation] = useState("");
  const verifyAlternateMobile = showOtpVerification ? (
    <UserAltMobileVerify
      alternateMobileNumber={alternateMobile}
      selectedRelation={selectedRelation}
      relationId={Number(selectedRelationId)}
      onEditClick={() => setShowOtpVerification(false)}
      onClose={() => {
        handleCancelClick();
        getUserData(setUserData, setLoading);
      }}
      onResendOtp={handleAlternativeMobileSubmit}
    />
  ) : (
    <AlternativeMobile
      onSubmit={handleAlternativeMobileSubmit}
      initialValues={alternativeInitialValue}
      selectedRelation={selectedRelation}
      setSelectedRelation={setSelectedRelation}
    />
  );

  const handleConfirm = () => {
    Swal.fire({
      title:
        hasMultipleProfile == "true"
          ? t("delete_confirmation")
          : t("delete_user_confirmation"),
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

  useEffect(() => {
    getUserBloodGroup(setBloodGroup, setLoading);
  }, []);

  const handleOptionClick = (option: string, selected_id: number) => {
    setSelectedBloodGroupId(selected_id);
    setSelectedBloodGroup(option);
  };

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

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding container  h-svh md:h-[calc(100vh-76px)] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center">
            <BackButton />
            <p className="comman-black-text">{t("my_profile")}</p>
            <div className="w-9"></div>
          </div>
          <div className="flex justify-center  flex-1  overflow-y-scroll">
            <div className={`w-full lg:w-1/2`}>
              <div className="top">
                <div className="flex justify-center items-center w-full">
                  <div className="profile-image border-2 border-profile rounded-full overflow-hidden p-1">
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
                        fallbackSrc={require("../../../assets/image/avatar.png")}
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
                <div className="top">
                  <ICTextInput
                    placeholder={t("name")}
                    name="full_name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                      formik.touched.full_name
                        ? formik.errors.full_name
                        : undefined
                    }
                  />
                </div>
                <div className="top">
                  <ICTextInput
                    placeholder={t("email")}
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    errorMessage={
                      formik.touched.email ? formik.errors.email : undefined
                    }
                  />
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
                <div className="comman-black-text top !text-[16px]">
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
                    <div className="text-red-600">
                      {formik.touched.languages &&
                        formik.errors?.languages &&
                        formik.errors?.languages}
                    </div>
                  </div>
                </div>
                <div className="top">
                  <p className="comman-black-text">{t("gender")}</p>
                  <div className="flex items-center mt-2">
                    {gender &&
                      gender.length > 0 &&
                      gender
                        .filter((data) => data.data_value === selectedGender)
                        .map((data, index) => (
                          <div className="mr-3 flex items-center" key={index}>
                            <input
                              type="radio"
                              value={data.data_value}
                              checked={selectedGender === data.data_value}
                              // onChange={handleRadioChange}
                              className={`w-4 h-4 comman-blue focus:ring-0 dark:focus:ring-0 focus:border-0 radio-button-input`}
                            />
                            <label className="ms-2 text-sm font-medium comman-black-text">
                              {data.display_value}
                            </label>
                          </div>
                        ))}
                  </div>
                </div>

                <div className="top">
                  {userData && userData.alternate_phone ? (
                    <div className="comman-black-text">
                      <div className="flex items-center">
                        <p>{t("alternate_mobile_number")}</p>
                        <div
                          className="cursor w-5 h-5 ml-5"
                          onClick={() => {
                            setAlternateMobileVerify(true);
                          }}
                        >
                          {editIcon}
                        </div>
                      </div>
                      <div className="flex items-center mt-1">
                        <div>
                          {userData.relation_title} : {userData.alternate_phone}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="comman-blue cursor"
                      onClick={() => {
                        setAlternateMobileVerify(true);
                      }}
                    >
                      <p>{t("add_alternate_mobile")}</p>
                    </div>
                  )}
                </div>

                <div className="top">
                  <ICButton
                    type="button"
                    children={t("save")}
                    loading={formik.isSubmitting}
                    className={`uppercase ${
                      !formik.isValid
                        ? // || !selectedBloodGroup
                          "cursor-not-allowed comman-disablebtn"
                        : "comman-btn"
                    }`}
                    onClick={() => formik.handleSubmit()}
                    disabled={
                      formik.isSubmitting || !formik.isValid
                      // || !selectedBloodGroup
                    }
                  />
                </div>
              </div>

              <div className="top">
                <ICButton
                  className="cursor uppercase !text-white !bg-red-600"
                  onClick={handleConfirm}
                  children={t("delete_your_account")}
                  loading={loading}
                  disabled={loading}
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
            {alternateMobileVerify && (
              <ICCommonModal
                title={t("verify_alternate_mobile")}
                content={verifyAlternateMobile}
                isModalShow={alternateMobileVerify}
                setIsModalShow={setAlternateMobileVerify}
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
