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
    "flex items-center justify-center font-semibold transition-all duration-500 focus:outline-none focus:ring-2";

  const variantStyles = {
    primary:
      "bg-cyan-600 text-white hover:bg-cyan-500 focus:ring-cyan-500 rounded-md",
    secondary:
      "bg-cyan-700 text-white hover:bg-cyan-500 focus:ring-cyan-500 rounded-md",
    delete: "text-stone-600 hover:text-cyan-600 focus:ring-cyan-500 rounded-md",
    add: "h-12 w-12 bg-cyan-600 text-white shadow-lg hover:bg-cyan-500 focus:ring-cyan-500 rounded-full",
  };

  const sizeStyles = {
    small: "text-sm p-2",
    medium: "py-2 px-4 text-lg",
    large: "py-2 px-6 text-lg w-3/4",
    add: "h-16 w-16 text-3xl",
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
