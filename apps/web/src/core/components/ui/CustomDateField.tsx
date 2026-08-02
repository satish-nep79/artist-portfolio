import { useMemo } from "react";
import TextField from "@/core/components/ui/TextField";

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
}

const CustomDateField = ({
  minDate,
  maxDate,
  id,
  name,
  label,
  placeholder,
  isRequired,
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
    />
  );
};

export default CustomDateField;
