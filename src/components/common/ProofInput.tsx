import React, { useState, useRef, useEffect } from "react";
import {
  ADDRESS_PROOF,
  IDENTIFY_PROOF,
  PROOF_LABEL,
  PROOF_TYPE,
} from "../../utils/AppEnumerations";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { deleteIcon, uploadFile } from "../../assets/icons/SvgIconList";

interface IProofInputProps {
  title: string;
  options: string[];
  proofType: string; // New prop to identify proof type
  onFileSelect: (
    file: File | null,
    proofType: string,
    documentId: number
  ) => void; // Include documentId in callback
  onOptionSelect: (
    option: string,
    proofType: string,
    documentId: number
  ) => void;
  onDeleteFile: () => void;
}

const ProofInputComponent: React.FC<IProofInputProps> = ({
  title,
  options,
  proofType,
  onFileSelect,
  onOptionSelect,
  onDeleteFile,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    `Select Your ${title}`
  );
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<number>(0); // State to store document ID

  const toggleDropdown = () => {
    setIsDropdownOpen((prevIsOpen) => !prevIsOpen);
  };

  useEffect(() => {
    const documentId = getDocumentId(selectedOption, proofType);
    setSelectedDocumentId(documentId);
  }, [selectedOption, proofType]);

  const handleOptionClick = (option: string, id: number) => {
    setIsDropdownOpen(false);
    setSelectedOption(option);
    const documentId = getDocumentId(option, proofType);
    setSelectedDocumentId(documentId);
    onOptionSelect(option, proofType, documentId);
  };

  const handleFileSelect = () => {
    const file = fileInputRef.current?.files && fileInputRef.current?.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const documentId = getDocumentId(selectedOption, proofType); // Retrieve document ID from selected option and proofType
      onFileSelect(file, proofType, documentId); // Pass document ID to callback
    }
  };

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileDelete = () => {
    setSelectedFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input value
      onFileSelect(null, proofType, selectedDocumentId);
      onDeleteFile();
    }
  };

  const getDocumentId = (option: string, proofType: string): number => {
    if (proofType === PROOF_TYPE.Identity) {
      switch (option) {
        case PROOF_LABEL.PanCard:
          return IDENTIFY_PROOF.PanCard;
        case PROOF_LABEL.AadhaarCard:
          return IDENTIFY_PROOF.AadhaarCard;
        case PROOF_LABEL.ElectionCard:
          return IDENTIFY_PROOF.ElectionCard;
        case PROOF_LABEL.DrivingLicence:
          return IDENTIFY_PROOF.DrivingLicence;
        default:
          return 0; // Handle default case
      }
    } else if (proofType === PROOF_TYPE.Address) {
      switch (option) {
        case PROOF_LABEL.AadhaarCard:
          return ADDRESS_PROOF.AadhaarCard;
        case PROOF_LABEL.ElectionCard:
          return ADDRESS_PROOF.ElectionCard;
        default:
          return 0; // Handle default case
      }
    } else {
      return 0; // Handle other proof types or default case
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        let documentId;
        if (proofType === PROOF_TYPE.Identity) {
          documentId = updatedDetails.identity_document_id;
          // Set selectedOption based on identity documentId
          switch (documentId) {
            case IDENTIFY_PROOF.PanCard:
              setSelectedOption(PROOF_LABEL.PanCard);
              break;
            case IDENTIFY_PROOF.AadhaarCard:
              setSelectedOption(PROOF_LABEL.AadhaarCard);
              break;
            case IDENTIFY_PROOF.ElectionCard:
              setSelectedOption(PROOF_LABEL.ElectionCard);
              break;
            case IDENTIFY_PROOF.DrivingLicence:
              setSelectedOption(PROOF_LABEL.DrivingLicence);
              break;
            default:
              setSelectedOption(`Select Your ${title}`);
              break;
          }
        } else if (proofType === PROOF_TYPE.Address) {
          documentId = updatedDetails.address_document_id;
          // Set selectedOption based on address documentId
          switch (documentId) {
            case ADDRESS_PROOF.AadhaarCard:
              setSelectedOption(PROOF_LABEL.AadhaarCard);
              break;
            case ADDRESS_PROOF.ElectionCard:
              setSelectedOption(PROOF_LABEL.ElectionCard);
              break;
            default:
              setSelectedOption(`Select Your ${title}`);
              break;
          }
        }
        // Set selectedDocumentId
        setSelectedDocumentId(documentId);
      }
    };

    fetchData();
  }, [proofType]);

  useEffect(() => {
    const fetchData = async () => {
      const storedDetails = await localStorageUtils.getTrainerDetails();
      if (storedDetails) {
        const updatedDetails = JSON.parse(storedDetails);
        let imageUrl;
        if (proofType === PROOF_TYPE.Identity) {
          imageUrl = updatedDetails.identity_document_image_url;
        } else if (proofType === PROOF_TYPE.Address) {
          imageUrl = updatedDetails.address_document_image_url;
        }

        if (imageUrl) {
          const fileName = imageUrl.split("/").pop(); // Get the filename from the URL
          setSelectedFileName(fileName || ""); // Set the filename in the state
        }
      }
    };

    fetchData();
  }, [proofType]);

  const trimTextAfter10Characters = (text: string): string => {
    if (text.length > 25) {
      return text.slice(0, 25) + "...";
    }
    return text;
  };

  return (
    <div>
      <div className="top">
        <p className="comman-black-text">{title}</p>
      </div>
      <div className="top">
        <div className="select">
          <div className="selectBtn cursor" onClick={toggleDropdown}>
            {selectedOption}
          </div>
          <div className={`selectDropdown ${isDropdownOpen ? "toggle" : ""}`}>
            {options.map((option, index) => (
              <div
                key={index}
                className="option cursor"
                onClick={() => handleOptionClick(option, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="top relative">
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileSelect}
        />
        <input
          type="text"
          placeholder="Select File"
          className="border-b-2 border-r-0 border-t-0 border-l-0 border-solid input-border focus:outline-none w-full bg-transparent"
          value={trimTextAfter10Characters(selectedFileName)}
          readOnly
        />
        {selectedFileName && (
          <div
            className="w-6 h-6 identity-delete cursor"
            onClick={handleFileDelete}
          >
            {deleteIcon}
          </div>
        )}
        <div className="w-8 h-8 identity-file cursor" onClick={handleIconClick}>
          {uploadFile}
        </div>
      </div>
    </div>
  );
};

export default ProofInputComponent;
