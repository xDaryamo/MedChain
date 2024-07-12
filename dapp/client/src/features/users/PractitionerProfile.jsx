/* eslint-disable react/prop-types */
// pages/PractitionerProfile.jsx
import Heading from "../../ui/Heading";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return isNaN(date)
    ? "Data non valida"
    : date.toLocaleDateString(undefined, options);
};

const qualificationLabels = {
  PN: "Advanced Practice Nurse",
  AAS: "Associate of Applied Science",
  AA: "Associate of Arts",
  ABA: "Associate of Business Administration",
  AE: "Associate of Engineering",
  AS: "Associate of Science",
  BA: "Bachelor of Arts",
  BBA: "Bachelor of Business Administration",
  BE: "Bachelor of Engineering",
  BFA: "Bachelor of Fine Arts",
  BN: "Bachelor of Nursing",
  BS: "Bachelor of Science",
  BSL: "Bachelor of Science - Law",
  BSN: "Bachelor of Science - Nursing",
  BT: "Bachelor of Theology",
  CER: "Certificate",
  CANP: "Certified Adult Nurse Practitioner",
  CMA: "Certified Medical Assistant",
  CNP: "Certified Nurse Practitioner",
  CNM: "Certified Nurse Midwife",
  CRN: "Certified Registered Nurse",
  CNS: "Certified Nurse Specialist",
  CPNP: "Certified Pediatric Nurse Practitioner",
  CTR: "Certified Tumor Registrar",
  DIP: "Diploma",
  DBA: "Doctor of Business Administration",
  DED: "Doctor of Education",
  PharmD: "Doctor of Pharmacy",
  PHE: "Doctor of Engineering",
  PHD: "Doctor of Philosophy",
  PHS: "Doctor of Science",
  MD: "Doctor of Medicine",
  DO: "Doctor of Osteopathy",
  EMT: "Emergency Medical Technician",
  EMTP: "Emergency Medical Technician - Paramedic",
  FPNP: "Family Practice Nurse Practitioner",
  HS: "High School Graduate",
  JD: "Juris Doctor",
  MA: "Master of Arts",
  MBA: "Master of Business Administration",
  MCE: "Master of Civil Engineering",
  MDI: "Master of Divinity",
  MED: "Master of Education",
  MEE: "Master of Electrical Engineering",
  ME: "Master of Engineering",
  MFA: "Master of Fine Arts",
  MME: "Master of Mechanical Engineering",
  MS: "Master of Science",
  MSL: "Master of Science - Law",
  MSN: "Master of Science - Nursing",
  MTH: "Master of Theology",
  MDA: "Medical Assistant",
  MT: "Medical Technician",
  NG: "Non-Graduate",
  NP: "Nurse Practitioner",
  PA: "Physician Assistant",
  RMA: "Registered Medical Assistant",
  RN: "Registered Nurse",
  RPH: "Registered Pharmacist",
  SEC: "Secretarial Certificate",
  TS: "Trade School Graduate",
};
const PractitionerProfile = ({ practitioner }) => {
  return (
    <div>
      <Heading>Dettagli Medico</Heading>
      <div className="mt-4 space-y-2">
        <div className="text-cyan-950">
          <span className="font-bold">Nome:</span>{" "}
          {practitioner?.name?.[0]?.text || "Nome non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Data di Nascita:</span>{" "}
          {formatDate(practitioner?.date)}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Genere:</span>{" "}
          {practitioner?.gender?.coding?.[0]?.display ||
            "Genere non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Indirizzo:</span>{" "}
          {practitioner?.address?.text || "Indirizzo non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Contatto:</span>{" "}
          {practitioner?.telecom?.value || "Contatto non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Lingue:</span>{" "}
          {practitioner?.communication?.[0]?.language?.coding?.[0]?.display ||
            "Lingue non disponibile"}
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Qualifiche:</span>{" "}
          <span>
            {practitioner?.qualification?.map((qual, index) => (
              <span key={index}>
                {qualificationLabels[qual.code?.coding?.[0]?.code] ||
                  qual.code?.text ||
                  "Qualifica non disponibile"}
                {index < practitioner.qualification.length - 1 && ", "}
              </span>
            ))}
          </span>
        </div>
        <div className="text-cyan-950">
          <span className="font-bold">Organizzazione:</span>{" "}
          {practitioner?.qualification?.[0]?.issuer?.display ||
            "Organizzazione non disponibile"}
        </div>
      </div>
    </div>
  );
};

export default PractitionerProfile;
