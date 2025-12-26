import { dateFormat } from "../utils/AppFunctions";
import useTranslationHook from "../hooks/UseTranslationHook";
import { DEFAULT_CREATED_BY, DEFAULT_MODIFIED_BY } from "../utils/AppConstants";

export interface IFormFooterProps {
  timestamp: {
    created_by: string;
    created_date: Date;
    modified_by?: string;
    modified_date?: Date;
  };
}

export const FormFooter = (props: IFormFooterProps) => {
  const { t } = useTranslationHook();
  const { created_by, created_date, modified_by, modified_date } =
    props.timestamp;
  console.log("props.timestamp", props.timestamp);
  return (
    <div className="p-2 border-t border-skin-form-footer text-skin-form-footer bg-skin-form-footer w-full">
      <div>
        <span className="font-medium">{t("created_on")}&nbsp;:</span>
        <span>&nbsp;{dateFormat(created_date)}</span>&nbsp;{t("by")}
        <span>&nbsp;{created_by ? "" : DEFAULT_CREATED_BY}</span>
      </div>
      {modified_date && (
        <div>
          <span className="font-medium">{t("modified_on")}&nbsp;:</span>
          <span>&nbsp;{dateFormat(modified_date)}</span>&nbsp;{t("by")}
          <span>&nbsp;{modified_by ? "" : DEFAULT_MODIFIED_BY}</span>
        </div>
      )}
    </div>
  );
};

export default FormFooter;
