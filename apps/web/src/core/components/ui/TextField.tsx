import type { UseFormRegisterReturn } from "react-hook-form";
interface TextFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  min?: number | string;
  max?: number | string;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  validator?: UseFormRegisterReturn;
}

const TextField = ({
  id,
  name,
  type,
  label,
  isRequired,
  placeholder,
  min,
  max,
  error,
  onChange,
  value,
  validator,
}: TextFieldProps) => {
  return (
    <div className="relative w-full">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || " "}
        min={type === "text" ? undefined : min}
        max={type === "text" ? undefined : max}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...validator}
        className={`peer w-full p-3 pt-5 pl-0 border-b ${error ? "border-error" : "border-glass-border"} text-text-primary bg-transparent placeholder:text-transparent
            focus:outline-none focus:border-primary focus:placeholder:text-text-secondary transition-all duration-200 
            `}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 top-4 flex items-center gap-1 text-glass-border text-base transition-all duration-200 pointer-events-none 
            peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-glass-border 
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
    </div>
  );
};

export default TextField;
