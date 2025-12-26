import ICCheckbox from "./ICCheckbox";

interface ICCheckboxOption<T> {
  label: string;
  value: T;
}

type TICMultiCheckbox<T> = {
  selectedValues: T[];
  className?: string;
  options: ICCheckboxOption<T>[];
  onSelectionChange: (optio: ICCheckboxOption<T>) => void;
};

const ICMultiCheckbox = <T extends Object>({
  selectedValues,
  options,
  onSelectionChange,
  className,
}: TICMultiCheckbox<T>) => {
  return (
    <>
      {options.map((item, index) => (
        <div
          key={index}
          className={`flex items-center ${index === 0 ? "" : "top"}`}
        >
          <ICCheckbox
            id={item.value.toString()}
            type="checkbox"
            className={`w-4 h-4 text-skin-selected-interest bg-skin-selected-interests border-skin-selected-interests focus:ring-0 dark:focus:ring-0 focus:border-0 checkbox-color ${
              className ? className : ""
            }`}
            onChange={() => onSelectionChange(item)}
            checked={selectedValues.includes(item.value)}
            label={item.label}
          />
        </div>
      ))}
    </>
  );
};

export default ICMultiCheckbox;
