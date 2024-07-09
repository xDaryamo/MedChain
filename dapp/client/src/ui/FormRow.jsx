/* eslint-disable react/prop-types */
const FormRow = ({ label, error, children }) => {
  return (
    <div className="mb-4">
      <label className="mb-2 block font-bold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-xs italic text-red-500">{error}</p>}
    </div>
  );
};

export default FormRow;
