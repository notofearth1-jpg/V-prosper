import React, { useEffect, useState } from "react";
import ICModal from "./ICModal";
import { TOnChangeInput } from "../data/AppType";
import UseTranslationHook from "../hooks/UseTranslationHook";
import { encryptData, prepareMessageFromParams } from "../utils/AppFunctions";
import { closeIcon } from "../assets/icons/SvgIconList";
import { FILE_NAME_MAX_LENGTH } from "../utils/AppConstants";
import { DELETE_PRESIGNED_URL } from "../services/user/UserServices";
import ICImage from "./ICImage";
import UseMobileLayoutHook from "../hooks/UseMobileLayoutHook";

export interface IMediaItem {
  media_url: string;
  media_title: string;
  media_type: string;
}

const ICFileUpload = ({
  maxFiles,
  maxFileSizeMB,
  acceptedFileTypes,
  onFilesSelected,
  selectedFiles,
  title,
  setSelectedFiles,
  data,
  setData,
  disabled,
  required,
}: {
  title?: string;
  maxFiles: number;
  maxFileSizeMB: number;
  acceptedFileTypes: string[];
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  data?: any;
  setData?: any;
  disabled?: boolean;
  required?: boolean;
}) => {
  const { t } = UseTranslationHook();

  const handleFileRemoveNew = (mediaTitle: string) => {
    DELETE_PRESIGNED_URL(encryptData(mediaTitle));

    const updatedData = data.filter((file: any) =>
      file.media_title
        ? file.media_title !== mediaTitle
        : getFileName(file) !== mediaTitle
    );

    setData(updatedData);
  };
  const [error, setError] = useState("");
  const [totalSelectedSize, setTotalSelectedSize] = useState(0);
  const { isMobile } = UseMobileLayoutHook();

  const handleFileChange = (event: TOnChangeInput) => {
    const files = event.target.files;

    if (files && files.length <= maxFiles) {
      const newFiles = Array.from(files).slice(0, maxFiles);

      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !selectedFiles?.some(
            (existingFile) => existingFile.name === newFile.name
          )
      );

      let totalSize = totalSelectedSize;
      let exceededSize = false;
      let invalidFileTypes = false;

      uniqueNewFiles.forEach((newFile) => {
        if (!acceptedFileTypes.some((type) => newFile.name.endsWith(type))) {
          invalidFileTypes = true;
        } else if (totalSize + newFile.size > maxFileSizeMB * 1024 * 1024) {
          exceededSize = true;
        } else {
          totalSize += newFile.size;
        }
      });

      if (invalidFileTypes) {
        setError(
          prepareMessageFromParams(t("error_message_invalid_file_type"), [
            ["fileType", acceptedFileTypes.join(", ")],
          ])
        );
      } else if (exceededSize) {
        setError(`Total file size exceeds the maximum allowed size.`);
      } else if (selectedFiles.length + uniqueNewFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
      } else {
        setSelectedFiles([...selectedFiles, ...uniqueNewFiles]);
        setTotalSelectedSize(totalSize);
        setError("");
      }
    } else {
      setError(`You can only upload up to ${maxFiles} files`);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleFileRemove = (fileName: string) => {
    setSelectedFiles(selectedFiles.filter((file) => file.name !== fileName));
    setError("");
  };

  const handleConfirm = () => {
    closeModal();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files && files.length <= maxFiles) {
      const newFiles = Array.from(files).slice(0, maxFiles);

      const uniqueNewFiles = newFiles.filter(
        (newFile) =>
          !selectedFiles.some(
            (existingFile) => existingFile.name === newFile.name
          )
      );

      let totalSize = totalSelectedSize;
      let exceededSize = false;
      let invalidFileTypes = false;

      uniqueNewFiles.forEach((newFile) => {
        if (!acceptedFileTypes.some((type) => newFile.name.endsWith(type))) {
          invalidFileTypes = true;
        } else if (totalSize + newFile.size > maxFileSizeMB * 1024 * 1024) {
          exceededSize = true;
        } else {
          totalSize += newFile.size;
        }
      });

      if (invalidFileTypes) {
        setError(
          prepareMessageFromParams(t("error_message_invalid_file_type"), [
            ["fileType", acceptedFileTypes.join(", ")],
          ])
        );
      } else if (exceededSize) {
        setError(`Total file size exceeds the maximum allowed size.`);
      } else if (selectedFiles.length + uniqueNewFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
      } else if (selectedFiles.length + data?.length >= maxFiles) {
        setError(`You can only upload up to ${maxFiles} files.`);
      } else {
        setSelectedFiles([...selectedFiles, ...uniqueNewFiles]);
        setTotalSelectedSize(totalSize);
        setError("");
      }
    } else {
      setError(`You can only upload up to ${maxFiles} files`);
    }
    setIsDragging(false);
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const iconMap: { [key: string]: string } = {
    ".pdf": "https://img.icons8.com/color/100/000000/pdf.png",
    ".docx": "https://img.icons8.com/color/48/google-docs--v1.png",
    ".jpeg": "https://img.icons8.com/color/48/000000/jpg.png",
    ".png": "https://img.icons8.com/color/48/000000/png.png",
    ".jpg": "https://img.icons8.com/color/48/000000/jpg.png",
  };
  const getFileName = (file: string | IMediaItem): string => {
    const maxLength = FILE_NAME_MAX_LENGTH;
    if (typeof file === "string") {
      return file.length > maxLength ? file.substr(0, maxLength) + "..." : file;
    } else if (file.media_url) {
      let fileName: string;
      if (file.media_title) {
        fileName = file.media_title;
      } else {
        fileName = file.media_url.split("/").pop() || "";
      }
      return fileName.length > maxLength
        ? fileName.substr(0, maxLength) + "..."
        : fileName;
    } else {
      return "";
    }
  };

  useEffect(() => {
    if (required) {
      if (data.length === 0 && selectedFiles.length === 0) {
        setError(t("you_have_to_select_file"));
      } else {
        setError("");
      }
    }
  }, [selectedFiles, data]);

  return (
    <>
      <div>
        <div className="flex">
          <p className="mx-2">{title}</p>
          <div className="info-icon-file-upload">
            <img
              width="20"
              height="20"
              src="https://img.icons8.com/ios/50/000000/info--v1.png"
              alt="info--v1"
              onClick={openModal}
            />
          </div>
        </div>
        <div className="file-upload-container mt-3">
          {!disabled && !isMobile && (
            <div className="file-upload-container-child-div">
              <div
                className={`my-drag-drop bg-skin-file-upload ${
                  isDragging ? "highlight-drag-part" : ""
                } `}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
              >
                {t("drag_and_drop_file")}
              </div>
            </div>
          )}
          {!disabled && (
            <div className="mt-3 file-upload-title-div w-full">
              <input
                type="file"
                accept={acceptedFileTypes.join(",")}
                onChange={handleFileChange}
                className="file-input w-full"
                id={"file-input" + title}
                {...(maxFiles === 1 ? {} : { multiple: true })}
              />
              <label
                className={`file-label ${isMobile ? "!w-[90%]" : ""}`}
                htmlFor={"file-input" + title}
              >
                {maxFiles > 1 ? "Select File(s)" : "Select File"}
              </label>
            </div>
          )}
          {selectedFiles.map((file, index) => (
            <div className="selected-file-div" key={index}>
              <div className="selected-upload-file-name-div">
                {iconMap[file.name.substr(file.name.lastIndexOf("."))] ? (
                  <img
                    src={iconMap[file.name.substr(file.name.lastIndexOf("."))]}
                    alt={file.name.substr(file.name.lastIndexOf("."))}
                    width="30"
                    height="30"
                  />
                ) : (
                  <img
                    src="https://img.icons8.com/ios/50/000000/file--v1.png"
                    alt="Default Icon"
                    width="30"
                    height="30"
                  />
                )}
                {file.name} (
                {file.size < 1024
                  ? `${file.size} B`
                  : file.size < 1048576
                  ? `${(file.size / 1024).toFixed(2)} KB`
                  : `${(file.size / 1048576).toFixed(2)} MB`}
                )
              </div>
              <div className="file-preview mr-5">
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width="40"
                    height="40"
                  />
                )}
              </div>
              {!disabled && (
                <div className="remover">
                  <button
                    type="button"
                    onClick={() => handleFileRemove(file.name)}
                  >
                    <div className="w-5 h-5 text-skin-file-upload-btn-cancel">
                      {closeIcon}
                    </div>
                  </button>
                </div>
              )}
            </div>
          ))}

          {data &&
            (selectedFiles.length || data.length > 0 ? (
              <div>
                {data?.map((file: any, index: number) => (
                  <div className="selected-file-div" key={index}>
                    <div className="selected-upload-file-name-div">
                      <img
                        src="https://img.icons8.com/color/48/000000/png.png"
                        alt="Default Icon"
                        width="30"
                        height="30"
                      />
                      {file.media_title ? file.media_title : getFileName(file)}
                    </div>
                    <div className="file-preview mr-5">
                      <ICImage
                        src={file.media_url ? `${file.media_url}` : `${file}`}
                        alt={file.media_title}
                        className="h-10 w-10"
                      />
                    </div>
                    {!disabled && (
                      <div className="remover">
                        <button
                          type="button"
                          onClick={() => {
                            handleFileRemoveNew(
                              file.media_title
                                ? file.media_title
                                : getFileName(file)
                            );
                          }}
                        >
                          ❌
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <img
                  className="w-12 h-12 rounded-full"
                  src={require(".././assets/image/noImage.png")}
                  alt="posterImage"
                />
                <p>{t("no_image_found")}</p>
              </div>
            ))}
        </div>

        {error && <div className="error-color-file-upload">{error}</div>}
        {
          <ICModal
            isOpen={modalOpen}
            onClose={closeModal}
            onConfirm={handleConfirm}
            message={`Maximum upload file is ${maxFileSizeMB} MB.
            You Can upload only ${maxFiles} Files.\n
            ${prepareMessageFromParams(t("error_message_invalid_file_type"), [
              ["fileType", acceptedFileTypes.join(", ")],
            ])}`}
            title="Title"
            type="info"
          />
        }
      </div>
    </>
  );
};

export default ICFileUpload;
