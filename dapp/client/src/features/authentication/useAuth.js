import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../../services/apiAuth";
// Hook per il login

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (userData) => loginUser(userData),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);

      toast.success("User successfully logged in");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error("Provided email or password are incorrect");
      console.error("Login error", error);
    },
  });

  return { login, isPending };
};

// Hook per la registrazione
export const useSignup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: signup, isPending } = useMutation({
    mutationFn: (userData) => registerUser(userData),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);

      toast.success("User successfully registered");
      navigate("/", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Registration error", error);
    },
  });

  return { signup, isPending };
};

// // Hook per il logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("session");
    },
    onSuccess: () => {
      queryClient.removeQueries();
      toast.success("User successfully logged out");
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      console.error("Logout error", error);
      toast.error("Logout failed");
    },
  });

  return { logout, isPending };
};

export function useUser() {
  const { isPending, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
  return {
    isPending,
    user,
    isAuthenticated: user?.role === "practitioner" || user?.role === "patient",
  };
}
