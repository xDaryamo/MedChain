/* eslint-disable react/prop-types */
// src/ui/LoginForm.jsx
import { useNavigate } from "react-router-dom";
import AppLogo from "./AppLogo";
import BackButton from "./BackButton";
import Button from "./Button";
import FormInput from "./FormInput";
import FormRow from "./FormRow";
import SmallSpinner from "./SmallSpinner";

const LoginForm = ({ onSubmit, isPending, formData, setFormData }) => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="flex max-w-sm flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 shadow-lg md:w-full md:max-w-xl">
      <div className="absolute left-4 top-4">
        <BackButton onClick={() => navigate("/")}>Indietro</BackButton>
      </div>
      <div className="mb-6 flex flex-col items-center gap-2">
        <AppLogo isNav={false} />
      </div>
      <h2 className="mb-6 text-center text-xl font-bold text-cyan-950 md:text-2xl">
        Accedi al tuo Account
      </h2>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="space-y-4">
          <FormRow label="Indirizzo Email">
            <FormInput
              type="email"
              id="email"
              name="email"
              autoComplete="username"
              value={formData.email}
              onChange={handleChange}
              required="true"
            />
          </FormRow>
          <FormRow label="Password">
            <FormInput
              type="password"
              id="password"
              name="password"
              autoComplete="password"
              value={formData.password}
              onChange={handleChange}
              required="true"
            />
          </FormRow>
        </div>
        <div className="mt-8">
          <div className="flex items-center justify-center">
            {" "}
            <Button type="submit" variant="primary" size="large">
              {isPending ? <SmallSpinner /> : "Login"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
