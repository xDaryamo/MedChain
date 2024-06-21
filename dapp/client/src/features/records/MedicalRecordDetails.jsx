// src/components/MedicalRecordDetails.js
import { useParams } from "react-router-dom";
import { useMedicalRecords } from "./useMedicalRecords";

const MedicalRecordDetails = () => {
    const { id } = useParams();
    const { useFetchRecord } = useMedicalRecords();
    const { data: record, isLoading, error } = useFetchRecord(id);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <h2>Record Details</h2>
            <p>Record ID: {record.RecordID}</p>
            <p>Patient ID: {record.PatientID}</p>
            <p>Allergies: {record.Allergies.join(', ')}</p>
            <p>Conditions: {record.Conditions.join(', ')}</p>
            <p>Procedures: {record.Procedures.join(', ')}</p>
            <p>Prescriptions: {record.Prescriptions.join(', ')}</p>
            <p>Service Request Reference: {record.ServiceRequest.Reference}</p>
            <p>Service Request Display: {record.ServiceRequest.Display}</p>
            <p>Attachments: {record.Attachments.join(', ')}</p>
        </div>
    );
};

export default MedicalRecordDetails;
