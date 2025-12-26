import Select from "react-select";
import { StateManagerProps } from "react-select/dist/declarations/src/stateManager";

interface IICDropDownMultiSelectProps extends StateManagerProps {
  containerClassName?: string;
  errorMessage?: string;
}

const ICDropDownMultiSelect = ({
  containerClassName,
  errorMessage,
  ...rest
}: IICDropDownMultiSelectProps) => {
  return (
    <div className={`${containerClassName ? containerClassName : ""}`}>
      <Select {...rest} />
      {errorMessage && <div className="typo-error">{errorMessage}</div>}
    </div>
  );
};

export default ICDropDownMultiSelect;
