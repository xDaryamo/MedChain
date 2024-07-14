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
  PN: "Infermiera di Pratica Avanzata",
  AAS: "Associato in Scienze Applicate",
  AA: "Associato in Arti",
  ABA: "Associato in Amministrazione Aziendale",
  AE: "Associato in Ingegneria",
  AS: "Associato in Scienze",
  BA: "Laurea in Lettere",
  BBA: "Laurea in Amministrazione Aziendale",
  BE: "Laurea in Ingegneria",
  BFA: "Laurea in Belle Arti",
  BN: "Laurea in Infermieristica",
  BS: "Laurea in Scienze",
  BSL: "Laurea in Scienze Giuridiche",
  BSN: "Laurea in Scienze Infermieristiche",
  BT: "Laurea in Teologia",
  CER: "Certificato",
  CANP: "Infermiera Adulta Certificata",
  CMA: "Assistente Medico Certificato",
  CNP: "Infermiere Professionista Certificato",
  CNM: "Ostetrica Certificata",
  CRN: "Infermiere Registrato Certificato",
  CNS: "Specialista Infermieristico Certificato",
  CPNP: "Infermiere Pediatrico Certificato",
  CTR: "Registro Tumori Certificato",
  DIP: "Diploma",
  DBA: "Dottorato in Amministrazione Aziendale",
  DED: "Dottorato in Educazione",
  PharmD: "Dottorato in Farmacia",
  PHE: "Dottorato in Ingegneria",
  PHD: "Dottorato di Ricerca",
  PHS: "Dottorato in Scienze",
  MD: "Dottore in Medicina",
  DO: "Dottore in Osteopatia",
  EMT: "Tecnico Medico di Emergenza",
  EMTP: "Paramedico",
  FPNP: "Infermiere di Famiglia Certificato",
  HS: "Diploma di Scuola Superiore",
  JD: "Dottore in Giurisprudenza",
  MA: "Laurea Magistrale in Lettere",
  MBA: "Master in Amministrazione Aziendale",
  MCE: "Master in Ingegneria Civile",
  MDI: "Master in Divinità",
  MED: "Master in Educazione",
  MEE: "Master in Ingegneria Elettrica",
  ME: "Master in Ingegneria",
  MFA: "Master in Belle Arti",
  MME: "Master in Ingegneria Meccanica",
  MS: "Master in Scienze",
  MSL: "Master in Scienze Giuridiche",
  MSN: "Master in Scienze Infermieristiche",
  MTH: "Master in Teologia",
  MDA: "Assistente Medico",
  MT: "Tecnico Medico",
  NG: "Non Laureato",
  NP: "Infermiere Professionista",
  PA: "Assistente Medico",
  RMA: "Assistente Medico Registrato",
  RN: "Infermiere Registrato",
  RPH: "Farmacista Registrato",
  SEC: "Certificato di Segreteria",
  TS: "Diploma di Scuola Professionale",
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
