import { FormikProps } from "formik";
import { getForikErrorMessage } from "../../utils/AppFunctions";

interface ICustomFormikRadioBtn<T> extends FormikProps<T> {
  name: keyof T;
  placeholder: string;
  radioGroup: { label: string; value: string | number }[];
  containerClassName?: string;
  disabled?: boolean;
  required?: boolean;
}

const IDFFormikRadioBtn = <T extends Object>(
  props: ICustomFormikRadioBtn<T>
) => {
  const { touched, errors, values, setFieldValue } = props;
  const {
    name,
    placeholder,
    containerClassName,
    radioGroup,
    disabled,
    required,
  } = props;
  const fieldName = props.name as string;

  return (
    <div className={`mb-6 cursor-pointer ${containerClassName || ""}`}>
      <span className={"typo-input-label"}>
        {placeholder + (required ? "*" : "")}
      </span>
      <div className="flex flex-wrap">
        {radioGroup.map((radio, index) => (
          <div
            key={index}
            className={`flex items-center ${
              index !== radioGroup.length - 1 ? "mr-4" : ""
            }`}
            onClick={() =>
              !disabled ? setFieldValue(fieldName, radio.value) : {}
            }
          >
            <div
              className={
                "h-4 w-4 border border-skin-input-inactive rounded-full p-[1px]"
              }
            >
              {radio.value === values[name] && (
                <div className="bg-skin-radio-active rounded-full h-full w-full" />
              )}
            </div>
            <span className="typo-input-value">&nbsp;{radio.label}</span>
          </div>
        ))}
      </div>
      {touched[name] && errors[name] && (
        <span className="typo-error">
          {getForikErrorMessage<T>(errors, touched, name)}
        </span>
      )}
    </div>
  );
};

export default IDFFormikRadioBtn;
