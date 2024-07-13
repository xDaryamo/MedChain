// src/ui/Navbar.jsx

import Logout from "../features/authentication/Logout";
import AppLogo from "./AppLogo";
import { useUser } from "../features/authentication/useAuth";
import NavLink from "./NavLink";

const Navbar = () => {
  const { isAuthenticated, user } = useUser();
  const role = user?.role;
  return (
    <nav className="border-8 p-6">
      <ul className="flex items-center justify-between">
        <li>
          <NavLink to="/">
            <div className="flex items-center gap-2 md:ml-4 md:mr-6">
              <AppLogo isNav={true} />
            </div>
          </NavLink>
        </li>

        {role === "practitioner" && (
          <>
            <li>
              <NavLink to="/patients">Pazienti</NavLink>
            </li>
          </>
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
          <div className="flex items-center justify-around gap-5">
            <li>
              <NavLink to="/login">Accedi</NavLink>
            </li>
            <li>
              <NavLink to="/signup">Registrati</NavLink>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
