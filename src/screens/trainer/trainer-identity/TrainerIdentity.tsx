import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import Loader from "../../../components/common/Loader";
import UseTranslationHook from "../../../hooks/UseTranslationHook";
import { TReactSetState } from "../../../data/AppType";
import ProofInputComponent from "../../../components/common/ProofInput";
import {
  addressOptions,
  identityOptions,
  submitTrainerIdentityDetails,
} from "./trainerIdentityController";
import { useLocation } from "react-router-dom";
import BackButton from "../../../components/common/BackButton";
import {
  IMAGE_TYPE,
  PROOF_TYPE,
  TRAINER_ON_BOARD,
} from "../../../utils/AppEnumerations";
import { localStorageUtils } from "../../../utils/LocalStorageUtil";
import BackToOverviewButton from "../../../components/common/BackToOverviewButton";
import useFullHeightBackground from "../../../components/common/useFullHeghtBackground";
import ICButton from "../../../core-component/ICButton";
import { fetchUploadImageService } from "../../image-service/ImageServices";

interface IUserAlternateMobileProps {
  setCurrentIndex: TReactSetState<number>;
}

const TrainerIdentity: React.FC<IUserAlternateMobileProps> = ({
  setCurrentIndex,
}) => {
  const { t } = UseTranslationHook();
  const [loading, setLoading] = useState(false);
  const userId = localStorageUtils.getUserId();
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [identityMediaUrl, setIdentityMediaUrl] = useState<string>("");
  const [addressMediaUrl, setAddressMediaUrl] = useState<string>("");
  const [identityDocumentId, setIdentityDocumentId] = useState(0);
  const [identityDocumentImageUrl, setIdentityDocumentImageUrl] = useState("");
  const [addressDocumentId, setAddressDocumentId] = useState(0);
  const [addressDocumentImageUrl, setAddressDocumentImageUrl] = useState("");

  const handleOptionSelect = (
    option: string,
    proofType: string,
    documentId: number
  ) => {
    if (proofType === PROOF_TYPE.Identity) {
      setIdentityDocumentId(documentId); // Set identity document ID
    } else if (proofType === PROOF_TYPE.Address) {
      setAddressDocumentId(documentId); // Set address document ID
    }
  };

  const handleFileSelect = (
    file: File | null,
    proofType: string,
    documentId: number // Receive document ID
  ) => {
    if (proofType === PROOF_TYPE.Identity) {
      setIdentityFile(file);
      setIdentityDocumentId(documentId); // Set identity document ID
    } else if (proofType === PROOF_TYPE.Address) {
      setAddressFile(file);
      setAddressDocumentId(documentId); // Set address document ID
    }
  };

  const uploadFileAndSetUrl = async (
    file: File,
    setMediaUrl: (url: string) => void
  ): Promise<string> => {
    const formData = new FormData();
    formData.append(`myImageFile`, file);
    formData.append("type", IMAGE_TYPE.Identity);
    userId && formData.append("typeId", userId);
    const mediaUrl = await fetchUploadImageService(formData);
    setMediaUrl(mediaUrl); // Update media URL state with callback function
    return mediaUrl; // Return the uploaded URL
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        setIdentityDocumentId(updatedDetails?.identity_document_id || 0);
        setIdentityDocumentImageUrl(
          updatedDetails?.identity_document_image_url || ""
        );
        setAddressDocumentId(updatedDetails?.address_document_id || 0);
        setAddressDocumentImageUrl(
          updatedDetails?.address_document_image_url || ""
        );
      }
    };

    fetchData();
  }, []);

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

  const handleSubmit = async () => {
    setLoading(true);

    try {
      let identityUrl = ""; // Initialize variables to store URLs
      let addressUrl = "";

      if (identityFile) {
        identityUrl = await uploadFileAndSetUrl(
          identityFile,
          setIdentityMediaUrl
        );
      }

      if (addressFile) {
        addressUrl = await uploadFileAndSetUrl(addressFile, setAddressMediaUrl);
      }

      // Create trainerIdentityPayload with the uploaded URLs
      const trainerIdentityPayload = {
        identity_document_image_url: identityUrl || identityDocumentImageUrl, // Use uploaded URL if available, otherwise use state value
        address_document_image_url: addressUrl || addressDocumentImageUrl, // Use uploaded URL if available, otherwise use state value
        identity_document_id: identityDocumentId,
        address_document_id: addressDocumentId,
      };

      await submitTrainerIdentityDetails(
        trainerIdentityPayload,
        Number(userId),
        setCurrentIndex,
        setLoading,
        t,
        () => updateQueryStringParameter("ud", 2)
      );
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const privious = () => {
    updateQueryStringParameter("qa", 8);
    navigate(-1);
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentIndex((prev) => prev - 1);
      updateQueryStringParameter("qa", 8);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [setCurrentIndex]);

  const backOverview = () => {
    setCurrentIndex(TRAINER_ON_BOARD.TrainerProfileOverview);
  };

  const mainBgRef = useRef<HTMLDivElement>(null);
  const isFullHeight = useFullHeightBackground(mainBgRef);

  return (
    <div className="xl:flex xl:justify-center">
      {loading ? (
        <Loader />
      ) : (
        <div
          ref={mainBgRef}
          className={`${
            isFullHeight ? "h-[96vh]" : "h-auto"
          } xl:w-1/2 flex flex-col justify-between`}
        >
          <div className="grid grid-cols-1 ">
            <div className="flex items-center justify-between">
              <BackButton />
              <div>
                <BackToOverviewButton onClick={backOverview} />
              </div>
            </div>

            <ProofInputComponent
              title={t("proof_identity")}
              options={identityOptions}
              proofType="identity"
              onFileSelect={(file, proofType, documentId) =>
                handleFileSelect(file, proofType, documentId)
              }
              onOptionSelect={(option, proofType, documentId) =>
                handleOptionSelect(option, proofType, documentId)
              }
              onDeleteFile={() => setIdentityDocumentImageUrl("")}
            />
            <ProofInputComponent
              title={t("proof_address")}
              options={addressOptions}
              proofType="address"
              onFileSelect={(file, proofType, documentId) =>
                handleFileSelect(file, proofType, documentId)
              }
              onOptionSelect={(option, proofType, documentId) =>
                handleOptionSelect(option, proofType, documentId)
              }
              onDeleteFile={() => setAddressDocumentImageUrl("")}
            />
          </div>

          <div className="buttons p-3 flex flex-col sm:flex-row items-center justify-center">
            <ICButton
              type="button"
              className={`uppercase  sm:mr-1 sm:mb-0 mb-2`}
              onClick={privious}
            >
              {t("previous")}
            </ICButton>
            <ICButton
              type="button"
              children={t("upload_documents")}
              className={`uppercase sm:ml-10 ${
                identityDocumentId === 0 ||
                addressDocumentId === 0 ||
                (identityFile === null && identityDocumentImageUrl === "") ||
                (addressFile === null && addressDocumentImageUrl === "")
                  ? "cursor-not-allowed comman-disablebtn"
                  : "comman-btn"
              }`}
              onClick={handleSubmit}
              disabled={
                identityDocumentId === 0 ||
                addressDocumentId === 0 ||
                (identityFile === null && identityDocumentImageUrl === "") ||
                (addressFile === null && addressDocumentImageUrl === "")
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerIdentity;
