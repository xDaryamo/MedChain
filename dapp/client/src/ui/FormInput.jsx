import { forwardRef } from "react";

/* eslint-disable react/prop-types */
const FormInput = forwardRef(function FormInput(
  { type, id, autoComplete = "", className, ...props },
  ref,
) {
  return (
    <input
      type={type}
      id={id}
      ref={ref}
      autoComplete={autoComplete}
      className={`w-full rounded-md border border-gray-300 px-4 py-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 ${className}`}
      {...props}
    />
  );
});

export default FormInput;
