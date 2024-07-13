// src/ui/Navbar.jsx

import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Logout from "../features/authentication/Logout";
import AppLogo from "./AppLogo";
import { useUser } from "../features/authentication/useAuth";
import NavLink from "./NavLink";

const Navbar = () => {
  const { isAuthenticated, user } = useUser();
  const role = user?.role;
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.classList.toggle("overflow-hidden", !isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <NavLink to="/">
            <div className="flex items-center gap-2 md:ml-4 md:mr-6">
              <AppLogo isNav={true} />
            </div>
          </NavLink>
        </div>

        <div className="hidden space-x-4 md:flex md:flex-grow md:items-center md:justify-center">
          {role === "practitioner" && (
            <NavLink to="/patients">Pazienti</NavLink>
          )}
          {role === "patient" && (
            <>
              <NavLink to={`/patients/${user.userId}/records`}>
                Cartelle Cliniche
              </NavLink>
              <NavLink to={`/patients/${user.userId}/labresults`}>
                Risultati Analisi
              </NavLink>
              <NavLink to={`/patients/${user.userId}/encounters`}>
                Visite
              </NavLink>
              <NavLink to={`/patients/${user.userId}/prescriptions`}>
                Prescrizioni
              </NavLink>
            </>
          )}
          {isAuthenticated && <NavLink to="/profile">Profilo</NavLink>}
        </div>

        <div className="hidden md:flex md:items-center md:space-x-4">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login">Accedi</NavLink>
              <NavLink to="/signup">Registrati</NavLink>
            </>
          ) : (
            <Logout />
          )}
        </div>

        <div className="flex items-center md:hidden">
          <button
            onClick={toggleMenu}
            type="button"
            className="text-cyan-900 hover:text-cyan-500 focus:outline-none"
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <ul className="flex flex-col items-center space-y-4 p-4">
            {role === "practitioner" && (
              <li>
                <NavLink to="/patients">Pazienti</NavLink>
              </li>
            )}
            {role === "patient" && (
              <>
                <li>
                  <NavLink to={`/patients/${user.userId}/records`}>
                    Cartelle Cliniche
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/patients/${user.userId}/labresults`}>
                    Risultati Analisi
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/patients/${user.userId}/encounters`}>
                    Visite
                  </NavLink>
                </li>
                <li>
                  <NavLink to={`/patients/${user.userId}/prescriptions`}>
                    Prescrizioni
                  </NavLink>
                </li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li>
                  <NavLink to="/profile">Profilo</NavLink>
                </li>
                <li>
                  <Logout />
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink to="/login">Accedi</NavLink>
                </li>
                <li>
                  <NavLink to="/signup">Registrati</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
