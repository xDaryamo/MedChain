import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import MedicalRecordDetails from "../components/MedicalRecordDetail";
import MedicalRecordForm from "../components/MedicalRecordForm";
import { useMedicalRecords } from "../hooks/useMedicalRecords";

const RecordPage = () => {
    const { id } = useParams();
    const { record, modifyRecord, fetchRecord, loading, error } = useMedicalRecords();

    useEffect(() => {
        fetchRecord(id);
    }, [id, fetchRecord]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <MedicalRecordDetails record={record} />
            <MedicalRecordForm onSubmit={(data) => modifyRecord(id, data)} record={record} />
        </div>
    );
};

export default RecordPage;
