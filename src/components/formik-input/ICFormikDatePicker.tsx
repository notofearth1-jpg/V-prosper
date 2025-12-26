import { FormikProps } from 'formik';
import ICDatePicker, { ICDatePickerProps } from '../../core-component/ICDatePicker';
import { getForikErrorMessage } from '../../utils/AppFunctions';

interface ICustomFormikDatePicker<T> extends FormikProps<T> {
  fieldName: keyof T;
  placeholder: string;
  containerClassName?: string;
  dateProps: Omit<ICDatePickerProps, 'value'>;
  required?: boolean;
}

const ICFormikDatePicker = <T extends Object>(props: ICustomFormikDatePicker<T>) => {
  const {
    setFieldValue,
    handleBlur,
    touched,
    errors,
    values,
    fieldName,
    placeholder,
    containerClassName,
    dateProps,
    required,
  } = props;
  const fieldNameStr = props.fieldName as string;

  return (
    <div className={`mb-6 ${containerClassName || ''}`}>
      <ICDatePicker
        {...dateProps}
        placeholder={placeholder}
        onChangeDate={(event) => {
          setFieldValue(fieldNameStr, new Date(event.target.value));
          handleBlur(fieldName);
        }}
        value={values[fieldName] as Date}
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

export default ICFormikDatePicker;
