import { FormikProps } from 'formik';
import ICDropDown from '../../core-component/ICDropDown';
import { getForikErrorMessage } from '../../utils/AppFunctions';

interface ICustomFormikDropDown<T> extends FormikProps<T> {
  name: keyof T;
  placeholder: string;
  options: { label: string; value: string }[];
  containerClassName?: string;
}

const ICFormikDropDown = <T extends Object>(props: ICustomFormikDropDown<T>) => {
  // const { touched, errors, values, setFieldValue } = props;
  // const { name, placeholder, containerClassName, options } = props;
  // const fieldName = props.name as string;

  // return (
  //   <div className={`mb-6 ${containerClassName || ''}`}>
  //     <span className="block mb-2 text-sm font-medium text-gray-900">{placeholder}</span>
  //     <ICDropDown<string>
  //       options={options}
  //       selected={values[name] as string}
  //       onSelect={(option) => setFieldValue(fieldName, option.value)}
  //     />
  //     {touched[name] && errors[name] && (
  //       <span className="error-message text-skin-err">
  //         {getForikErrorMessage<T>(errors, touched, name)}
  //       </span>
  //     )}
  //   </div>
  // );
};

export default ICFormikDropDown;
