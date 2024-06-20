import { useState } from "react";
import { useRegister } from "./useAuth";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    role: "",
    organization: "",
    fhirData: {}, // Aggiungi i campi necessari per fhirData
  });

  // eslint-disable-next-line no-unused-vars
  const { register, isPending } = useRegister();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedFormData = {
      ...formData,
      fhirData: JSON.parse(formData.fhirData), // Converti la stringa JSON in un oggetto
    };
    register(updatedFormData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>
      <label>
        Username:
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </label>
      <label>
        Role:
        <input
          type="text"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
      </label>
      <label>
        Organization:
        <input
          type="text"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
        />
      </label>
      <label>
        FHIR Data:
        <input
          type="text"
          name="fhirData"
          value={JSON.stringify(formData.fhirData)}
          onChange={handleChange}
        />
      </label>
      <button type="submit" disabled={isPending}>
        {isPending ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
