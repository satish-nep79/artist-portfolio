interface TextAreaProps {
  id: string;
  name: string;
  label: string;
  isRequired?: boolean;
  rows?: number;
  placeholder?: string;
}

const TextArea = ({
  id,
  name,
  label,
  isRequired,
  rows = 3,
  placeholder,
}: TextAreaProps) => {
  return (
    <div className="relative w-full">
      <textarea
        id={id}
        name={name}
        rows={rows}
        placeholder={placeholder || " "}
        required={isRequired}
        className="peer w-full p-3 pt-0 mt-5 pl-0 border-b border-glass-border text-text-primary bg-transparent resize-none placeholder:text-transparent
          focus:placeholder:text-glass-border
          focus:outline-none focus:border-primary transition-all duration-200
          [&:not(:placeholder-shown)]:border-primary:border-primary"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-0 text-glass-border text-base transition-all duration-200 pointer-events-none
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-glass-border
      peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary 
      peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-text-body
      "
      >
        {label}
        {isRequired && <span className="text-error leading-none">*</span>}
      </label>
    </div>
  );
};

export default TextArea;
