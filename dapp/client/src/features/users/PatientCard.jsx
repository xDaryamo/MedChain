/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const PatientCard = ({ item }) => {
  const patientName = `${item.name?.text || "Unknown Patient"}`;
  const patientDOB = formatDate(item.date);
  const patientGender = `${item?.gender?.coding[0].display || "Unknown Gender"}`;
  const patientID = item.identifier.value;

  return (
    <Link to={`/patients/${patientID}`} className="mb-4 flex-1">
      <Card item={item} itemKey="id">
        <div>
          <strong>Nome del Paziente:</strong> {patientName}
        </div>
        <div>
          <strong>Data di Nascita:</strong> {patientDOB}
        </div>
        <div>
          <strong>Sesso:</strong> {patientGender}
        </div>
      </Card>
    </Link>
  );
};

export default PatientCard;
