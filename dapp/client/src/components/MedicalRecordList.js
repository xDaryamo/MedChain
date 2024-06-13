// src/components/MedicalRecordList.js
import React from 'react';
import { Link } from 'react-router-dom';

const MedicalRecordList = ({ records }) => {
    return (
        <div>
            <h2>Records List</h2>
            <ul>
                {records.map(record => (
                    <li key={record.id}>
                        <Link to={`/records/${record.id}`}>{record.patientid}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MedicalRecordList;
