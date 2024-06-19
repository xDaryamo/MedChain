// src/pages/RecordPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import MedicalRecordDetails from '../components/MedicalRecordDetails';
import MedicalRecordForm from '../components/MedicalRecordForm';
import { useMedicalRecords } from '../hooks/useMedicalRecords';

const RecordPage = () => {
    const { id } = useParams();
    const { useFetchRecord, modifyRecordMutation } = useMedicalRecords();
    const { data: record, isLoading, error } = useFetchRecord(id);

    const handleModifyRecord = async (data) => {
        await modifyRecordMutation.mutateAsync({ id, record: data });
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            <MedicalRecordDetails record={record} />
            <MedicalRecordForm onSubmit={handleModifyRecord} record={record} />
        </div>
    );
};

export default RecordPage;
