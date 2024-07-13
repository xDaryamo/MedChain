// src/pages/Register.jsx
import { useNavigate } from "react-router-dom";
import BackButton from "../../ui/BackButton";
import SignupTabs from "../../ui/SignupTabs";

const Signup = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gray-100 pl-8 pt-8">
        <BackButton onClick={() => navigate("/")}>Indietro</BackButton>
      </div>
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <SignupTabs />
      </div>
    </>
  );
};

export default Signup;
