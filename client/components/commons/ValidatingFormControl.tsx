import { ChangeEvent } from "react";

interface Props {
  type: string;
  label: string;
  value: any;
  change: (e: ChangeEvent<HTMLInputElement>) => void;
  isValid: boolean;
  error: string;
  required?: boolean;
  controlClass?: string;
  inputClass?: string;
  labelClass?: string;
}

const ValidatingFormControl = ({
  label,
  type,
  required,
  value,
  change,
  isValid,
  error,
  controlClass,
  inputClass,
  labelClass,
}: Props) => (
  <div className={`flex flex-col my-2 ${controlClass}`}>
    <label htmlFor={label} className={`mb-2 text-lg font-semibold ${labelClass}`}>
      {label}
    </label>
    <input
      type={type}
      className={`px-2 py-1 border-2 shadow rounded focus-within:outline-none ${
        isValid ? "border-transparent" : "border-red-600"
      } ${inputClass}`}
      name={label}
      id={label}
      value={value}
      onChange={change}
      required={required}
    />
    <small className="text-red-600">{!isValid && error}</small>
  </div>
);

export default ValidatingFormControl;
