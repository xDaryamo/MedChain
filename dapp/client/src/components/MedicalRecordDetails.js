// src/components/MedicalRecordDetails.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useMedicalRecords } from "../hooks/useMedicalRecords";

const MedicalRecordDetails = () => {
    const { fetchRecord, record, loading, error } = useMedicalRecords();
    const { id } = useParams();

    useEffect(() => {
        fetchRecord(id);
    }, [id, fetchRecord]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Medical Record Details</h1>
            {record ? <pre>{JSON.stringify(record)}</pre> : <p>No record found</p>}
        </div>
    );
};

export default MedicalRecordDetails;
