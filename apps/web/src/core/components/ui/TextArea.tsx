import type { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  isRequired?: boolean;
  rows?: number;
  placeholder?: string;
  min?: number;
  max?: number;
  error?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  validator?: UseFormRegisterReturn;
}

const TextArea = ({
  id,
  name,
  label,
  isRequired,
  rows = 3,
  placeholder,
  error,
  onChange,
  value,
  validator,
  min,
  max,
}: TextAreaProps) => {
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder || " "}
        required={isRequired}
        minLength={min}
        maxLength={max}
        value={value}
        onChange={onChange}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...validator}
        className={`peer w-full p-3 pt-0 mt-5 pl-0 border-b ${error ? "border-error" : "border-glass-border"} text-text-primary bg-transparent resize-none placeholder:text-transparent
          focus:placeholder:text-glass-border
          focus:outline-none focus:border-primary transition-all duration-200
          [&:not(:placeholder-shown)]:border-primary:border-primary`}
      />
      <label
        htmlFor={id}
        className={`absolute left-0 top-0 text-glass-border text-base transition-all duration-200 pointer-events-none
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-glass-border
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary 
      peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:${error ? "text-error" : "text-text-body"}
      `}
      >
        {label}
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

export default TextArea;
