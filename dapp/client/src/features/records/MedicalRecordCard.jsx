/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Card from "../../ui/Card";

const MedicalRecordCard = ({ item }) => {
  const { patient, isPending, error } = useGetPatient(item.patientID);
  console.log(patient);

  if (isPending) return <Spinner />;
  if (error) return <div>Error loading patient data</div>;

  const patientName = patient ? `${patient.name?.text}` : "Unknown Patient";
  const patientDOB = patient ? `${patient.birthDate}` : "Unknown DOB";
  const patientGender = patient
    ? `${patient.gender.coding[0].display}`
    : "Unknown Gender";

  const recordID = item.identifier;
  const visitDate = item.visitDate || "Unknown Visit Date";
  const visitReason = item.visitReason || "Unknown Visit Reason";
  const responsibleDoctor = item.responsibleDoctor || "Unknown Doctor";
  const recordStatus = item.status || "Unknown Status";
  const department = item.department || "Unknown Department";
  const importantNotes = item.importantNotes || "No Important Notes";

  return (
    <Card item={item} itemKey="identifier">
      <Link to={`/records/${recordID}`} className="mb-4 flex-1">
        <div>
          <strong>Numero della Cartella Clinica:</strong> {recordID}
        </div>
        <div>
          <strong>Nome del Paziente:</strong> {patientName}
        </div>
        <div>
          <strong>Data di Nascita:</strong> {patientDOB}
        </div>
        <div>
          <strong>Sesso:</strong> {patientGender}
        </div>
        <div>
          <strong>Data della Visita:</strong> {visitDate}
        </div>
        <div>
          <strong>Motivo della Visita:</strong> {visitReason}
        </div>
        <div>
          <strong>Medico Responsabile:</strong> {responsibleDoctor}
        </div>
        <div>
          <strong>Stato della Cartella:</strong> {recordStatus}
        </div>
        <div>
          <strong>Reparto:</strong> {department}
        </div>
        <div>
          <strong>Note Importanti:</strong> {importantNotes}
        </div>
      </Link>
    </Card>
  );
};

export default MedicalRecordCard;
