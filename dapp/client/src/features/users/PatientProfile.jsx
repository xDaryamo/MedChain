/* eslint-disable react/prop-types */
// pages/PatientProfile.jsx
import Heading from "../../ui/Heading";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }
  const date = new Date(dateString);
  if (isNaN(date)) {
    return "Data non valida";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const PatientProfile = ({ patient }) => {
  return (
    <div>
      <Heading>Dettagli Paziente</Heading>
      <div className="mt-4 space-y-2">
        <div className="text-cyan-950">
          <span className="font-bold">Nome:</span>{" "}
          {patient?.name?.text || "Nome non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Data di Nascita:</span>{" "}
          {formatDate(patient?.date)}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Genere:</span>{" "}
          {patient?.gender?.coding?.[0]?.display || "Genere non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Stato Civile:</span>{" "}
          {patient?.maritalStatus?.text || "Stato civile non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Indirizzo:</span>{" "}
          {patient?.address?.[0]?.text || "Indirizzo non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Contatto:</span>{" "}
          {patient?.telecom?.[0]?.value || "Contatto non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Lingua:</span>{" "}
          {patient?.communication?.[0]?.language?.coding?.[0]?.display ||
            "Lingua non disponibile"}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
