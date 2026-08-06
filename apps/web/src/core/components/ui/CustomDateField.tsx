import { useMemo } from "react";
import TextField from "@/core/components/ui/TextField";
import type { UseFormRegisterReturn } from "react-hook-form";

const toInputDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface CustomDateFieldProps {
  minDate?: Date;
  maxDate?: Date;
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  error?: string;
  onChange?: (date: Date) => void;
  value?: Date;
  validator?: UseFormRegisterReturn; // Replace with the appropriate type for your validator
}

const CustomDateField = ({
  id,
  name,
  label,
  placeholder,
  isRequired,
  minDate,
  maxDate,
  error,
  onChange,
  value,
  validator,
}: CustomDateFieldProps) => {
  const today = useMemo(() => new Date(), []);

  const computedMin = minDate ?? today;
  const computedMax = maxDate ?? undefined;

  return (
    <TextField
      id={id || "completionDate"}
      name={name || "completionDate"}
      type="date"
      label={label || "Date"}
      placeholder={placeholder || "Select a date"}
      isRequired={isRequired}
      min={computedMin?.toISOString().split("T")[0]}
      max={computedMax?.toISOString().split("T")[0]}
      error={error}
      onChange={(e) => {
        const selectedDate = new Date(e.target.value);
        onChange?.(selectedDate);
      }}
      value={value ? toInputDate(value) : ""}
      validator={validator}
    />
  );
};

export default CustomDateField;
