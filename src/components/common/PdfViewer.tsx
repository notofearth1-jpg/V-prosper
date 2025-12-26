import React, { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { closeIcon } from "../../assets/icons/SvgIconList";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { encryptData } from "../../utils/AppFunctions";
import { GET_PRESIGNED_URL } from "../../services/user/UserServices";
import { DEFAULT_STATUS_CODE_SUCCESS } from "../../utils/AppConstants";
import { APP_IMAGE_URL } from "../../config/AppConfig";

interface IPdfViewerProps {
  pdfFile: string;
  onClose: () => void;
  isPrivate?: boolean;
}
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer: React.FC<IPdfViewerProps> = ({
  pdfFile,
  onClose,
  isPrivate = false,
}) => {
  const { t } = UseTranslationHook();
  const [numPages, setNumPages] = useState<number>(1);
  const [pageNumber, setPageNumber] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfSrcUrl, setPdfSrcUrl] = useState<string>();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (pdfFile && isPrivate) {
          const resImage = await GET_PRESIGNED_URL(encryptData(pdfFile));
          if (resImage?.code === DEFAULT_STATUS_CODE_SUCCESS) {
            setPdfSrcUrl(resImage.data);
          }
        } else {
          setPdfSrcUrl(APP_IMAGE_URL + pdfFile);
        }
      } catch (error) {
        setPdfSrcUrl(undefined);
      }
    };

    fetchImage();
  }, [pdfFile]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (container) {
      const scrollPercentage =
        container.scrollTop / (container.scrollHeight - container.clientHeight);
      const nextPage = Math.ceil(numPages! * scrollPercentage);

      nextPage !== 0 && setPageNumber(nextPage);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-black flex justify-center items-center z-[1000]">
      <div className="bg-white p-[10px] rounded-lg h-screen w-full flex flex-col items-center relative">
        <div
          className=" flex justify-end w-full z-[999] cursor"
          onClick={onClose}
        >
          <div className="h-5 w-5">{closeIcon}</div>
        </div>

        <div
          className="flex-1 overflow-auto remove-scrollbar-width"
          ref={containerRef}
          onScroll={handleScroll}
        >
          {pdfSrcUrl ? (
            <Document file={pdfSrcUrl} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={window.innerWidth}
                />
              ))}
            </Document>
          ) : (
            <p>{t("Failed to load PDF file.")}</p>
          )}
        </div>
        <div className="flex justify-center items-center font-semibold">
          <span>
            {t("page")} {pageNumber} {t("of")} {numPages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfViewer;
