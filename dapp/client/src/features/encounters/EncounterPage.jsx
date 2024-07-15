import { useParams, useNavigate } from "react-router-dom";
import { useGetEncounter, useRemoveEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../authentication/useAuth";
import { FaTrash } from "react-icons/fa";

const priorityOptions = [
  { value: "A", label: "Il prima possibile" },
  { value: "CR", label: "Contattare appena pronti i risultati" },
  { value: "EL", label: "Elettivo" },
  { value: "EM", label: "Emergenza" },
  { value: "P", label: "Pre-operatorio" },
  { value: "PRN", label: "Se necessario" },
  { value: "R", label: "Routine" },
  { value: "RR", label: "Rapportare rapidamente" },
  { value: "S", label: "Stat (immediato)" },
  { value: "T", label: "Critico" },
  { value: "UD", label: "Usare come diretto" },
  { value: "UR", label: "Urgente" },
];

const classOptions = [
  { value: "IMP", label: "Ricovero" }, // Inpatient encounter
  { value: "AMB", label: "Ambulatoriale" }, // Ambulatory
  { value: "OBSENC", label: "Osservazione" }, // Observation encounter
  { value: "EMER", label: "Emergenza" }, // Emergency
  { value: "VR", label: "Virtuale" }, // Virtual
  { value: "HH", label: "Assistenza domiciliare" }, // Home health
];

const getPriorityLabel = (code) => {
  const option = priorityOptions.find((option) => option.value === code);
  return option ? option.label : "N/D";
};

const getClassLabel = (code) => {
  const option = classOptions.find((option) => option.value === code);
  return option ? option.label : "N/D";
};

const formatDate = (dateString) => {
  if (!dateString) return "N/D";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const EncounterPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const { isPending, encounter, error, refetch } = useGetEncounter(id);

  const { removeEncounter, isPending: deletePending } = useRemoveEncounter();

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const handleDeleteEncounter = () => {
    if (window.confirm("Sei sicuro di voler eliminare questo incontro?")) {
      removeEncounter(id, {
        onSuccess: () => {
          navigate(-2);
        },
      });
    }
  };

  const renderSingleOrList = (title, list, renderItem) => {
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
          <span className="font-bold">{title}:</span> {renderItem(list[0])}
        </div>
      );
    }
    return (
      <div className="text-cyan-950">
        <h3 className="font-bold">{title}:</h3>
        <ul className="ml-4 list-disc">
          {list.map((item, index) => (
            <li key={index} className="mb-1 ml-4">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderDiagnosis = (diag) => diag.description || "N/D";

  const isPractitioner = user.role === "practitioner";
  const isAuthor = encounter?.participant?.some(
    (p) => p.individual?.reference === user.userId,
  );
  const isPharmacyOrLab =
    user?.organization.toLowerCase().includes("pharmacy") ||
    user?.organization.toLowerCase().includes("farmacia") ||
    user?.organization.toLowerCase().includes("laboratory") ||
    user?.organization.toLowerCase().includes("laboratorio");

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <Heading>Dettagli della Visita</Heading>
      {isPending || !encounter ? (
        <Spinner />
      ) : error ? (
        <p>Errore durante il caricamento della Visita</p>
      ) : (
        <section className="mt-4 space-y-6">
          <div className="rounded bg-white p-4 shadow">
            <h2 className="mb-2 text-xl font-bold">
              Informazioni della Visita
            </h2>
            <div className="text-cyan-950">
              <strong>ID:</strong> {encounter.identifier?.value || "N/D"}
            </div>
            <div className="text-cyan-950">
              <strong>Stato:</strong>{" "}
              {encounter.status?.coding?.[0]?.code || "N/D"}
            </div>
            <div className="text-cyan-950">
              <strong>Classe:</strong>{" "}
              {getClassLabel(encounter.class?.code) || "N/D"}
            </div>
            {renderSingleOrList(
              "Tipo",
              encounter.type,
              (type) => type.coding?.[0]?.code || "N/D",
            )}
            <div className="text-cyan-950">
              <strong>Tipo di servizio:</strong>{" "}
              {encounter.serviceType?.coding?.[0]?.code || "N/D"}
            </div>
            <div className="text-cyan-950">
              <strong>Priorità:</strong>{" "}
              {getPriorityLabel(encounter.priority?.coding?.[0]?.code) || "N/D"}
            </div>
            <div className="text-cyan-950">
              <strong>Soggetto:</strong> {encounter.subject?.reference || "N/D"}
            </div>
            <div className="text-cyan-950">
              <strong>Periodo:</strong>{" "}
              {`${formatDate(encounter.period?.start)} - ${formatDate(encounter.period?.end)}`}
            </div>
            {renderSingleOrList(
              "Diagnosi",
              encounter.diagnosis,
              renderDiagnosis,
            )}
          </div>
          {isPractitioner && isAuthor && !isPharmacyOrLab && (
            <div className="mt-4 flex items-center space-x-4">
              <Link
                to={`/encounters/update/${id}`}
                className="flex w-full justify-center"
              >
                <Button variant="primary" size="large">
                  Modifica
                </Button>
              </Link>
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="delete"
                  onClick={() => handleDeleteEncounter()}
                  size="small"
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default EncounterPage;
