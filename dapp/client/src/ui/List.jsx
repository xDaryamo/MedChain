/* eslint-disable react/prop-types */
import Card from "./Card";
import AddButton from "./AddButton";

const List = ({ items, itemKey, itemText, user, onAddNew }) => {
  return (
    <div className="mx-auto max-w-full p-4">
      <div className="-mx-2 flex flex-wrap">
        {items.map((item) => (
          <Card
            key={item[itemKey]}
            item={item}
            itemKey={itemKey}
            itemText={itemText}
          />
        ))}
        {user.role === "practitioner" && <AddButton onClick={onAddNew} />}
      </div>
    </div>
  );
};

export default List;
