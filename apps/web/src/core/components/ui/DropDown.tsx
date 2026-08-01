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
}

const Dropdown = ({ id, name, label, options, isRequired }: DropdownProps) => {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={isRequired}
        defaultValue=""
        className="peer w-full p-3 pt-5 pl-0 pr-8 border-b border-glass-border text-text-primary bg-transparent appearance-none
          focus:outline-none focus:border-primary transition-all duration-200"
      >
        <option value="" disabled hidden />
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <label
        htmlFor={id}
        className="absolute left-0 top-4 flex items-center gap-1 text-glass-border text-base transition-all duration-200 pointer-events-none
          peer-invalid:top-4 peer-invalid:text-base peer-invalid:text-glass-border
          peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary
          peer-valid:top-0 peer-valid:text-xs peer-valid:text-text-primary"
      >
        {label}{" "}
        {isRequired && <span className="text-error leading-none">*</span>}
      </label>

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
