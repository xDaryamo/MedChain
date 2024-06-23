import { ArrowLeftStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useLogout } from "./useAuth";

function Logout() {
  const { logout, isPending } = useLogout();

  return (
    <button
      onClick={logout}
      className="flex items-center text-cyan-900 transition duration-300 hover:text-cyan-500"
    >
      <ArrowLeftStartOnRectangleIcon className="mr-2 h-6 w-6" />
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

export default Logout;
