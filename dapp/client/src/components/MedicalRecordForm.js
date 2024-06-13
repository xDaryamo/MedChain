// src/components/MedicalRecordForm.js
import React, { useState, useEffect } from 'react';

const MedicalRecordForm = ({ onSubmit, record }) => {
    const [formData, setFormData] = useState(record || {});

    useEffect(() => {
        setFormData(record || {});
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* Fields */}
            <label>
                Field Name:
                <input
                    type="text"
                    name="fieldName"
                    value={formData.fieldName || ''}
                    onChange={handleChange}
                />
            </label>
            {/* Other fields */}
            <button type="submit">Save</button>
        </form>
    );
};

export default MedicalRecordForm;
