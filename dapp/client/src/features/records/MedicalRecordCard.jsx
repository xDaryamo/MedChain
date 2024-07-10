/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../../ui/Card";
import { useSearchLabResults } from "../labresults/useLabResults";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }

  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const MedicalRecordCard = ({ item, patient }) => {
  const recordID = item.identifier;
  const { labResults = [] } = useSearchLabResults({
    query: {
      selector: {
        "subject.reference": `${item.patientID}`,
      },
    },
  });

  const getLabResultText = (resultID) => {
    const labResult = labResults.find(
      (result) => result.identifier?.value === resultID,
    );
    return labResult ? labResult.code?.text : "N/A";
  };

  const renderList = (title, list) => {
    if (!list || list.length === 0) {
      return (
        <div className="text-cyan-950">
          <span className="font-bold">{title}:</span> N/A
        </div>
      );
    }

    if (list.length === 1) {
      return (
        <div className="text-cyan-950">
          <span className="font-bold">{title}:</span> {list[0]}
        </div>
      );
    }

    return (
      <div className="text-cyan-950">
        <span className="font-bold">{title}:</span>
        <ul className="list-inside list-disc">
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };

  const allergies = item.allergies
    ? item.allergies.map((allergy) => {
        if (
          allergy.code &&
          allergy.code.coding &&
          allergy.code.coding.length > 0
        ) {
          return allergy.code.coding[0].display;
        }
        return "N/A";
      })
    : [];

  const conditions = item.conditions
    ? item.conditions.map((condition) => {
        if (
          condition.code &&
          condition.code.coding &&
          condition.code.coding.length > 0
        ) {
          return condition.code.coding[0].display;
        }
        return "N/A";
      })
    : [];

  const procedures = item.procedures
    ? item.procedures.map((procedure) => {
        if (
          procedure.code &&
          procedure.code.coding &&
          procedure.code.coding.length > 0
        ) {
          return procedure.code.coding[0].display;
        }
        return "N/A";
      })
    : [];

  const prescriptions = item.prescriptions
    ? item.prescriptions.map((prescription) => {
        if (
          prescription.medicationCodeableConcept &&
          prescription.medicationCodeableConcept.coding &&
          prescription.medicationCodeableConcept.coding.length > 0
        ) {
          return prescription.medicationCodeableConcept.coding[0].display;
        }
        return "N/A";
      })
    : [];

  const labResultsText = item.labResultsIDs
    ? item.labResultsIDs.map((resultID) => getLabResultText(resultID))
    : [];

  return (
    <Card item={item} itemKey="identifier">
      <Link to={`/records/${recordID}`} className="mb-4 flex-1">
        <div className="text-cyan-950">
          <span className="font-bold">Numero della Cartella Clinica:</span>{" "}
          {recordID}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Nome del Paziente:</span>{" "}
          {patient.name?.text || "Paziente Sconosciuto"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Data di Nascita:</span>{" "}
          {formatDate(patient.date)}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Sesso:</span>{" "}
          {patient.gender?.coding[0]?.display || "Sesso Sconosciuto"}
        </div>
        {renderList("Condizioni Mediche", conditions)}
        {renderList("Procedure", procedures)}
        {renderList("Prescrizioni", prescriptions)}
        {renderList("Allergie", allergies)}
        {renderList("Risultati di Laboratorio", labResultsText)}
      </Link>
    </Card>
  );
};

export default MedicalRecordCard;
