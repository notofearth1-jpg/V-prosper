import React from "react";
import UseTranslationHook from "../../hooks/UseTranslationHook";
import { financialStr } from "../../utils/AppFunctions";

interface IPackageDetails {
  package_title?: string;
  package_description?: string;
  package_price: number;
  cost_label: string;
  package_discounted_price: number | null;
  transaction_charge: number | null;
  tax: number | null;
  total_amount: number;
}

const PackageDetails: React.FC<IPackageDetails> = ({
  package_title,
  package_description,
  cost_label,
  package_discounted_price,
  package_price,
  transaction_charge,
  tax,
  total_amount,
}) => {
  const { t } = UseTranslationHook();
  return (
    <div className="space-y-4">
      <div className="comman-black-lg">{package_title}</div>
      <div className="comman-grey text-wrap break-words text-justify">
        {package_description}
      </div>
      <div className="flex justify-between w-full items-center top">
        <div className="comman-black-lg">{cost_label}</div>
        <div className="flex items-center">
          {package_discounted_price && package_discounted_price > 0 ? (
            <div className="comman-grey mr-2 line-through">
              {financialStr(package_price)}
            </div>
          ) : (
            <div className="font-bold">{financialStr(package_price)}</div>
          )}

          {package_discounted_price && package_discounted_price > 0 ? (
            <div className="font-bold">
              {financialStr(package_discounted_price)}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {transaction_charge && transaction_charge > 0 ? (
        <div className="top flex justify-between w-full items-center">
          <div className="comman-black-lg">{t("transaction_charge")}</div>
          <div className="font-bold">{financialStr(transaction_charge)}</div>
        </div>
      ) : (
        <></>
      )}
      {tax && tax > 0 ? (
        <div className="top flex justify-between w-full items-center">
          <div className="comman-black-lg">{t("tax")}</div>
          <div className="font-bold">{financialStr(tax)}</div>
        </div>
      ) : (
        <></>
      )}
      <div className="top flex justify-between w-full items-center">
        <div className="comman-black-lg">{t("total")}</div>
        <div className="font-bold">{financialStr(total_amount)}</div>
      </div>
    </div>
  );
};

export default PackageDetails;
