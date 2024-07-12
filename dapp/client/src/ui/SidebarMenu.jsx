/* eslint-disable react/prop-types */
// ui/SidebarMenu.jsx

const SidebarMenu = ({ userRole, children }) => {
  return (
    <aside className="flex w-full flex-col bg-cyan-600 bg-opacity-50 p-4 text-white md:w-1/4">
      <h3 className="mt-2 text-xl font-bold text-cyan-800">
        {userRole === "patient" ? "Menù Paziente" : "Menù Medico"}
      </h3>
      <nav className="mt-4 flex flex-col space-y-4">{children}</nav>
    </aside>
  );
};

export default SidebarMenu;
