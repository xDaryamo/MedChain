import React from 'react';
import { Link } from 'react-router-dom';
import { useMedicalRecords } from '../hooks/useMedicalRecords';

const MedicalRecordList = () => {
    const { records, recordsLoading, recordsError } = useMedicalRecords();

    if (recordsLoading) return <p>Loading...</p>;
    if (recordsError) return <p>Error: {recordsError.message}</p>;

    return (
        <div>
            <h2>Record List</h2>
            <ul>
                {records.map(record => (
                    <li key={record.RecordID}>
                        <Link to={`/records/${record.RecordID}`}>{record.RecordID}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalRecordList;
