import { FormikProps } from 'formik';
import { getForikErrorMessage } from '../../utils/AppFunctions';
import ICTimePicker, { ICTimePickerProps } from '../../core-component/ICTimePicker';

interface ICustomFormikTimePicker<T> extends FormikProps<T> {
  fieldName: keyof T;
  placeholder: string;
  containerClassName?: string;
  timeProps?: Omit<ICTimePickerProps, 'value'>;
  required?: boolean;
}

const ICFormikTimePicker = <T extends Object>(props: ICustomFormikTimePicker<T>) => {
  const {
    setFieldValue,
    handleBlur,
    touched,
    errors,
    values,
    fieldName,
    placeholder,
    containerClassName,
    timeProps,
    required,
  } = props;
  const fieldNameStr = props.fieldName as string;

  return (
    <div className={`mb-6 ${containerClassName || ''}`}>
      <ICTimePicker
        {...timeProps}
        placeholder={placeholder}
        onChangeTime={(event) => {
          setFieldValue(fieldNameStr, event.target.value);
          handleBlur(fieldName);
        }}
        value={values[fieldName] as string}
        label={placeholder}
        errorMessage={
          touched[fieldName] && errors[fieldName]
            ? getForikErrorMessage<T>(errors, touched, fieldName)
            : undefined
        }
        required={required}
      />
    </div>
  );
};

export default ICFormikTimePicker;
