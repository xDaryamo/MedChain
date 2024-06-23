import { useState } from "react";
import FormRow from "./FormRow";
import FormInput from "./FormInput";
import Button from "./Button";

const PractitionerSignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    specialization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormRow label="Full Name">
        <FormInput
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required="true"
        />
      </FormRow>
      <FormRow label="Specialization">
        <FormInput
          type="text"
          id="specialization"
          name="specialization"
          value={formData.specialization}
          onChange={handleChange}
          required="true"
        />
      </FormRow>
      <FormRow label="Email">
        <FormInput
          type="email"
          id="email"
          name="email"
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
          value={formData.password}
          onChange={handleChange}
          required="true"
        />
      </FormRow>
      <Button>Register as Practitioner</Button>
    </form>
  );
};

export default PractitionerSignupForm;
