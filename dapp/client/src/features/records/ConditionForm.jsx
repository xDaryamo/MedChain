import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormInput from '../../ui/FormInput';

const ConditionForm = ({ conditions, onChange, defaultValues }) => {
    const [conditionsData, setConditionsData] = useState(conditions);

    const handleAddCondition = () => {
        setConditionsData([...conditionsData, { ...defaultValues }]);
    };

    const handleConditionChange = (index, field, value) => {
        const updatedConditions = conditionsData.map((condition, i) =>
            i === index ? { ...condition, [field]: value } : condition
        );
        setConditionsData(updatedConditions);
        onChange(updatedConditions);
    };

    const handleRemoveCondition = (index) => {
        const updatedConditions = conditionsData.filter((condition, i) => i !== index);
        setConditionsData(updatedConditions);
        onChange(updatedConditions);
    };

    const handleAddEvidence = (conditionIndex) => {
        const updatedConditions = [...conditionsData];
        updatedConditions[conditionIndex].Evidence.push({ Code: { Coding: [], Text: '' }, Detail: [] });
        setConditionsData(updatedConditions);
        onChange(updatedConditions);
    };

    const handleRemoveEvidence = (conditionIndex, evidenceIndex) => {
        const updatedConditions = [...conditionsData];
        updatedConditions[conditionIndex].Evidence.splice(evidenceIndex, 1);
        setConditionsData(updatedConditions);
        onChange(updatedConditions);
    };

    return (
        <div>
            <h2>Conditions:</h2>
            {conditionsData.map((condition, conditionIndex) => (
                <div key={conditionIndex}>
                    <FormRow label="Clinical Status:">
                        <FormInput
                            type="text"
                            value={condition.ClinicalStatus.Text}
                            onChange={(e) => handleConditionChange(conditionIndex, 'ClinicalStatus', { ...condition.ClinicalStatus, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Verification Status:">
                        <FormInput
                            type="text"
                            value={condition.VerificationStatus.Text}
                            onChange={(e) => handleConditionChange(conditionIndex, 'VerificationStatus', { ...condition.VerificationStatus, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Category:">
                        <FormInput
                            type="text"
                            value={condition.Category.join(', ')}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Category', e.target.value.split(', '))}
                        />
                    </FormRow>
                    <FormRow label="Severity:">
                        <FormInput
                            type="text"
                            value={condition.Severity.Text}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Severity', { ...condition.Severity, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Subject Reference:">
                        <FormInput
                            type="text"
                            value={condition.Subject.Reference}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Subject', { ...condition.Subject, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Subject Display:">
                        <FormInput
                            type="text"
                            value={condition.Subject.Display}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Subject', { ...condition.Subject, Display: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Onset Date/Time:">
                        <FormInput
                            type="text"
                            value={condition.OnsetDateTime}
                            onChange={(e) => handleConditionChange(conditionIndex, 'OnsetDateTime', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Abatement Date/Time:">
                        <FormInput
                            type="text"
                            value={condition.AbatementDateTime}
                            onChange={(e) => handleConditionChange(conditionIndex, 'AbatementDateTime', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Recorded Date:">
                        <FormInput
                            type="text"
                            value={condition.RecordedDate}
                            onChange={(e) => handleConditionChange(conditionIndex, 'RecordedDate', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Recorder Reference:">
                        <FormInput
                            type="text"
                            value={condition.Recorder.Reference}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Recorder', { ...condition.Recorder, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Recorder Display:">
                        <FormInput
                            type="text"
                            value={condition.Recorder.Display}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Recorder', { ...condition.Recorder, Display: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Asserter Reference:">
                        <FormInput
                            type="text"
                            value={condition.Asserter.Reference}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Asserter', { ...condition.Asserter, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Asserter Display:">
                        <FormInput
                            type="text"
                            value={condition.Asserter.Display}
                            onChange={(e) => handleConditionChange(conditionIndex, 'Asserter', { ...condition.Asserter, Display: e.target.value })}
                        />
                    </FormRow>
                    <h3>Evidence:</h3>
                    {condition.Evidence.map((evidence, evidenceIndex) => (
                        <div key={evidenceIndex}>
                            <FormRow label="Evidence Code:">
                                <FormInput
                                    type="text"
                                    value={evidence.Code.Text}
                                    onChange={(e) => handleConditionChange(conditionIndex, `Evidence[${evidenceIndex}].Code`, { ...evidence.Code, Text: e.target.value })}
                                />
                            </FormRow>
                            <FormRow label="Evidence Detail:">
                                <FormInput
                                    type="text"
                                    value={evidence.Detail.join(', ')}
                                    onChange={(e) => handleConditionChange(conditionIndex, `Evidence[${evidenceIndex}].Detail`, e.target.value.split(', '))}
                                />
                            </FormRow>
                            <Button type="button" onClick={() => handleRemoveEvidence(conditionIndex, evidenceIndex)}>Remove Evidence</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAddEvidence(conditionIndex)}>Add Evidence</Button>
                    <Button type="button" onClick={() => handleRemoveCondition(conditionIndex)}>Remove Condition</Button>
                </div>
            ))}
            <Button type="button" onClick={handleAddCondition}>Add Condition</Button>
        </div>
    );
};

ConditionForm.propTypes = {
    conditions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
};

export default ConditionForm;
