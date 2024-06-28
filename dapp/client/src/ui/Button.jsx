/* eslint-disable react/prop-types */
import clsx from "clsx";

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  ...restProps
}) => {
  const baseStyles =
    "flex items-center justify-center rounded-md font-semibold transition-all duration-500 focus:outline-none focus:ring-2";

  const variantStyles = {
    primary: "bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500",
    secondary: "bg-cyan-700 text-white hover:bg-cyan-500 focus:ring-cyan-500",
    delete: "text-stone-600 hover:text-cyan-600 focus:ring-cyan-500",
    small: "bg-cyan-700 text-white hover:bg-cyan-500 focus:ring-cyan-500",
  };

  const sizeStyles = {
    small: "text-sm p-2",
    medium: "py-2 px-4 text-lg",
    large: "py-2 px-6 text-lg w-3/4",
  };

  return (
    <button
      type={type}
      {...restProps}
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size])}
    >
      {children}
    </button>
  );
};

export default Button;
