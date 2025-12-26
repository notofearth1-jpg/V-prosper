import React from "react";
import { noDataIcon } from "../../assets/icons/SvgIconList";
import { prepareMessageFromParams } from "../../utils/AppFunctions";
import UseTranslationHook from "../../hooks/UseTranslationHook";
interface INoData {
  title: string;
  height: number;
  width: number;
}
const NoData: React.FC<INoData> = ({ title, height, width }) => {
  const { t } = UseTranslationHook();
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div
        style={{ height: `${height}px`, width: `${width}px` }}
        className="svg-color"
      >
        {noDataIcon}
      </div>
      <div>
        <p className="text-lg link-color font-semibold">
          {prepareMessageFromParams(t("no_item_found"), [
            ["fieldName", t(title)],
          ])}
        </p>
      </div>
    </div>
  );
};

export default NoData;
