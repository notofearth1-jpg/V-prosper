import React, { useEffect, useRef, useState } from "react";
import {
  CURRENCY,
  PAYMENT_TRANSACTION_STATUS,
  TRANSACTION_FOR,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import {
  failIcon,
  paymentInfoIcon,
  refundedIcon,
  successIcon,
} from "../../assets/icons/SvgIconList";
import ICImage from "../../core-component/ICImage";
import BackButton from "../../components/common/BackButton";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ITransactionDetails,
  convertIndianCurrencytowords,
  fetchTransactionByID,
} from "./TransactionController";
import Loader from "../../components/common/Loader";
import moment from "moment";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import html2canvas from "html2canvas";
import { toastError } from "../../utils/AppFunctions";
import { routeTrainer } from "../../routes/RouteTrainer";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { userRoute } from "../../routes/RouteUser";
import jsPDF from "jspdf";
import UseMobileLayoutHook from "../../hooks/UseMobileLayoutHook";

const TransactionDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const transactionId = location?.state?.id;
  const [transactionDetails, setTransactionDetails] =
    useState<ITransactionDetails>();
  const [loading, setLoading] = useState(false);
  const { t } = UseTranslationHook();
  useEffect(() => {
    fetchTransactionByID(setTransactionDetails, transactionId, setLoading);
  }, [transactionId]);

  const [imageSrc, setImageSrc] = useState("");
  const userRole = Number(localStorageUtils.getRole());
  const { isMobile } = UseMobileLayoutHook();
  useEffect(() => {
    if (transactionDetails) {
      if (transactionDetails.entity_type === TRANSACTION_FOR.Booking) {
        setImageSrc(require("../../assets/image/booking.png"));
      } else if (
        transactionDetails.entity_type === TRANSACTION_FOR.LibraryContent
      ) {
        setImageSrc(require("../../assets/image/library.png"));
      } else if (
        transactionDetails.entity_type === TRANSACTION_FOR.Subscription
      ) {
        setImageSrc(require("../../assets/image/subscription.png"));
      } else if (transactionDetails.entity_type === TRANSACTION_FOR.Event) {
        setImageSrc(require("../../assets/image/event.png"));
      } else if (
        transactionDetails.entity_type === TRANSACTION_FOR.LibraryDirectory
      ) {
        setImageSrc(require("../../assets/image/libraryDirectory.png"));
      }
    }
  }, [transactionDetails]);

  const getStatusIcon = (status: PAYMENT_TRANSACTION_STATUS) => {
    switch (status) {
      case PAYMENT_TRANSACTION_STATUS.Initiated:
        return <p>{paymentInfoIcon}</p>;
      case PAYMENT_TRANSACTION_STATUS.Captured:
        return <p>{successIcon}</p>;
      case PAYMENT_TRANSACTION_STATUS.Refunded:
        return <p>{refundedIcon}</p>;
      case PAYMENT_TRANSACTION_STATUS.Failed:
        return <p>{failIcon}</p>;

      default:
        <p>{paymentInfoIcon}</p>;
    }
  };
  const transactionDetailsRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    try {
      if (transactionDetailsRef.current) {
        const canvas = await html2canvas(transactionDetailsRef.current);
        const dataUrl = canvas.toDataURL("image/png");
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], "transaction-details.png", {
          type: blob.type,
        });

        if (navigator.share) {
          await navigator.share({
            files: [file],
            title: t("payment"),
            text: t("payment_share_message"),
          });
        }
      }
    } catch (error: any) {
      toastError(error.response.message);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      if (transactionDetailsRef.current) {
        const canvas = await html2canvas(transactionDetailsRef.current);
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("vp-transaction-details.pdf");
      }
    } catch (error: any) {
      toastError(error.response?.message || error.message);
    }
  };

  // if client want to download custom pdf then use this code
  // const handleDownloadPDF = () => {
  //   try {
  //     const pdf = new jsPDF();

  //     // Add custom content to the PDF
  //     pdf.setFontSize(18);
  //     pdf.text("Transaction Details", 20, 20);

  //     pdf.setFontSize(12);
  //     pdf.text("Transaction ID: 123456", 20, 30);
  //     pdf.text("Date: 2024-06-27", 20, 40);
  //     pdf.text("Amount: $100.00", 20, 50);

  //     // Add more custom content as needed
  //     // ...

  //     pdf.save("transaction-details.pdf");
  //   } catch (error: any) {
  //     toastError(error.response?.message || error.message);
  //   }
  // };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="comman-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BackButton />
              {transactionDetails && (
                <div className="comman-black-text ml-2 flex items-center">
                  <p>{t("payment")}</p>
                  <p className="ml-1">
                    {transactionDetails.payment_transaction_status_label}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div className="comman-blue cursor" onClick={handleDownloadPDF}>
                {t("download")}
              </div>
              {isMobile && (
                <div className="comman-blue cursor  ml-2" onClick={handleShare}>
                  {t("share")}
                </div>
              )}
              <div
                className="comman-blue ml-2 cursor"
                onClick={() =>
                  navigate(
                    userRole === USER_ROLE.Trainer
                      ? routeTrainer.helpCenter
                      : userRoute.helpCenter
                  )
                }
              >
                {t("help")}
              </div>
            </div>
          </div>
          <div ref={transactionDetailsRef} id="transaction-details">
            <div
              className="transaction-details top "
              ref={transactionDetailsRef}
            >
              <div className=" comman-padding">
                <div className="comman-black-lg">{t("amount")}</div>
                {transactionDetails &&
                  transactionDetails.transaction_amount && (
                    <div className="top flex items-center">
                      <p className="!text-3xl !font-bold comman-black-big">
                        {CURRENCY.INR}
                        {transactionDetails.transaction_amount}
                      </p>
                      <div className="w-8 h-8 mx-2">
                        {getStatusIcon(
                          transactionDetails.payment_transaction_status
                        )}
                      </div>
                    </div>
                  )}
                {transactionDetails &&
                  transactionDetails.transaction_amount && (
                    <div className="mt-1 comman-black-text mb-3">
                      {convertIndianCurrencytowords(
                        parseFloat(transactionDetails.transaction_amount)
                      )}
                    </div>
                  )}
                {transactionDetails &&
                  transactionDetails.entity_type_label &&
                  transactionDetails.entity_type && (
                    <div className="border-t-2">
                      <div className="comman-black-lg top">{t("for")}</div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="!text-3xl !font-bold comman-black-big">
                          {transactionDetails.entity_type_label}
                        </p>
                        <ICImage
                          height={60}
                          width={60}
                          src={imageSrc}
                          className="!h-10 w-10"
                          scaled={false}
                        />
                      </div>
                    </div>
                  )}
                {transactionDetails && (
                  <div className="border-t-2">
                    <div className="comman-black-lg top">{t("from")}</div>
                    {transactionDetails.full_name && (
                      <p className="!text-3xl !font-bold comman-black-big">
                        {transactionDetails.full_name}
                      </p>
                    )}

                    {transactionDetails.payment_captured_date && (
                      <div className="comman-black-lg top flex items-center">
                        <p>{t("paid_at")}</p>
                        <p className="ml-1">
                          {moment(
                            transactionDetails.payment_captured_date
                          ).format("h:mm A, D MMM YYYY")}
                        </p>
                      </div>
                    )}

                    {transactionDetails.pg_order_id && (
                      <div className="comman-black-lg mt-1 flex items-center">
                        {t("order_id")} :
                        <p className="comman-grey ml-2">
                          {transactionDetails.pg_order_id}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="top text-center">
              <div className="comman-black-big">{t("rejoice_media")}</div>
              <div className="comman-black-big">{t("contact_vprosper")}</div>
            </div>
            <div className="h-10"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default TransactionDetails;
