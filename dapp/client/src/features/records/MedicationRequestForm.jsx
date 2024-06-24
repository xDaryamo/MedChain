import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormInput from '../../ui/FormInput';

const MedicationRequestForm = ({ medicationRequests, onChange, defaultValues }) => {
    const [medicationRequestsData, setMedicationRequestsData] = useState(medicationRequests);

    const handleAddMedicationRequest = () => {
        setMedicationRequestsData([...medicationRequestsData, { ...defaultValues }]);
    };

    const handleMedicationRequestChange = (index, field, value) => {
        const updatedMedicationRequests = medicationRequestsData.map((medRequest, i) =>
            i === index ? { ...medRequest, [field]: value } : medRequest
        );
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    const handleRemoveMedicationRequest = (index) => {
        const updatedMedicationRequests = medicationRequestsData.filter((medRequest, i) => i !== index);
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    const handleAddDosageInstruction = (index) => {
        const updatedMedicationRequests = [...medicationRequestsData];
        updatedMedicationRequests[index].DosageInstruction.push({
            Text: '',
            Timing: { Repeat: {} },
            Route: { Coding: [], Text: '' },
            DoseQuantity: { Value: 0, Unit: '', System: '' }
            // Add more fields as needed
        });
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    const handleRemoveDosageInstruction = (medIndex, dosageIndex) => {
        const updatedMedicationRequests = [...medicationRequestsData];
        updatedMedicationRequests[medIndex].DosageInstruction.splice(dosageIndex, 1);
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    const handleAddDispenseRequest = (index) => {
        const updatedMedicationRequests = [...medicationRequestsData];
        updatedMedicationRequests[index].DispenseRequest = {
            ValidityPeriod: { Start: '', End: '' }, // Example fields for ValidityPeriod
            NumberOfRepeatsAllowed: 0,
            Quantity: { Value: 0, Unit: '', System: '' },
            ExpectedSupplyDuration: { Duration: 0, Unit: '' }, // Example fields for ExpectedSupplyDuration
            Performer: { Reference: '' }
            // Add more fields as needed
        };
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    const handleRemoveDispenseRequest = (index) => {
        const updatedMedicationRequests = [...medicationRequestsData];
        delete updatedMedicationRequests[index].DispenseRequest;
        setMedicationRequestsData(updatedMedicationRequests);
        onChange(updatedMedicationRequests);
    };

    return (
        <div>
            <h2>Medication Requests:</h2>
            {medicationRequestsData.map((medRequest, index) => (
                <div key={index}>
                    <FormRow label="Status:">
                        <FormInput
                            type="text"
                            value={medRequest.Status.Coding.map(coding => coding.Code).join(', ')}
                            onChange={(e) => handleMedicationRequestChange(index, 'Status', { Coding: [{ Code: e.target.value }] })}
                        />
                    </FormRow>
                    <FormRow label="Intent:">
                        <FormInput
                            type="text"
                            value={medRequest.Intent.Coding.map(coding => coding.Code).join(', ')}
                            onChange={(e) => handleMedicationRequestChange(index, 'Intent', { Coding: [{ Code: e.target.value }] })}
                        />
                    </FormRow>
                    <FormRow label="Medication Code:">
                        <FormInput
                            type="text"
                            value={medRequest.MedicationCodeableConcept.Text}
                            onChange={(e) => handleMedicationRequestChange(index, 'MedicationCodeableConcept', { ...medRequest.MedicationCodeableConcept, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Subject Reference:">
                        <FormInput
                            type="text"
                            value={medRequest.Subject.Reference}
                            onChange={(e) => handleMedicationRequestChange(index, 'Subject', { ...medRequest.Subject, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Encounter Reference:">
                        <FormInput
                            type="text"
                            value={medRequest.Encounter.Reference}
                            onChange={(e) => handleMedicationRequestChange(index, 'Encounter', { ...medRequest.Encounter, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Authored On:">
                        <FormInput
                            type="text"
                            value={medRequest.AuthoredOn}
                            onChange={(e) => handleMedicationRequestChange(index, 'AuthoredOn', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Requester Reference:">
                        <FormInput
                            type="text"
                            value={medRequest.Requester.Reference}
                            onChange={(e) => handleMedicationRequestChange(index, 'Requester', { ...medRequest.Requester, Reference: e.target.value })}
                        />
                    </FormRow>
                    <h3>Dosage Instructions:</h3>
                    {medRequest.DosageInstruction.map((dosage, dosageIndex) => (
                        <div key={dosageIndex}>
                            <FormRow label="Text:">
                                <FormInput
                                    type="text"
                                    value={dosage.Text}
                                    onChange={(e) => handleMedicationRequestChange(index, `DosageInstruction[${dosageIndex}].Text`, e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Timing Repeat Frequency:">
                                <FormInput
                                    type="number"
                                    value={dosage.Timing.Repeat.Frequency}
                                    onChange={(e) => handleMedicationRequestChange(index, `DosageInstruction[${dosageIndex}].Timing.Repeat.Frequency`, parseInt(e.target.value))}
                                />
                            </FormRow>
                            <FormRow label="Route:">
                                <FormInput
                                    type="text"
                                    value={dosage.Route.Text}
                                    onChange={(e) => handleMedicationRequestChange(index, `DosageInstruction[${dosageIndex}].Route`, { ...dosage.Route, Text: e.target.value })}
                                />
                            </FormRow>
                            {/* Add more fields for DosageInstruction as needed */}
                            <Button type="button" onClick={() => handleRemoveDosageInstruction(index, dosageIndex)}>Remove Dosage Instruction</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAddDosageInstruction(index)}>Add Dosage Instruction</Button>

                    <h3>Dispense Request:</h3>
                    {medRequest.DispenseRequest ? (
                        <div>
                            <FormRow label="Validity Period Start:">
                                <FormInput
                                    type="text"
                                    value={medRequest.DispenseRequest.ValidityPeriod.Start}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.ValidityPeriod.Start', e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Validity Period End:">
                                <FormInput
                                    type="text"
                                    value={medRequest.DispenseRequest.ValidityPeriod.End}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.ValidityPeriod.End', e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Number of Repeats Allowed:">
                                <FormInput
                                    type="number"
                                    value={medRequest.DispenseRequest.NumberOfRepeatsAllowed}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.NumberOfRepeatsAllowed', parseInt(e.target.value))}
                                />
                            </FormRow>
                            <FormRow label="Quantity Value:">
                                <FormInput
                                    type="number"
                                    value={medRequest.DispenseRequest.Quantity.Value}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.Quantity.Value', parseFloat(e.target.value))}
                                />
                            </FormRow>
                            <FormRow label="Quantity Unit:">
                                <FormInput
                                    type="text"
                                    value={medRequest.DispenseRequest.Quantity.Unit}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.Quantity.Unit', e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Expected Supply Duration:">
                                <FormInput
                                    type="number"
                                    value={medRequest.DispenseRequest.ExpectedSupplyDuration.Duration}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.ExpectedSupplyDuration.Duration', parseFloat(e.target.value))}
                                />
                            </FormRow>
                            <FormRow label="Expected Supply Duration Unit:">
                                <FormInput
                                    type="text"
                                    value={medRequest.DispenseRequest.ExpectedSupplyDuration.Unit}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.ExpectedSupplyDuration.Unit', e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Performer Reference:">
                                <FormInput
                                    type="text"
                                    value={medRequest.DispenseRequest.Performer.Reference}
                                    onChange={(e) => handleMedicationRequestChange(index, 'DispenseRequest.Performer.Reference', e.target.value)}
                                />
                            </FormRow>
                            {/* Add more fields for Performer as needed */}
                            <Button type="button" onClick={() => handleRemoveDispenseRequest(index)}>Remove Dispense Request</Button>
                        </div>
                    ) : (
                        <Button type="button" onClick={() => handleAddDispenseRequest(index)}>Add Dispense Request</Button>
                    )}

                    <Button type="button" onClick={() => handleRemoveMedicationRequest(index)}>Remove Medication Request</Button>
                </div>
            ))}
            <Button type="button" onClick={handleAddMedicationRequest}>Add Medication Request</Button>
        </div>
    );
};

MedicationRequestForm.propTypes = {
    medicationRequests: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
};

export default MedicationRequestForm;
