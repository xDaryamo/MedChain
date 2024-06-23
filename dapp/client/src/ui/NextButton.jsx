/* eslint-disable react/prop-types */
import { ArrowRightIcon } from "@heroicons/react/24/solid";

function NextButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center text-cyan-900 transition-all duration-300 hover:text-cyan-500"
    >
      {children}
      <ArrowRightIcon className="ml-2 h-6 w-6" />
    </button>
  );
}

export default NextButton;
