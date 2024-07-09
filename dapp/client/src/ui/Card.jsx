/* eslint-disable react/prop-types */
import { FaEye } from "react-icons/fa";

const Card = ({ children }) => {
  return (
    <div className="group relative w-full p-2 sm:w-1/2 md:w-1/3">
      <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 shadow transition duration-300 group-hover:shadow-lg">
        {children}

        <div className="pointer-events-none absolute inset-2 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cyan-800">
            <FaEye className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
