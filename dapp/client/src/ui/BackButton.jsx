/* eslint-disable react/prop-types */
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const BackButton = ({ onClick, children }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center text-cyan-900 transition-all duration-300 hover:text-cyan-500"
    >
      <ArrowLeftIcon className="mr-2 h-6 w-6" />
      {children}
    </button>
  );
};

export default BackButton;
