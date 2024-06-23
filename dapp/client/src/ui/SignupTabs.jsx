import { useState } from "react";
import PatientSignupForm from "./PatientSignupForm";
import PractitionerSignupForm from "./PractitionerSignupForm";

const SignupTabs = () => {
  const [activeTab, setActiveTab] = useState("patient");

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="mb-8 flex w-full justify-center">
        <div className="flex w-full max-w-xl justify-between">
          <button
            className={`border-b-4 px-4 py-2 transition-all duration-500 focus:outline-none ${
              activeTab === "patient"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent hover:border-cyan-500"
            }`}
            onClick={() => setActiveTab("patient")}
          >
            Patient Registration
          </button>
          <button
            className={`border-b-4 px-4 py-2 transition-all duration-500 focus:outline-none ${
              activeTab === "practitioner"
                ? "border-cyan-600 text-cyan-600"
                : "border-transparent hover:border-cyan-500"
            }`}
            onClick={() => setActiveTab("practitioner")}
          >
            Practitioner Registration
          </button>
        </div>
      </div>
      <div className="w-full rounded-lg bg-white p-4 shadow-lg sm:w-3/4 md:w-[70vw]">
        {activeTab === "patient" ? (
          <PatientSignupForm />
        ) : (
          <PractitionerSignupForm />
        )}
      </div>
    </div>
  );
};

export default SignupTabs;
