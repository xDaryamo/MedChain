/* eslint-disable react/prop-types */

const Button = ({ children }) => {
  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center rounded-md bg-blue-500 py-2 text-lg font-semibold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {children}
    </button>
  );
};

export default Button;
