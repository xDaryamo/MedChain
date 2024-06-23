import { forwardRef } from "react";

/* eslint-disable react/prop-types */
const FormSelect = forwardRef(function FormSelect(
  { id, label, options, className = "", ...props },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="mb-3 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        ref={ref}
        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

export default FormSelect;
