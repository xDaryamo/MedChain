import { useLogout } from "./useAuth";

function Logout() {
  const { logout, isPending } = useLogout();

  return (
    <button onClick={logout}>{isPending ? "Logging out..." : "Logout"}</button>
  );
}

export default Logout;
