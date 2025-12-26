import React, { useState } from "react";
import { IS_SUBSCRIBED } from "../../utils/AppEnumerations";
import { premiumIcon, rupeeIcon } from "../../assets/icons/SvgIconList";
import {
  IPremiumPackage,
  IPremiumPackageList,
  getPremiumPackageById,
} from "./PremiumPackagesController";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import ShrinkText from "../../components/common/ShrinkText";
import { TReactSetState } from "../../data/AppType";
import PremiumPackagePayment from "./PremiumPackagePayment";
import { ILibrary } from "../library/LibraryController";
import { useAddressContext } from "../../context/AddressContext";
import AddressModel from "../address/AddressModel";

interface IPremiumPackageCommonComponent {
  index: number;
  value: IPremiumPackageList;
  premiumPackageList: IPremiumPackageList[];
  setPremiumPackageList: TReactSetState<IPremiumPackageList[]>;
}

const PremiumPackageCommonComponent: React.FC<
  IPremiumPackageCommonComponent
> = ({ index, value, premiumPackageList, setPremiumPackageList }) => {
  let timer: NodeJS.Timeout;
  const { t } = UseTranslationHook();
  const [premiumPackage, setPremiumPackage] = useState<IPremiumPackage>();
  const [libraryList, setLibraryList] = useState<ILibrary[]>([]);
  const [showPremiumPackagePaymentModal, setShowPremiumPackagePaymentModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const { addressData } = useAddressContext();
  const [showAddressModel, setShowAddressModel] = useState(false);

  const fetchPremiumPackageById = async (id: number) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      !loading &&
        getPremiumPackageById(
          id,
          setPremiumPackage,
          setLoading,
          setShowPremiumPackagePaymentModal,
          setLibraryList,
          false
        );
    }, 500);
  };

  return (
    <>
      <div
        className={`border-library p-2 bg-skin-background w-full min-w-72 h-20 ${
          loading ? "cursor-wait" : "cursor-pointer"
        } overflow-hidden grid grid-cols-3`}
        key={index}
        onClick={() => {
          if (!addressData) {
            setShowAddressModel(true);
            return;
          }
          fetchPremiumPackageById(value.id);
        }}
      >
        <div className="col-span-2 flex flex-col justify-between text-wrap">
          <div className="comman-black-text">
            <ShrinkText text={value.package_title} maxLength={30} />
          </div>
          {value.has_subscribed === IS_SUBSCRIBED.Yes ? (
            <div className="text-subscribed text-skin-on-primary">
              {t("subscribed")}
            </div>
          ) : (
            <div className="h-6 w-6">{premiumIcon}</div>
          )}
        </div>
        <div className="flex justify-end">
          <div className="w-2.5 h-2.5 pt-1.5">{rupeeIcon}</div>
          <div className="">
            {value.package_discounted_price ? (
              <>
                <p className="mx-1 comman-black-lg ">
                  {`${value.package_discounted_price}`}
                </p>
                <p className="mx-1 comman-grey line-through">
                  {`${value.package_price}`}
                </p>
              </>
            ) : (
              <p className="mx-1 comman-black-lg">{`${value.package_price}`}</p>
            )}
          </div>
        </div>
      </div>
      {premiumPackage && showPremiumPackagePaymentModal && (
        <PremiumPackagePayment
          isSpecialPackage={true}
          libraryList={libraryList}
          setLibraryList={setLibraryList}
          premiumPackage={premiumPackage}
          setShowPremiumPackagePaymentModal={setShowPremiumPackagePaymentModal}
          premiumPackageList={premiumPackageList}
          setPremiumPackageList={setPremiumPackageList}
        />
      )}
      {showAddressModel && (
        <AddressModel
          modelOpen={showAddressModel}
          setModelOpen={setShowAddressModel}
        />
      )}
    </>
  );
};

export default PremiumPackageCommonComponent;
