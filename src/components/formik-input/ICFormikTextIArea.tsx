import { FormikProps } from "formik";
import ICTextArea from "../../core-component/ICTextArea";

interface ICustomFormikTextArea<T> extends FormikProps<T> {
  name: keyof T;
  placeholder: string;
  containerClassName?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  required?: boolean;
}

const ICFormikTextArea = <T extends Object>(
  props: ICustomFormikTextArea<T>
) => {
  const { handleChange, handleBlur, touched, errors, values } = props;
  const {
    name,
    placeholder,
    containerClassName,
    onChangeText,
    disabled,
    required,
  } = props;
  const fieldName = props.name as string;

  return (
    <div className={`mb-6 ${containerClassName || ""}`}>
      <ICTextArea
        type="text"
        id={fieldName}
        containerClassName="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={(event) =>
          onChangeText ? onChangeText(event.target.value) : handleChange(event)
        }
        onBlur={handleBlur}
        errorMessage={touched[name] && errors[name] ? errors[name] : ""}
        value={values[name] as string}
        disabled={disabled}
        label={placeholder}
        required={required}
      />
    </div>
  );
};

export default ICFormikTextArea;
