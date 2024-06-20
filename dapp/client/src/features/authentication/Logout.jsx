import { useLogout } from "./useAuth";

function Logout() {
  const { logout, isLoading } = useLogout();

  return (
    <button
      onClick={() => {
        logout();
        console.log(isLoading);
      }}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}

export default Logout;
