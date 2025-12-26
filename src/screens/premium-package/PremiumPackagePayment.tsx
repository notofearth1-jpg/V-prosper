import React, { useCallback, useState } from "react";
import { TReactSetState } from "../../data/AppType";
import {
  IOrderPremiumPackage,
  IPremiumPackage,
  IPremiumPackageList,
  submitPremiumPackageBooking,
} from "./PremiumPackagesController";
import {
  ENTITY_TYPE,
  IS_SUBSCRIBED,
  USER_ROLE,
} from "../../utils/AppEnumerations";
import useRazorpay, { RazorpayOptions } from "react-razorpay";
import {
  decryptData,
  financialStr,
  sweetAlertError,
  sweetAlertSuccess,
} from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import {
  CALLING_CODE,
  RP_COMPANY_NAME,
  RP_KEY_ID,
} from "../../config/AppConfig";
import { routeTrainer } from "../../routes/RouteTrainer";
import { userRoute } from "../../routes/RouteUser";
import { localStorageUtils } from "../../utils/LocalStorageUtil";
import { useNavigate } from "react-router-dom";
import ICCommonModal from "../../components/common/ICCommonModel";
import ICButton from "../../core-component/ICButton";
import { ILibrary } from "../library/LibraryController";
import LibraryOpenType from "../library/LibraryOpenType";

interface IPremiumPackagePayment {
  libraryList: ILibrary[];
  premiumPackage: IPremiumPackage;
  setShowPremiumPackagePaymentModal: TReactSetState<boolean>;
  premiumPackageList?: IPremiumPackageList[];
  setPremiumPackageList?: TReactSetState<IPremiumPackageList[]>;
  setLibraryList: TReactSetState<ILibrary[]>;
  isSpecialPackage: boolean;
}

const PremiumPackagePayment: React.FC<IPremiumPackagePayment> = ({
  libraryList,
  setLibraryList,
  premiumPackage,
  setShowPremiumPackagePaymentModal,
  premiumPackageList,
  setPremiumPackageList,
  isSpecialPackage,
}) => {
  const { t } = UseTranslationHook();
  const userRole = Number(localStorageUtils.getRole());
  const navigate = useNavigate();
  const [Razorpay] = useRazorpay();
  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleOrderDetails = async (
    id: number
  ): Promise<IOrderPremiumPackage | undefined> => {
    const orderDetailsPayload = {
      entity_type: ENTITY_TYPE.SubscriptionPackages,
      entity_record_id: id,
    };
    const fetchedOrderDetails = await submitPremiumPackageBooking(
      orderDetailsPayload,
      setPaymentLoading
    );

    return fetchedOrderDetails;
  };

  const handlePremiumPackagePayment = useCallback(
    async (id: number) => {
      const orderDetails = await handleOrderDetails(id);

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
              premiumPackageList &&
              premiumPackageList.length > 0 &&
              premiumPackageList.map((val) => {
                if (val.id === premiumPackage.id) {
                  return {
                    ...val,
                    has_subscribed: IS_SUBSCRIBED.Yes,
                  };
                }
                return val;
              });

            updatedPremiumPackageList &&
              setPremiumPackageList &&
              setPremiumPackageList(updatedPremiumPackageList);

            setShowPremiumPackagePaymentModal(false);
            sweetAlertSuccess(t("premium_package_booked"));
          } else {
            sweetAlertError(t("something_want_wrong"));
            navigate(
              userRole === USER_ROLE.Customer
                ? userRoute.home
                : userRole === USER_ROLE.Trainer && routeTrainer.trainerHome
            );
          }
        },
      };

      const rzpay = new Razorpay(options);
      rzpay.open();
    },
    [Razorpay, handleOrderDetails]
  );

  const premiumPackageDetails = (premiumPackage: IPremiumPackage) => {
    return (
      <div className="space-y-4">
        <div className="comman-black-big">{premiumPackage.package_title}</div>
        <div className="comman-grey text-wrap break-words text-justify">
          {premiumPackage.package_description}
        </div>
        {libraryList && libraryList.length > 0 && (
          <div className="comman-black-big">{t("library_item")}</div>
        )}
        <div className="flex overflow-x-scroll remove-scrollbar-width">
          {libraryList &&
            libraryList.length > 0 &&
            libraryList.map((item, index) => (
              <div key={index} className="flex-shrink-0 overflow-hidden mr-5">
                <LibraryOpenType
                  isSpecialPackage={isSpecialPackage}
                  libraryList={libraryList}
                  setLibraryList={setLibraryList}
                  itemArray={{
                    ...item,
                    has_subscribed: premiumPackage.has_subscribed,
                  }}
                  childClass="h-40"
                  index={index}
                  videoControls={["play-large"]}
                />
              </div>
            ))}
        </div>

        {premiumPackage.has_subscribed === IS_SUBSCRIBED.No && (
          <div className="flex justify-between w-full items-center top">
            <div className="comman-black-lg">{t("package_cost")}</div>
            <div className="flex items-center">
              {premiumPackage.payment_summary.discount_cost &&
              premiumPackage.payment_summary.discount_cost > 0 ? (
                <div className="comman-grey mr-2 line-through">
                  {financialStr(premiumPackage.payment_summary.cost)}
                </div>
              ) : (
                <div className="font-bold">
                  {financialStr(premiumPackage.payment_summary.cost)}
                </div>
              )}

              {premiumPackage.payment_summary.discount_cost &&
              premiumPackage.payment_summary.discount_cost > 0 ? (
                <div className="font-bold">
                  {premiumPackage.payment_summary.discount_cost}
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        )}

        {premiumPackage.payment_summary.transaction_charge &&
        premiumPackage.has_subscribed === IS_SUBSCRIBED.No &&
        premiumPackage.payment_summary.transaction_charge > 0 ? (
          <div className="top flex justify-between w-full items-center">
            <div className="comman-black-lg">{t("transaction_charge")}</div>
            <div className="font-bold">
              {financialStr(premiumPackage.payment_summary.transaction_charge)}
            </div>
          </div>
        ) : (
          <></>
        )}
        {premiumPackage.payment_summary.tax &&
        premiumPackage.has_subscribed === IS_SUBSCRIBED.No &&
        premiumPackage.payment_summary.tax > 0 ? (
          <div className="top flex justify-between w-full items-center">
            <div className="comman-black-lg">{t("tax")}</div>
            <div className="font-bold">
              {financialStr(premiumPackage.payment_summary.tax)}
            </div>
          </div>
        ) : (
          <></>
        )}
        {premiumPackage.has_subscribed === IS_SUBSCRIBED.No && (
          <div className="top flex justify-between w-full items-center">
            <div className="comman-black-lg">{t("total")}</div>
            <div className="font-bold">
              {financialStr(premiumPackage.payment_summary.total_amount)}
            </div>
          </div>
        )}
        {premiumPackage.has_subscribed === IS_SUBSCRIBED.No && (
          <ICButton
            children={t("buy_package")}
            loading={paymentLoading}
            onClick={() => handlePremiumPackagePayment(premiumPackage?.id)}
          />
        )}
      </div>
    );
  };

  return (
    premiumPackage && (
      <ICCommonModal
        title={t("premium_package")}
        content={premiumPackageDetails(premiumPackage)}
        isModalShow={true}
        setIsModalShow={setShowPremiumPackagePaymentModal}
        handleCloseButton={() => setShowPremiumPackagePaymentModal(false)}
      />
    )
  );
};

export default PremiumPackagePayment;
