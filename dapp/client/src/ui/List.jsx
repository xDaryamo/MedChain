/* eslint-disable react/prop-types */
import Button from "./Button";
import { FaPlus } from "react-icons/fa";

const List = ({ items, itemKey, ItemComponent, user, onAddNew, hasAddBtn }) => {
  return (
    <div className="mx-auto max-w-full p-4">
      <div className="-mx-2 flex flex-wrap">
        {items.map((item) => (
          <ItemComponent key={item[itemKey]} item={item} />
        ))}
        {user.role === "practitioner" && hasAddBtn && (
          <div className="flex w-full items-center justify-center p-2 sm:w-1/2 md:w-1/3 lg:w-1/4">
            <Button onClick={onAddNew} variant="add">
              <FaPlus />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
