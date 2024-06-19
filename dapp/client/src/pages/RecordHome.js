// src/pages/RecordHome.js
import React from 'react';
import MedicalRecordList from '../components/MedicalRecordList';
import MedicalRecordForm from '../components/MedicalRecordForm';
import { useMedicalRecords } from '../hooks/useMedicalRecords';

const RecordHome = () => {
    const {
        records,
        recordsLoading,
        recordsError,
        addRecordMutation,
    } = useMedicalRecords();

    const handleAddRecord = async (record) => {
        await addRecordMutation.mutateAsync(record);
    };

    return (
        <div>
            <h1>Medical Records</h1>
            {recordsLoading && <p>Loading...</p>}
            {recordsError && <p>Error: {recordsError.message}</p>}
            <MedicalRecordForm onSubmit={handleAddRecord} />
            <MedicalRecordList records={records || []} />
        </div>
    );
};

export default RecordHome;
