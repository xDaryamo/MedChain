import PropTypes from "prop-types";

function FormRow({ label, children, error }) {
  return (
    <div>
      {label && (
        <label htmlFor={children.props.id} className="text-cyan-950">
          {label}
        </label>
      )}
      {children}
      {error && <span className="text-sm text-red-600">{error}</span>}
    </div>
  );
}

FormRow.propTypes = {
  label: PropTypes.string,
  children: PropTypes.any,
  error: PropTypes.string,
};

export default FormRow;
