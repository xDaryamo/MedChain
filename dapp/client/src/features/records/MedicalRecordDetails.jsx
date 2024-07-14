import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetMedicalRecord, useRemoveRecord } from "./useMedicalRecords";
import { useGetPatient } from "../users/usePatients";
import { useGetLabResultsByIds } from "../labresults/useLabResults";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import Button from "../../ui/Button";
import { FaTrash } from "react-icons/fa";
import { useEffect } from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const MedicalRecordDetails = () => {
  const { id } = useParams();
  const {
    record,
    isPending: recordLoading,
    error: recordError,
    refetch: refetchRecord,
  } = useGetMedicalRecord(id);

  const { removeRecord, isPending: deletePending } = useRemoveRecord();

  const {
    patient,
    isPending: patientLoading,
    error: patientError,
  } = useGetPatient(record?.patientID);
  const {
    labResults,
    isPending: labResultsLoading,
    refetch: refetchLabResults,
  } = useGetLabResultsByIds(record?.labResultsIDs || []);

  const navigate = useNavigate();

  useEffect(() => {
    refetchRecord();
    refetchLabResults();
  }, [record?.labResultsIDs]);

  if (recordLoading || patientLoading || labResultsLoading) return <Spinner />;
  if (recordError || patientError)
    return <p>Error loading medical record or patient data</p>;

  const handleDeleteRecord = () => {
    if (window.confirm("Sei sicuro di voler eliminare questo record?")) {
      removeRecord(id, {
        onSuccess: () => {
          navigate(-2);
        },
      });
    }
  };

  const renderList = (title, list, renderItem) => {
    if (!list || list.length === 0) {
      return (
        <div className="text-cyan-950">
          <span className="font-bold">{title}:</span> N/A
        </div>
      );
    }
    return (
      <div className="text-cyan-950">
        <h3 className="font-bold">{title}:</h3>
        {list.map((item, index) => (
          <div key={index} className="mb-2 ml-4 rounded border p-2">
            <h4 className="font-medium">{`${title} ${index + 1}`}</h4>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderAllergy = (allergy) => (
    <div>
      <div>
        <strong>ID:</strong> {allergy.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Stato Clinico:</strong>{" "}
        {allergy.clinicalStatus?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Stato di Verifica:</strong>{" "}
        {allergy.verificationStatus?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Tipo:</strong> {allergy.type || "N/A"}
      </div>
      <div>
        <strong>Categoria:</strong> {allergy.category?.join(", ") || "N/A"}
      </div>
      <div>
        <strong>Criticità:</strong> {allergy.criticality || "N/A"}
      </div>
      <div>
        <strong>Codice:</strong> {allergy.code?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Reazione:</strong>{" "}
        {allergy.reaction
          ?.map((r) =>
            r.manifestation.map((m) => m.coding[0].display).join(", "),
          )
          .join("; ") || "N/A"}
      </div>
    </div>
  );

  const renderCondition = (condition) => (
    <div>
      <div>
        <strong>ID:</strong> {condition.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Stato Clinico:</strong>{" "}
        {condition.clinicalStatus?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Stato di Verifica:</strong>{" "}
        {condition.verificationStatus?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Categoria:</strong>{" "}
        {condition.category?.map((c) => c.coding[0].display).join(", ") ||
          "N/A"}
      </div>
      <div>
        <strong>Severità:</strong>{" "}
        {condition.severity?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Codice:</strong>{" "}
        {condition.code?.map((c) => c.coding[0]?.display).join(", ") || "N/A"}
      </div>
      <div>
        <strong>Inizio:</strong> {formatDate(condition.onsetDateTime)}
      </div>
      <div>
        <strong>Fine:</strong> {formatDate(condition.abatementDateTime)}
      </div>
    </div>
  );

  const renderProcedure = (procedure) => (
    <div>
      <div>
        <strong>ID:</strong> {procedure.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Codice:</strong> {procedure.code?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Stato:</strong> {procedure.status?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Categoria:</strong>{" "}
        {procedure.category?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Note:</strong>{" "}
        {procedure.note?.map((n) => n.text).join(", ") || "N/A"}
      </div>
    </div>
  );

  const renderPrescription = (prescription) => (
    <div>
      <div>
        <strong>ID:</strong> {prescription.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Medicina:</strong>{" "}
        {prescription.medicationCodeableConcept?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Stato:</strong>{" "}
        {prescription.status?.coding[0]?.display || "N/A"}
      </div>
      <div>
        <strong>Istruzioni Dosaggio:</strong>{" "}
        {prescription.dosageInstruction?.map((d) => d.text).join(", ") || "N/A"}
      </div>
      <div>
        <strong>Quantità:</strong>{" "}
        {prescription.dispenseRequest?.quantity?.value || "N/A"}{" "}
        {prescription.dispenseRequest?.quantity?.unit || ""}
      </div>
      <div>
        <strong>Durata Fornitura:</strong>{" "}
        {prescription.dispenseRequest?.expectedSupplyDuration?.value || "N/A"}{" "}
        {prescription.dispenseRequest?.expectedSupplyDuration?.unit || ""}
      </div>
      <div>
        <strong>Periodo Validità:</strong>{" "}
        {formatDate(prescription.dispenseRequest?.validityPeriod?.start)} -{" "}
        {formatDate(prescription.dispenseRequest?.validityPeriod?.end)}
      </div>
    </div>
  );

  const renderLabResult = (labResult) => {
    if (!labResult || !labResult.labResult) {
      return (
        <div>
          <strong>Errore:</strong> Dettagli del risultato di laboratorio non
          disponibili.
        </div>
      );
    }
    const { identifier, status, category, code, effectivePeriod, issued } =
      labResult.labResult;
    return (
      <div>
        <div>
          <strong>ID:</strong> {identifier?.value || "N/A"}
        </div>
        <div>
          <strong>Stato:</strong> {status || "N/A"}
        </div>
        <div>
          <strong>Categoria:</strong>{" "}
          {category?.map((c) => c.coding[0]?.display).join(", ") || "N/A"}
        </div>
        <div>
          <strong>Codice:</strong> {code?.coding[0]?.display || "N/A"}
        </div>
        <div>
          <strong>Periodo Effettivo:</strong>{" "}
          {`${formatDate(effectivePeriod?.start)} - ${formatDate(
            effectivePeriod?.end,
          )}`}
        </div>
        <div>
          <strong>Emesso:</strong> {formatDate(issued)}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <Heading>Dettagli della Cartella Clinica</Heading>
      <section className="mt-4 space-y-6">
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-bold">Informazioni del Paziente</h2>
          <div className="text-cyan-950">
            <span className="font-bold">Nome:</span>{" "}
            {patient.name?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Data di Nascita:</span>{" "}
            {formatDate(patient.birthDate)}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Sesso:</span>{" "}
            {patient.gender?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Stato Civile:</span>{" "}
            {patient.maritalStatus?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Indirizzo:</span>{" "}
            {patient.address?.[0]?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Contatto:</span>{" "}
            {patient.telecom?.[0]?.value || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Lingua:</span>{" "}
            {patient.communication?.[0]?.language?.coding[0].display || "N/A"}
          </div>
        </div>
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-bold">
            Informazioni sulla Cartella
          </h2>
          <div className="text-cyan-950">
            <span className="font-bold">ID Cartella:</span>{" "}
            {record.identifier || "N/A"}
          </div>
          {renderList("Allergia", record.allergies, renderAllergy)}
          {renderList("Condizione", record.conditions, renderCondition)}
          {renderList("Procedura", record.procedures, renderProcedure)}
          {renderList("Prescrizione", record.prescriptions, renderPrescription)}
          {renderList("Risultato di Laboratorio", labResults, renderLabResult)}
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <Link
            to={`/records/update/${id}`}
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
              onClick={handleDeleteRecord}
              size="small"
            >
              {deletePending ? <Spinner /> : <FaTrash />}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MedicalRecordDetails;
