/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const Card = ({ item, itemKey, children }) => {
  return (
    <div className="group relative w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
      <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 shadow transition duration-300 group-hover:shadow-lg">
        {children}
        <Link to={`/records/${item[itemKey]}`}>
          <div className="absolute inset-2 flex items-center justify-center rounded-lg bg-black bg-opacity-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cyan-800">
              <FaEye className="h-6 w-6" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Card;
