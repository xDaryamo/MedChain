import React from "react";
import MedicalRecordList from "../components/MedicalRecordList";
import MedicalRecordForm from "../components/MedicalRecordForm";
import { useMedicalRecords } from "../hooks/useMedicalRecords";

const RecordHome = () => {
    const { records, addRecord, loading, error } = useMedicalRecords();

    return (
        <div>
            <h1>Medical Records</h1>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            <MedicalRecordForm onSubmit={addRecord} />
            <MedicalRecordList records={records} />
        </div>
    );
};

export default RecordHome;
