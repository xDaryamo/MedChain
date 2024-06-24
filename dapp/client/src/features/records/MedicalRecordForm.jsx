import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormInput from '../../ui/FormInput';
import FormRow from '../../ui/FormRow';
import Button from '../../ui/Button';
import AllergyForm from './AllergyForm';
import ConditionForm from './ConditionForm';
import ProcedureForm from './ProcedureForm';
import MedicationRequestForm from './MedicationRequestForm';

const initialFormData = {
    PatientID: '',
    Allergies: [],
    Conditions: [],
    Procedures: [],
    Prescriptions: [],
    ServiceRequest: { Reference: '', Display: '' },
    Attachments: [],
};

const defaultAttachment = {
    System: '',
    URL: '',
};

const defaultValues = {
    Code: { Coding: [] },
    Coding: { System: '', Code: '', Display: '' },
    CodeableConcept: { Coding: [], Text: '' },
    Reference: { Reference: '', Display: '' },
    AllergyIntolerance: {
        ClinicalStatus: { Coding: [], Text: '' },
        VerificationStatus: { Coding: [], Text: '' },
        Type: '',
        Category: [],
        Criticality: '',
        Patient: { Reference: '', Display: '' },
        Code: { Coding: [], Text: '' },
        Reaction: []
    },
    ReactionComponent: {
        Substance: { Coding: [], Text: '' },
        Manifestation: [],
        Severity: '',
        ExposureRoute: { Coding: [], Text: '' },
        Note: []
    },
    Annotation: { AuthorReference: { Reference: '', Display: '' }, AuthorString: '', Time: '', Text: '' },
    Condition: {
        ClinicalStatus: { Coding: [], Text: '' },
        VerificationStatus: { Coding: [], Text: '' },
        Category: [],
        Severity: { Coding: [], Text: '' },
        Code: [],
        Subject: { Reference: '', Display: '' },
        OnsetDateTime: '',
        AbatementDateTime: '',
        RecordedDate: '',
        Recorder: { Reference: '', Display: '' },
        Asserter: { Reference: '', Display: '' },
        Evidence: []
    },
    ConditionEvidence: { Code: { Coding: [], Text: '' }, Detail: [] },
    MedicationRequest: {
        Status: { Coding: [] },
        Intent: { Coding: [] },
        MedicationCodeableConcept: { Coding: [], Text: '' },
        Subject: { Reference: '', Display: '' },
        Encounter: { Reference: '', Display: '' },
        AuthoredOn: '',
        Requester: { Reference: '', Display: '' },
        DosageInstruction: [],
        DispenseRequest: {
            ValidityPeriod: { Start: '', End: '' },
            NumberOfRepeatsAllowed: 0,
            Quantity: { Value: 0, Unit: '', System: '' },
            ExpectedSupplyDuration: { Value: 0, Unit: '', System: '' },
            Performer: { Reference: '', Display: '' }
        }
    },
    Duration: { Value: 0, Unit: '', System: '' },
    Quantity: { Value: 0, Unit: '', System: '' },
    Period: { Start: '', End: '' },
    Attachment: { System: '', URL: '' }
};

const MedicalRecordForm = ({ onSubmit, record }) => {
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (record) {
            setFormData(record);
        } else {
            setFormData(initialFormData);
        }
    }, [record]);

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

    const handleAttachmentChange = (index, field, value) => {
        const updatedAttachments = [...formData.Attachments];
        updatedAttachments[index] = {
            ...updatedAttachments[index],
            [field]: value,
        };
        setFormData({
            ...formData,
            Attachments: updatedAttachments,
        });
    };

    const handleAddAttachment = () => {
        setFormData({
            ...formData,
            Attachments: [...formData.Attachments, { ...defaultAttachment }],
        });
    };

    const handleRemoveAttachment = (index) => {
        const updatedAttachments = [...formData.Attachments];
        updatedAttachments.splice(index, 1);
        setFormData({
            ...formData,
            Attachments: updatedAttachments,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialFormData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormRow label="Patient ID">
                <FormInput
                    type="text"
                    name="PatientID"
                    value={formData.PatientID}
                    onChange={handleChange}
                    required
                />
            </FormRow>

            <FormRow label="Service Request Reference">
                <FormInput
                    type="text"
                    name="ServiceRequest.Reference"
                    value={formData.ServiceRequest.Reference}
                    onChange={handleChange}
                />
            </FormRow>
            <FormRow label="Service Request Display">
                <FormInput
                    type="text"
                    name="ServiceRequest.Display"
                    value={formData.ServiceRequest.Display}
                    onChange={handleChange}
                />
            </FormRow>

            {formData.Attachments.map((attachment, index) => (
                <div key={index}>
                    <FormRow label={`Attachment URL ${index + 1}`}>
                        <FormInput
                            type="text"
                            name={`Attachments[${index}].URL`}
                            value={attachment.URL}
                            onChange={(e) => handleAttachmentChange(index, 'URL', e.target.value)}
                        />
                    </FormRow>
                    <Button type="button" onClick={() => handleRemoveAttachment(index)}>
                        Remove Attachment
                    </Button>
                </div>
            ))}

            <Button type="button" onClick={handleAddAttachment}>
                Add Attachment
            </Button>

            <AllergyForm
                allergies={formData.Allergies}
                onChange={(allergies) => handleNestedChange('Allergies', allergies)}
                defaultValues={defaultValues.AllergyIntolerance}
            />
            <ConditionForm
                conditions={formData.Conditions}
                onChange={(conditions) => handleNestedChange('Conditions', conditions)}
                defaultValues={defaultValues.Condition}
            />
            <ProcedureForm
                procedures={formData.Procedures}
                onChange={(procedures) => handleNestedChange('Procedures', procedures)}
                defaultValues={defaultValues.Procedure}
            />
            <MedicationRequestForm
                medicationRequests={formData.Prescriptions}
                onChange={(medRequests) => handleNestedChange('Prescriptions', medRequests)}
                defaultValues={defaultValues.MedicationRequest}
            />

            <Button type="submit">Submit</Button>
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
        Attachments: PropTypes.arrayOf(PropTypes.shape({
            System: PropTypes.string,
            URL: PropTypes.string,
        })),
    }),
};

export default MedicalRecordForm;
