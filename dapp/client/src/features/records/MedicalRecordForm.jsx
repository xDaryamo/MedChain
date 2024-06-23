import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import FormInput from "../../ui/FormInput";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import NavigationButtons from "../../ui/NavigationButtons";

const initialFormData = {
    PatientID: "",
    Allergies: [],
    Conditions: [],
    Procedures: [],
    Prescriptions: [],
    Attachments: [],
    ServiceRequest: { Reference: "", Display: "" },
};

const defaultValues = {
    ServiceRequest: { Reference: "defaultReference", Display: "defaultDisplay" },
    Coding: { System: "defaultSystem", Display: "defaultDisplay" },
    Annotation: { Time: new Date().toISOString() },
    ConditionEvidence: { Detail: [] },
    Duration: { System: "defaultSystem" },
    Quantity: { System: "defaultSystem" },
};

const MedicalRecordForm = ({ onSubmit, record }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    useEffect(() => {
        if (record) {
            setFormData({
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
    }, [record]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const [nestedName, key] = name.split('.');

        if (key) {
            setFormData((prevData) => ({
                ...prevData,
                [nestedName]: {
                    ...prevData[nestedName],
                    [key]: value,
                },
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleNestedChange = (name, nestedValue) => {
        setFormData({
            ...formData,
            [name]: nestedValue,
        });
    };

    const handleNextStep = () => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, totalSteps));
    };

    const handlePreviousStep = () => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < totalSteps) {
            handleNextStep();
        } else {
            const applyDefaultValues = (obj, defaults) => {
                const result = { ...obj };
                for (const key in defaults) {
                    if (typeof defaults[key] === "object" && defaults[key] !== null) {
                        result[key] = applyDefaultValues(obj[key] || {}, defaults[key]);
                    } else {
                        result[key] = obj[key] || defaults[key];
                    }
                }
                return result;
            };

            const updatedFormData = {
                ...formData,
                ServiceRequest: applyDefaultValues(formData.ServiceRequest, defaultValues.ServiceRequest),
                Allergies: formData.Allergies.map(allergy => ({
                    ...allergy,
                    ClinicalStatus: applyDefaultValues(allergy.ClinicalStatus || {}, defaultValues.Coding),
                    VerificationStatus: applyDefaultValues(allergy.VerificationStatus || {}, defaultValues.Coding),
                    Reaction: allergy.Reaction.map(reaction => ({
                        ...reaction,
                        Note: reaction.Note.length > 0 ? reaction.Note : [defaultValues.Annotation],
                    })),
                })),
                Conditions: formData.Conditions.map(condition => ({
                    ...condition,
                    ClinicalStatus: applyDefaultValues(condition.ClinicalStatus || {}, defaultValues.Coding),
                    VerificationStatus: applyDefaultValues(condition.VerificationStatus || {}, defaultValues.Coding),
                    Evidence: condition.Evidence.map(evidence => ({
                        ...evidence,
                        Detail: evidence.Detail.length > 0 ? evidence.Detail : defaultValues.ConditionEvidence.Detail,
                    })),
                })),
                Prescriptions: formData.Prescriptions.map(prescription => ({
                    ...prescription,
                    AuthoredOn: prescription.AuthoredOn || new Date().toISOString(),
                    DispenseRequest: applyDefaultValues(prescription.DispenseRequest || {}, {
                        ValidityPeriod: {},
                        NumberOfRepeatsAllowed: 0,
                        Quantity: defaultValues.Quantity,
                        ExpectedSupplyDuration: defaultValues.Duration,
                        Performer: {},
                    }),
                })),
                Attachments: formData.Attachments.map(attachment => ({
                    ...attachment,
                    System: attachment.System || defaultValues.Quantity.System,
                })),
            };

            onSubmit(updatedFormData);
            setFormData(initialFormData);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <FormRow label="Patient ID">
                            <FormInput
                                type="text"
                                name="PatientID"
                                value={formData.PatientID}
                                onChange={handleChange}
                                required
                            />
                        </FormRow>
                        <NestedFormComponent
                            data={formData.Allergies}
                            name="Allergies"
                            onChange={handleNestedChange}
                        />
                    </div>
                );
            case 2:
                return (
                    <div>
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
                    </div>
                );
            case 3:
                return (
                    <div>
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
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {renderStepContent(currentStep)}
            <NavigationButtons
                step={currentStep}
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                isFinalStep={currentStep === totalSteps}
            />
            {currentStep === totalSteps && <Button type="submit">Submit</Button>}
        </form>
    );
};

MedicalRecordForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    record: PropTypes.shape({
        PatientID: PropTypes.string,
        Allergies: PropTypes.array,
        Conditions: PropTypes.array,
        Procedures: PropTypes.array,
        Prescriptions: PropTypes.array,
        ServiceRequest: PropTypes.shape({
            Reference: PropTypes.string,
            Display: PropTypes.string,
        }),
        Attachments: PropTypes.array,
    }),
};

const NestedFormComponent = ({ data, name, onChange }) => {
    const [nestedData, setNestedData] = useState(data);

    useEffect(() => {
        setNestedData(data);
    }, [data]);

    const handleNestedChange = (index, field, value) => {
        const updatedNestedData = nestedData.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setNestedData(updatedNestedData);
        onChange(name, updatedNestedData);
    };

    return (
        <div>
            <label>{name}:</label>
            {nestedData.map((item, index) => (
                <div key={index}>
                    {Object.keys(item).map((field) => (
                        <FormRow key={field} label={field}>
                            <FormInput
                                type="text"
                                value={item[field]}
                                onChange={(e) => handleNestedChange(index, field, e.target.value)}
                            />
                        </FormRow>
                    ))}
                </div>
            ))}
            <button type="button" onClick={() => setNestedData([...nestedData, {}])}>Add {name.slice(0, -1)}</button>
        </div>
    );
};

NestedFormComponent.propTypes = {
    data: PropTypes.array.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default MedicalRecordForm;
