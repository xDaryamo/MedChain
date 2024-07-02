/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import { useGetObservation } from "../observations/useObservations";
import Spinner from "../../ui/Spinner";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const ConditionEvidenceDetail = ({ evidenceDetail }) => {
  const { observation, isPending, error } = useGetObservation(
    evidenceDetail.reference.split("/").pop(),
  );

  if (isPending) return <Spinner />;
  if (error) return <div>Errore nel caricamento dell&apososservazione</div>;

  return (
    <li>
      {observation ? (
        <>
          <strong>{observation.code.coding[0].display}:</strong>{" "}
          {observation.value || "N/A"}
        </>
      ) : (
        "Osservazione non disponibile"
      )}
    </li>
  );
};

const MedicalRecordCard = ({ item }) => {
  const { patient, isPending, error } = useGetPatient(item.patientID);

  if (isPending) return <Spinner />;
  if (error) return <div>Errore nel caricamento dei dati del paziente</div>;

  const patientName = patient
    ? `${patient.name?.text}`
    : "Paziente Sconosciuto";
  const patientDOB = patient
    ? formatDate(patient.date)
    : "Data di Nascita Sconosciuta";
  const patientGender = patient
    ? `${patient.gender.coding[0].display}`
    : "Sesso Sconosciuto";

  const recordID = item.identifier;

  const conditions = item.conditions
    ? item.conditions.map((condition, index) => (
        <li key={index}>
          {condition.code.coding[0].display}
          {condition.evidence && condition.evidence.length > 0 && (
            <ul>
              {condition.evidence.map((evidence, idx) => (
                <li key={idx}>
                  {evidence.code && evidence.code.coding[0].display}
                  {evidence.detail && evidence.detail.length > 0 && (
                    <ul>
                      {evidence.detail.map((detail, id) => (
                        <ConditionEvidenceDetail
                          key={id}
                          evidenceDetail={detail}
                        />
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))
    : [];

  const procedures = item.procedures
    ? item.procedures.map((procedure, index) => (
        <li key={index}>{procedure.code.coding[0].display}</li>
      ))
    : [];

  const prescriptions = item.prescriptions
    ? item.prescriptions.map((prescription, index) => (
        <li key={index}>
          {prescription.medicationCodeableConcept.coding[0].display}
        </li>
      ))
    : [];

  const allergies = item.allergies
    ? item.allergies.map((allergy, index) => (
        <li key={index}>{allergy.code.coding[0].display}</li>
      ))
    : [];

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
          <strong>Condizioni Mediche:</strong>
          <ul>{conditions}</ul>
        </div>
        <div>
          <strong>Procedure:</strong>
          <ul>{procedures}</ul>
        </div>
        <div>
          <strong>Prescrizioni:</strong>
          <ul>{prescriptions}</ul>
        </div>
        <div>
          <strong>Allergie:</strong>
          <ul>{allergies}</ul>
        </div>
      </Link>
    </Card>
  );
};

export default MedicalRecordCard;
