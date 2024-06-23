/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const FormContext = createContext();

export const useFormContext = () => {
  return useContext(FormContext);
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({});

  const updateFormData = (updatedData) => {
    setFormData((prevData) => ({ ...prevData, ...updatedData }));
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormContext.Provider>
  );
};
