/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useUser } from "../features/authentication/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isPending } = useUser();
  const navigate = useNavigate();

  useEffect(
    function () {
      if (!isAuthenticated && !isPending) navigate("/login");
    },
    [isAuthenticated, isPending, navigate],
  );

  if (isPending) return <p>Loading...</p>; //TODO: Spinner

  if (isAuthenticated) return children;
}

ProtectedRoute.propTypes = { children: PropTypes.any };

export default ProtectedRoute;
