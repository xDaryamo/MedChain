/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

const PatientCard = ({ item }) => {
  const patientName = `${item.name?.text || "Unknown Patient"}`;
  const patientDOB = `${item.birthDate || "Unknown Birth Date"}`;
  const patientGender = `${item.gender || "Unknown Gender"}`;
  const patientID = item.id;

  return (
    <Card item={item} itemKey="id">
      <Link to={`/patients/${patientID}`} className="mb-4 flex-1">
        <div>
          <strong>Nome del Paziente:</strong> {patientName}
        </div>
        <div>
          <strong>Data di Nascita:</strong> {patientDOB}
        </div>
        <div>
          <strong>Sesso:</strong> {patientGender}
        </div>
      </Link>
    </Card>
  );
};

export default PatientCard;
