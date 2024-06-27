/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import SmallSpinner from "./SmallSpinner";
import { toast } from "react-hot-toast";
import { useState } from "react";

const List = ({
  items,
  itemKey,
  itemText,
  onDelete,
  isDeleting,
  user,
  onAddNew,
}) => {
  const [isConfirmVisible, setConfirmVisible] = useState(false);

  const handleDeleteClick = (id) => {
    setConfirmVisible(true);
    toast(
      ({ id: toastId }) => (
        <div>
          <p>Are you sure you want to delete this record?</p>
          <div className="flex justify-end space-x-2">
            <button
              className="rounded bg-red-500 px-4 py-2 text-white"
              onClick={() => {
                onDelete(id);
                toast.dismiss(toastId);
                setConfirmVisible(false);
              }}
            >
              Delete
            </button>
            <button
              className="rounded bg-gray-300 px-4 py-2"
              onClick={() => {
                toast.dismiss(toastId);
                setConfirmVisible(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
      },
    );
  };

  return (
    <div className="relative mx-auto max-w-full p-4">
      <div className={isConfirmVisible ? "pointer-events-none" : ""}>
        <div className="-mx-2 flex flex-wrap">
          {items.map((item) => (
            <div
              key={item[itemKey]}
              className="w-full p-2 sm:w-1/2 md:w-1/3 lg:w-1/4"
            >
              <div className="flex h-full flex-col justify-between rounded-lg bg-white p-4 shadow">
                <Link to={`/records/${item[itemKey]}`} className="mb-4 flex-1">
                  {itemText(item)}
                </Link>
                {user.role === "practitioner" && (
                  <div
                    onClick={() => handleDeleteClick(item[itemKey])}
                    className="transi ml-auto cursor-pointer text-stone-400 transition-all duration-300 hover:text-red-600"
                  >
                    {isDeleting ? (
                      <SmallSpinner />
                    ) : (
                      <FaTrash className="h-4 w-4" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {user.role === "practitioner" && (
            <div className="flex w-full items-center justify-center p-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div
                className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-cyan-600 text-3xl text-white shadow-lg transition-all duration-300 hover:bg-cyan-500"
                onClick={onAddNew}
              >
                +
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default List;
