import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from "../../services/apiAuth";

// Hook per il login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      const { token, userId, organization, role, username, expireDate } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("expireDate", expireDate);

      queryClient.setQueryData(["user"], {
        userId,
        organization,
        role,
        username,
      }); // Memorizza i dati necessari nella cache

      toast.success("User successfully logged in");
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      toast.error("Provided email or password are incorrect");
      console.error("Login error", error);
    },
  });

  return { login, isLoading };
};

// Hook per la registrazione
export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: register, isLoading } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const { token, userId, organization, role, username, expireDate } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("expireDate", expireDate);

      queryClient.setQueryData(["user"], {
        userId,
        organization,
        role,
        username,
      }); // Memorizza i dati necessari nella cache

      toast.success("User successfully registered");
      navigate("/home", { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Registration error", error);
    },
  });

  return { register, isLoading };
};

// Hook per il logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isLoading } = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
      localStorage.removeItem("expireDate");
    },
    onSuccess: () => {
      queryClient.removeQueries(["user"]); // Rimuove i dati dalla cache
      toast.success("User successfully logged out");
      navigate("/login", { replace: true });
    },
  });

  return { logout, isLoading };
};

// Hook per ottenere l'utente corrente
export const useUser = () => {
  const { data: user, isLoading } = useQuery(["user"], getCurrentUser, {
    onError: (error) => {
      console.error("Failed to fetch user", error);
      toast.error("Failed to fetch user data");
    },
  });

  return { user, isLoading };
};
