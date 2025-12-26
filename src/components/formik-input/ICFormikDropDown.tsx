import { FormikProps } from 'formik';
import ICDropDown from '../../core-component/ICDropDown';
import { getForikErrorMessage } from '../../utils/AppFunctions';

interface IOption {
  label: string;
  value: string;
}

interface ICustomFormikDropDown<T> extends FormikProps<T> {
  name: keyof T;
  placeholder: string;
  options: IOption[];
  containerFormikClassName?: string;
  searchable?: boolean;
  disabled?: boolean;
  defaultOption?: IOption;
  required?: boolean;
}

const ICFormikDropDown = <T extends Object>(props: ICustomFormikDropDown<T>) => {
  // const { touched, errors, values, setFieldValue } = props;
  // const {
  //   name,
  //   placeholder,
  //   containerFormikClassName,
  //   options,
  //   searchable,
  //   disabled,
  //   defaultOption,
  //   required,
  // } = props;
  // const fieldName = props.name as string;

  // return (
  //   <div className={`mb-6 ${containerFormikClassName || ''}`}>
  //     <ICDropDown<string>
  //       options={options}
  //       selected={values[name] as string}
  //       onSelect={(option) => setFieldValue(fieldName, option.value)}
  //       searchable={searchable}
  //       disabled={disabled}
  //       label={placeholder}
  //       errorMessage={
  //         touched[name] && errors[name] ? getForikErrorMessage<T>(errors, touched, name) : undefined
  //       }
  //       defaultOption={defaultOption}
  //       required={required}
  //     />
  //   </div>
  // );
};

export default ICFormikDropDown;
