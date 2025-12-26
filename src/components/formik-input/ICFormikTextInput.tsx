import { FormikProps } from 'formik';
import ICTextInput, { ICustomInputProps } from '../../core-component/ICTextInput';

interface ICustomFormikTextInput<T> extends FormikProps<T>, ICustomInputProps {
  fieldName: keyof T;
  placeholder: string;
  containerClassName?: string;
  onChangeText?: (text: string) => void;
}

const ICFormikTextInput = <T extends Object>(props: ICustomFormikTextInput<T>) => {
  const {
    handleChange,
    handleBlur,
    touched,
    errors,
    values,
    fieldName,
    placeholder,
    containerClassName,
    onChangeText,
    ...ICTextInputProps
  } = props;
  const fieldNameStr = props.fieldName as string;

  return (
    <div className={`mb-6 ${containerClassName || ''}`}>
      {/* <ICTextInput
        type="text"
        {...ICTextInputProps}
        name={fieldNameStr}
        id={fieldNameStr}
        containerClassName="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        label={placeholder}
        onChange={(event) =>
          onChangeText ? onChangeText(event.target.value) : handleChange(event)
        }
        onBlur={handleBlur}
        errorMessage={touched[fieldName] && errors[fieldName] ? errors[fieldName] : ''}
        value={values[fieldName] as string}
      /> */}
    </div>
  );
};

export default ICFormikTextInput;
