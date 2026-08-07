import type { UseFormRegisterReturn } from "react-hook-form";
import { useState } from "react";

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id: string;
  name: string;
  label: string;
  options: DropdownOption[];
  isRequired?: boolean;
  value?: DropdownOption;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  validator?: UseFormRegisterReturn;
  error?: string;
}

const Dropdown = ({
  id,
  name,
  label,
  options,
  isRequired,
  value,
  onChange,
  validator,
  error,
}: DropdownProps) => {
  const [selectedValue, setSelectedValue] = useState(value?.value ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setSelectedValue(newValue);
    console.log("Selected option:", newValue);
    if(onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        {...validator}
        value={selectedValue}
        onChange={handleChange}
        className={`peer w-full p-3 pt-5 pl-0 pr-8 border-b ${error ? "border-error" : "border-glass-border"} ${selectedValue ? "text-text-primary" : "text-glass-border"} bg-transparent appearance-none
          focus:outline-none focus:border-primary transition-all duration-200`}
      >
        <option value="" disabled={isRequired}>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className={`absolute left-0 top-0 flex items-center gap-1 text-glass-border text-base transition-all duration-200 pointer-events-none 
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-glass-border 
            peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary 
            peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:${error ? "text-error" : "text-text-body"}`}
      >
        {label}{" "}
        {isRequired && <span className="text-error leading-none">*</span>}
      </label>
      {error && (
        <p id={`${id}-error`} className="text-xs text-error mt-1">
          {error}
        </p>
      )}

      <svg
        className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-glass-border peer-focus:text-primary transition-colors duration-200"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default Dropdown;
