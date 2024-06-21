// src/components/MedicalRecordForm.js
import { useState, useEffect } from "react";

const MedicalRecordForm = ({ onSubmit, record }) => {
    const initialFormData = {
        RecordID: "",
        PatientID: "",
        Allergies: [],
        Conditions: [],
        Procedures: [],
        Prescriptions: [],
        ServiceRequest: { Reference: "", Display: "" },
        Attachments: [],
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (record) {
            setFormData({
                RecordID: record.RecordID || "",
                PatientID: record.PatientID || "",
                Allergies: record.Allergies || [],
                Conditions: record.Conditions || [],
                Procedures: record.Procedures || [],
                Prescriptions: record.Prescriptions || [],
                ServiceRequest: record.ServiceRequest || { Reference: "", Display: "" },
                Attachments: record.Attachments || [],
            });
        } else {
            setFormData(initialFormData);
        }
    }, [record, initialFormData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleNestedChange = (name, nestedValue) => {
        setFormData({
            ...formData,
            [name]: nestedValue,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialFormData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Record ID:
                <input
                    type="text"
                    name="RecordID"
                    value={formData.RecordID}
                    onChange={handleChange}
                />
            </label>
            <label>
                Patient ID:
                <input
                    type="text"
                    name="PatientID"
                    value={formData.PatientID}
                    onChange={handleChange}
                />
            </label>
            <NestedFormComponent
                data={formData.Allergies}
                name="Allergies"
                onChange={handleNestedChange}
            />
            <NestedFormComponent
                data={formData.Conditions}
                name="Conditions"
                onChange={handleNestedChange}
            />
            <NestedFormComponent
                data={formData.Procedures}
                name="Procedures"
                onChange={handleNestedChange}
            />
            <NestedFormComponent
                data={formData.Prescriptions}
                name="Prescriptions"
                onChange={handleNestedChange}
            />
            <NestedFormComponent
                data={formData.Attachments}
                name="Attachments"
                onChange={handleNestedChange}
            />
            <label>
                Service Request Reference:
                <input
                    type="text"
                    name="ServiceRequest.Reference"
                    value={formData.ServiceRequest.Reference}
                    onChange={handleChange}
                />
            </label>
            <label>
                Service Request Display:
                <input
                    type="text"
                    name="ServiceRequest.Display"
                    value={formData.ServiceRequest.Display}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

const NestedFormComponent = ({ data, name, onChange }) => {
    const [nestedData, setNestedData] = useState(data);

    useEffect(() => {
        setNestedData(data);
    }, [data]);

    const handleNestedChange = (e) => {
        const { value } = e.target;
        setNestedData(value);
        onChange(name, value);
    };

    return (
        <div>
            <label>
                {name}:
                <input type="text" value={nestedData} onChange={handleNestedChange} />
            </label>
        </div>
    );
};

export default MedicalRecordForm;
