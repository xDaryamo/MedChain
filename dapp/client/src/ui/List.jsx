/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Button from "./Button";

const List = ({
  items,
  itemKey,
  itemLink,
  itemText,
  onDelete,
  isDeleting,
  user,
}) => {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Items List</h1>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item[itemKey]}
            className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
          >
            <Link to={`${itemLink}/${item[itemKey]}`} className="flex-1">
              {itemText(item)}
            </Link>
            {user.role === "practitioner" && (
              <Button
                onClick={() => onDelete(item[itemKey])}
                disabled={isDeleting}
                className="ml-4"
              >
                Delete
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
