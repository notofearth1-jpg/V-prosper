interface IICRadioGroupOption<T> {
  label: string;
  value: T;
}

type TICRadioGroup<T> = {
  selectedValue?: T;
  className?: string;
  options: IICRadioGroupOption<T>[];
  onSelectionChange: (optio: IICRadioGroupOption<T>) => void;
};

const ICRadioGroup = <T extends Object>({
  selectedValue,
  options,
  onSelectionChange,
  className,
}: TICRadioGroup<T>) => {
  return (
    <>
      {options.map((item, index) => (
        <div
          key={index}
          className={`flex items-center ${index === 0 ? "" : "top"}`}
        >
          <input
            id={item.value.toString()}
            type="radio"
            className={`w-4 h-4 text-skin-selected-interest bg-skin-selected-interests border-skin-selected-interests focus:ring-0 dark:focus:ring-0 focus:border-0 checkbox-color ${
              className ? className : ""
            }`}
            value={item.value.toString()}
            checked={selectedValue === item.value}
            onChange={() => onSelectionChange(item)}
          />
          <label
            htmlFor={item.value.toString()}
            className="ms-2 text-sm font-medium typo-input-label"
          >
            {item.label}
          </label>
        </div>
      ))}
    </>
  );
};

export default ICRadioGroup;
