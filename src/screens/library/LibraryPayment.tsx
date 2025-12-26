import React, { useCallback, useEffect, useState } from "react";
import ICCustomModal from "../../components/common/ICCustomModal";
import {
  ENTITY_TYPE,
  FILE_TYPE,
  IS_SUBSCRIBED,
} from "../../utils/AppEnumerations";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import PackageDetails from "../../components/common/PackageDetails";
import {
  ILibrary,
  ILibraryPaymentSummary,
  fetchPaymentSummary,
} from "./LibraryController";
import { TReactSetState } from "../../data/AppType";
import {
  IOrderPremiumPackage,
  submitPremiumPackageBooking,
} from "../premium-package/PremiumPackagesController";
import {
  decryptData,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import {
  CALLING_CODE,
  RP_COMPANY_NAME,
  RP_KEY_ID,
} from "../../config/AppConfig";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import Loader from "../../components/common/Loader";

interface ILibraryPayment {
  libraryPackage: ILibrary;
  libraryList?: ILibrary[];
  setLibraryList?: TReactSetState<ILibrary[]>;
  showPremiumPackagePaymentModal: boolean;
  setShowPremiumPackagePaymentModal: TReactSetState<boolean>;
}

const LibraryPayment: React.FC<ILibraryPayment> = ({
  libraryPackage,
  libraryList,
  setLibraryList,
  showPremiumPackagePaymentModal,
  setShowPremiumPackagePaymentModal,
}) => {
  const { t } = UseTranslationHook();
  const [Razorpay] = useRazorpay();
  const [loading, setLoading] = useState(false);
  const [paymentSummary, setPaymentSummary] =
    useState<ILibraryPaymentSummary | null>(null);

  useEffect(() => {
    fetchPaymentSummary(
      libraryPackage.object_id,
      libraryPackage.file_type === FILE_TYPE.DIRECTORY,
      setPaymentSummary
    );
  }, [libraryPackage]);

  const handleOrderDetails = async (
    id: number,
    entityType: number
  ): Promise<IOrderPremiumPackage | undefined> => {
    const orderDetailsPayload = {
      entity_type: entityType,
      entity_record_id: id,
    };
    const fetchedOrderDetails = await submitPremiumPackageBooking(
      orderDetailsPayload,
      setLoading
    );

    return fetchedOrderDetails;
  };

  const handleLibraryPackagePayment = useCallback(
    async (id: number, entityType: number) => {
      const orderDetails = await handleOrderDetails(id, entityType);

      if (!orderDetails) {
        sweetAlertError(t("order_not_found"));
        return;
      }

      const options: RazorpayOptions = {
        prefill: {
          contact: CALLING_CODE + decryptData(orderDetails.contact_number),
        },
        key: RP_KEY_ID,
        amount: orderDetails.amount.toString(),
        currency: orderDetails.currency,
        name: RP_COMPANY_NAME,
        description: orderDetails.description,
        order_id: orderDetails.order_id,
        handler: (res) => {
          if (res.razorpay_payment_id) {
            const updatedPremiumPackageList =
              libraryPackage &&
              libraryList &&
              libraryList.length > 0 &&
              libraryList.map((val) => {
                if (val.object_id === libraryPackage.object_id) {
                  return {
                    ...val,
                    has_subscribed: IS_SUBSCRIBED.Yes,
                  };
                }
                return val;
              });

            updatedPremiumPackageList &&
              setLibraryList &&
              setLibraryList(updatedPremiumPackageList);

            setShowPremiumPackagePaymentModal(false);
            sweetAlertSuccess(t("library_booked"));
          } else {
            setShowPremiumPackagePaymentModal(false);
            sweetAlertError(t("something_want_wrong"));
          }
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, handleOrderDetails]
  );
  return (
    <ICCustomModal
      title={t("library_item")}
      content={
        paymentSummary ? (
          <PackageDetails
            package_title={libraryPackage?.title}
            package_description={libraryPackage.description}
            cost_label={t("package_cost")}
            package_discounted_price={paymentSummary.discount_cost}
            package_price={paymentSummary.cost}
            transaction_charge={paymentSummary.transaction_charge}
            tax={paymentSummary.tax}
            total_amount={paymentSummary.total_amount}
          />
        ) : (
          <Loader className="!h-full" />
        )
      }
      buttonTitle={t("buy_package")}
      isModalShow={showPremiumPackagePaymentModal}
      setIsModalShow={setShowPremiumPackagePaymentModal}
      handleSubmitButton={() => {
        handleLibraryPackagePayment(
          libraryPackage?.object_id,
          libraryPackage.file_type === FILE_TYPE.DIRECTORY
            ? ENTITY_TYPE.LibraryDirectory
            : ENTITY_TYPE.LibraryContent
        );
      }}
      disabled={loading}
    />
  );
};

export default LibraryPayment;
