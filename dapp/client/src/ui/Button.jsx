/* eslint-disable react/prop-types */

const Button = ({ children }) => {
  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center rounded-md bg-cyan-600 py-2 text-lg font-semibold text-white transition-all duration-500 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 md:col-span-2"
    >
      {children}
    </button>
  );
};

export default Button;
