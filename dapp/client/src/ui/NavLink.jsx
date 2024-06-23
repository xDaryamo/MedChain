import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
function NavLink({ children, to }) {
  return (
    <Link
      to={to}
      className="text-cyan-900 transition duration-300 hover:text-cyan-500"
    >
      {children}
    </Link>
  );
}

export default NavLink;
