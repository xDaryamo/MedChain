/* eslint-disable react/prop-types */
import Button from "./Button";
import { FaPlus } from "react-icons/fa";

const List = ({
  items,
  itemKey,
  ItemComponent,
  user,
  patient,
  onAddNew,
  hasAddBtn,
}) => {
  return (
    <div className="mx-auto max-w-full p-4">
      <div className="-mx-2 flex flex-wrap">
        {items.map((item, index) => {
          const key = itemKey
            ? itemKey.split(".").reduce((o, i) => o[i], item)
            : index;
          return <ItemComponent key={key} item={item} patient={patient} />;
        })}
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
