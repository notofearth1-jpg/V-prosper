import { FormikProps } from 'formik';

interface ICustomFormikSwitch<T> extends FormikProps<T> {
  name: keyof T;
  placeholder: string;
  checkedValue: string | number | boolean;
  unCheckedValue: string | number | boolean;
  containerClassName?: string;
  disabled?: boolean;
  required?: boolean;
}

const ICFormikSwitch = <T extends Object>(props: ICustomFormikSwitch<T>) => {
  const { values, setFieldValue } = props;
  const {
    name,
    placeholder,
    containerClassName,
    checkedValue,
    unCheckedValue,
    disabled,
    required,
  } = props;
  const fieldName = props.name as string;

  return (
    <div className={`mb-6 ${containerClassName || ''}`}>
      <span className="typo-input-label">{placeholder + (required ? '*' : '')}</span>
      <label className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          onChange={(e) =>
            !disabled
              ? setFieldValue(fieldName, e.target.checked ? checkedValue : unCheckedValue)
              : {}
          }
          checked={values[name] === '1'}
        />
        <div className="switch-input"></div>
      </label>
    </div>
  );
};

// Old switch css at div with class switch-input
// w-9
// h-5
// cursor-pointer
// bg-gray-200
// peer-focus:outline-none
// peer-focus:ring-1
// peer-focus:ring-blue-300
// dark:peer-focus:ring-blue-800
// rounded-full
// peer
// dark:bg-gray-700
// peer-checked:after:translate-x-full
// peer-checked:after:border-white
// after:content-['']
// after:absolute after:top-[2px]
// after:left-[2px]
// after:bg-white
// after:border-gray-300
// after:border
// after:rounded-full
// after:h-4
// after:w-4
// after:transition-all
// dark:border-gray-600
// peer-checked:bg-blue-600"
export default ICFormikSwitch;
