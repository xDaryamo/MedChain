import { useParams, useNavigate } from "react-router-dom";
import { useGetPrescription, useRemovePrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useUser } from "../authentication/useAuth";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { useEffect } from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/D";
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  const date = new Date(dateString);
  return date.toLocaleDateString("it-IT", options);
};

const statusMap = {
  active: "Attivo",
  "on-hold": "Sospeso",
  ended: "Terminato",
  stopped: "Interrotto",
  completed: "Completato",
  cancelled: "Annullato",
  "entered-in-error": "Inserito per errore",
  draft: "Bozza",
  unknown: "Sconosciuto",
};

const intentMap = {
  proposal: "Proposta",
  plan: "Piano",
  order: "Ordine",
  "original-order": "Ordine originale",
  "reflex-order": "Ordine riflesso",
  "filler-order": "Ordine di riempimento",
  "instance-order": "Ordine di istanza",
  option: "Opzione",
};

const quantityUnitMap = {
  tablets: "Compresse",
  capsules: "Capsule",
  ml: "Millilitri",
};

const durationUnitMap = {
  days: "Giorni",
  weeks: "Settimane",
  months: "Mesi",
  hours: "Ore",
};

const MedicationRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, organization } = useUser();

  const { removePrescription, deletePending } = useRemovePrescription();
  const { isPending, prescription, refetch } = useGetPrescription(id);

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const handleDeleteMedicationRequest = () => {
    if (window.confirm("Sei sicuro di voler eliminare questa prescrizione?")) {
      removePrescription(id, {
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

  const renderPrescription = (prescription) => {
    return (
      <div>
        <div className="text-cyan-950">
          <strong>ID:</strong> {prescription.identifier?.value || "N/D"}
        </div>
        <div className="text-cyan-950">
          <strong>Stato:</strong>{" "}
          {statusMap[prescription.status?.coding[0].code] ||
            "Stato sconosciuto"}
        </div>
        <div className="text-cyan-950">
          <strong>Intento:</strong>{" "}
          {intentMap[prescription.intent?.coding[0].code] ||
            "Intento sconosciuto"}
        </div>
        <div className="text-cyan-950">
          <strong>Farmaco:</strong>{" "}
          {prescription.medicationCodeableConcept?.text ||
            "Farmaco sconosciuto"}
        </div>
        <div className="text-cyan-950">
          <strong>Paziente:</strong>{" "}
          {prescription.subject?.display || "Paziente sconosciuto"}
        </div>
        <div className="text-cyan-950">
          <strong>Data di Autorizzazione:</strong>{" "}
          {formatDate(prescription.authoredOn)}
        </div>
        <div className="text-cyan-950">
          <strong>Richiedente:</strong>{" "}
          {prescription.requester?.display || "Richiedente sconosciuto"}
        </div>
        {renderSingleOrList(
          "Istruzioni di Dosaggio",
          prescription.dosageInstruction,
          (instruction) => (
            <div>
              <strong>Testo:</strong> {instruction.text || "N/D"}
              <br />
              <strong>Via:</strong> {instruction.route?.text || "N/D"}
            </div>
          ),
        )}
        {prescription.dispenseRequest && (
          <div className="text-cyan-950">
            <strong>Richiesta di Dispensa:</strong>
            <div>
              <strong>Quantità:</strong>{" "}
              {prescription.dispenseRequest.quantity.value}{" "}
              {quantityUnitMap[prescription.dispenseRequest.quantity.unit]}
            </div>
            <div>
              <strong>Durata di Fornitura Prevista:</strong>{" "}
              {prescription.dispenseRequest.expectedSupplyDuration.value}{" "}
              {
                durationUnitMap[
                  prescription.dispenseRequest.expectedSupplyDuration.unit
                ]
              }
            </div>
            <div>
              <strong>Inizio Validità:</strong>{" "}
              {formatDate(prescription.dispenseRequest.validityPeriod?.start)}
            </div>
            <div>
              <strong>Fine Validità:</strong>{" "}
              {formatDate(prescription.dispenseRequest.validityPeriod?.end)}
            </div>
          </div>
        )}
      </div>
    );
  };

  const isPharmacyOrLab =
    organization?.toLowerCase().includes("pharmacy") ||
    organization?.toLowerCase().includes("farmacia") ||
    organization?.toLowerCase().includes("laboratorio") ||
    organization?.toLowerCase().includes("laboratory");

  const isPractitioner = user.role === "practitioner";
  const isRequester = prescription?.requester?.reference === user.userId;

  const showButtons = isPractitioner && isRequester && !isPharmacyOrLab;

  if (isPending || prescription === undefined || deletePending) {
    return <Spinner />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <Heading>Dettagli Prescrizione</Heading>
      <section className="mt-4 space-y-6">
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-bold">Informazioni Prescrizione</h2>
          {renderPrescription(prescription)}
        </div>
        {showButtons && (
          <div className="mt-4 flex items-center space-x-4">
            <Link
              to={`/prescriptions/update/${id}`}
              className="flex w-full justify-center"
            >
              <Button variant="primary" size="large">
                Modifica
              </Button>
            </Link>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => handleDeleteMedicationRequest()}
                size="small"
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default MedicationRequestPage;
