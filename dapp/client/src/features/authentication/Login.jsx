import { useState } from "react";
import { useLogin } from "./useAuth";
import LoginForm from "../../ui/LoginForm";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "doctor@example.com",
    password: "password123",
  });

  const { login, isPending } = useLogin();

  const handleLogin = () => {
    login(formData, {
      onSettled: () => setFormData({ email: "", password: "" }),
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <LoginForm
        onSubmit={handleLogin}
        isPending={isPending}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default Login;
