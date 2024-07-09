import { useNavigate, useParams } from "react-router-dom";
import { useGetMedicalRecord } from "./useMedicalRecords";
import { useGetPatient } from "../users/usePatients";
import { useSearchLabResults } from "../labresults/useLabResults";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const MedicalRecordDetails = () => {
  const { id } = useParams();
  const { record, isPending, error } = useGetMedicalRecord(id);
  const {
    patient,
    isPending: patientLoading,
    error: patientError,
  } = useGetPatient(record?.patientID);

  const { labResults = [] } = useSearchLabResults({
    query: {
      selector: {
        "subject.reference": `${record?.patientID}`,
      },
    },
  });

  const navigate = useNavigate();

  if (isPending || patientLoading) return <Spinner />;
  if (error || patientError)
    return <p>Error loading medical record or patient data</p>;

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
          <div key={index} className="mb-2 ml-4">
            <h4 className="font-medium">{`${title} ${index + 1}`}</h4>
            {renderItem(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderAllergy = (allergy) => (
    <div className="rounded border bg-gray-100 p-2">
      <div>
        <strong>ID:</strong> {allergy.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Clinical Status:</strong>{" "}
        {allergy.clinicalStatus?.text || "N/A"}
      </div>
      <div>
        <strong>Verification Status:</strong>{" "}
        {allergy.verificationStatus?.text || "N/A"}
      </div>
      <div>
        <strong>Type:</strong> {allergy.type || "N/A"}
      </div>
      <div>
        <strong>Category:</strong> {allergy.category?.join(", ") || "N/A"}
      </div>
      <div>
        <strong>Criticality:</strong> {allergy.criticality || "N/A"}
      </div>
    </div>
  );

  const renderCondition = (condition) => (
    <div className="rounded border bg-gray-100 p-2">
      <div>
        <strong>ID:</strong> {condition.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Clinical Status:</strong>{" "}
        {condition.clinicalStatus?.text || "N/A"}
      </div>
      <div>
        <strong>Verification Status:</strong>{" "}
        {condition.verificationStatus?.text || "N/A"}
      </div>
      <div>
        <strong>Category:</strong>{" "}
        {condition.category?.map((c) => c.text).join(", ") || "N/A"}
      </div>
      <div>
        <strong>Severity:</strong> {condition.severity?.text || "N/A"}
      </div>
      <div>
        <strong>Code:</strong>{" "}
        {condition.code?.map((c) => c.text).join(", ") || "N/A"}
      </div>
    </div>
  );

  const renderProcedure = (procedure) => (
    <div className="rounded border bg-gray-100 p-2">
      <div>
        <strong>ID:</strong> {procedure.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Code:</strong> {procedure.code?.text || "N/A"}
      </div>
      <div>
        <strong>Status:</strong> {procedure.status?.text || "N/A"}
      </div>
      <div>
        <strong>Category:</strong> {procedure.category?.text || "N/A"}
      </div>
    </div>
  );

  const renderPrescription = (prescription) => (
    <div className="rounded border bg-gray-100 p-2">
      <div>
        <strong>ID:</strong> {prescription.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Medication:</strong>{" "}
        {prescription.medicationCodeableConcept?.text || "N/A"}
      </div>
      <div>
        <strong>Status:</strong> {prescription.status || "N/A"}
      </div>
    </div>
  );

  const renderLabResult = (labResult) => (
    <div className="rounded border bg-gray-100 p-2">
      <div>
        <strong>ID:</strong> {labResult.identifier?.value || "N/A"}
      </div>
      <div>
        <strong>Status:</strong> {labResult.status || "N/A"}
      </div>
      <div>
        <strong>Category:</strong>{" "}
        {labResult.category?.map((c) => c.text).join(", ") || "N/A"}
      </div>
      <div>
        <strong>Code:</strong> {labResult.code?.text || "N/A"}
      </div>
      <div>
        <strong>Effective Period:</strong>{" "}
        {formatDate(labResult.effectivePeriod?.start)} -{" "}
        {formatDate(labResult.effectivePeriod?.end)}
      </div>
      <div>
        <strong>Issued:</strong> {formatDate(labResult.issued)}
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="">
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <Heading>Medical Record Details</Heading>
      <div className="mt-4 space-y-6">
        <section className="mb-4">
          <h2 className="text-xl font-bold">Patient Information</h2>
          <div className="text-cyan-950">
            <span className="font-bold">Name:</span>{" "}
            {patient.name?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Date of Birth:</span>{" "}
            {formatDate(patient.birthDate)}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Gender:</span>{" "}
            {patient.gender?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Marital Status:</span>{" "}
            {patient.maritalStatus?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Address:</span>{" "}
            {patient.address?.[0]?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Contact:</span>{" "}
            {patient.telecom?.[0]?.value || "N/A"}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Language:</span>{" "}
            {patient.communication?.[0]?.language?.text || "N/A"}
          </div>
        </section>
        <section className="mb-4">
          <h2 className="text-xl font-bold">Record Information</h2>
          <div className="text-cyan-950">
            <span className="font-bold">Record ID:</span>{" "}
            {record.identifier || "N/A"}
          </div>
          {renderList("Allergy", record.allergies, renderAllergy)}
          {renderList("Condition", record.conditions, renderCondition)}
          {renderList("Procedure", record.procedures, renderProcedure)}
          {renderList("Prescription", record.prescriptions, renderPrescription)}
          {renderList("Lab Result", labResults, renderLabResult)}
          <div className="text-cyan-950">
            <span className="font-bold">Service Request:</span>{" "}
            {record.serviceRequest?.display || "N/A"}
          </div>
          {renderList("Attachment", record.attachments, (item) => item)}
        </section>
      </div>
    </div>
  );
};

export default MedicalRecordDetails;
