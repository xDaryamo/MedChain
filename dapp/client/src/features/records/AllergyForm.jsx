import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormInput from '../../ui/FormInput';

const AllergyForm = ({ allergies, onChange, defaultValues }) => {
    const [allergiesData, setAllergiesData] = useState(allergies);

    const handleAddAllergy = () => {
        setAllergiesData([...allergiesData, { ...defaultValues }]);
    };

    const handleAllergyChange = (index, field, value) => {
        const updatedAllergies = allergiesData.map((allergy, i) =>
            i === index ? { ...allergy, [field]: value } : allergy
        );
        setAllergiesData(updatedAllergies);
        onChange(updatedAllergies);
    };

    const handleRemoveAllergy = (index) => {
        const updatedAllergies = allergiesData.filter((allergy, i) => i !== index);
        setAllergiesData(updatedAllergies);
        onChange(updatedAllergies);
    };

    const handleAddReaction = (allergyIndex) => {
        const updatedAllergies = [...allergiesData];
        updatedAllergies[allergyIndex].Reaction.push({
            Substance: { Coding: [], Text: '' },
            Manifestation: [],
            Severity: '',
            ExposureRoute: { Coding: [], Text: '' },
            Note: []
        });
        setAllergiesData(updatedAllergies);
        onChange(updatedAllergies);
    };

    const handleRemoveReaction = (allergyIndex, reactionIndex) => {
        const updatedAllergies = [...allergiesData];
        updatedAllergies[allergyIndex].Reaction.splice(reactionIndex, 1);
        setAllergiesData(updatedAllergies);
        onChange(updatedAllergies);
    };

    return (
        <div>
            <h2>Allergies:</h2>
            {allergiesData.map((allergy, index) => (
                <div key={index}>
                    <FormRow label="Clinical Status:">
                        <FormInput
                            type="text"
                            value={allergy.ClinicalStatus.Text}
                            onChange={(e) => handleAllergyChange(index, 'ClinicalStatus', { ...allergy.ClinicalStatus, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Verification Status:">
                        <FormInput
                            type="text"
                            value={allergy.VerificationStatus.Text}
                            onChange={(e) => handleAllergyChange(index, 'VerificationStatus', { ...allergy.VerificationStatus, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Type:">
                        <FormInput
                            type="text"
                            value={allergy.Type}
                            onChange={(e) => handleAllergyChange(index, 'Type', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Category:">
                        <FormInput
                            type="text"
                            value={allergy.Category.join(', ')}
                            onChange={(e) => handleAllergyChange(index, 'Category', e.target.value.split(', '))}
                        />
                    </FormRow>
                    <FormRow label="Criticality:">
                        <FormInput
                            type="text"
                            value={allergy.Criticality}
                            onChange={(e) => handleAllergyChange(index, 'Criticality', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Patient Reference:">
                        <FormInput
                            type="text"
                            value={allergy.Patient.Reference}
                            onChange={(e) => handleAllergyChange(index, 'Patient', { ...allergy.Patient, Reference: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Patient Display:">
                        <FormInput
                            type="text"
                            value={allergy.Patient.Display}
                            onChange={(e) => handleAllergyChange(index, 'Patient', { ...allergy.Patient, Display: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Allergy Code:">
                        <FormInput
                            type="text"
                            value={allergy.Code.Text}
                            onChange={(e) => handleAllergyChange(index, 'Code', { ...allergy.Code, Text: e.target.value })}
                        />
                    </FormRow>
                    <h3>Reactions:</h3>
                    {allergy.Reaction.map((reaction, reactionIndex) => (
                        <div key={reactionIndex}>
                            <FormRow label="Substance:">
                                <FormInput
                                    type="text"
                                    value={reaction.Substance.Text}
                                    onChange={(e) => handleAllergyChange(index, `Reaction[${reactionIndex}].Substance`, { ...reaction.Substance, Text: e.target.value })}
                                />
                            </FormRow>
                            <FormRow label="Manifestation:">
                                <FormInput
                                    type="text"
                                    value={reaction.Manifestation.join(', ')}
                                    onChange={(e) => handleAllergyChange(index, `Reaction[${reactionIndex}].Manifestation`, e.target.value.split(', '))}
                                />
                            </FormRow>
                            <FormRow label="Severity:">
                                <FormInput
                                    type="text"
                                    value={reaction.Severity}
                                    onChange={(e) => handleAllergyChange(index, `Reaction[${reactionIndex}].Severity`, e.target.value)}
                                />
                            </FormRow>
                            <FormRow label="Exposure Route:">
                                <FormInput
                                    type="text"
                                    value={reaction.ExposureRoute.Text}
                                    onChange={(e) => handleAllergyChange(index, `Reaction[${reactionIndex}].ExposureRoute`, { ...reaction.ExposureRoute, Text: e.target.value })}
                                />
                            </FormRow>
                            {/* You can add more fields for Reaction as needed */}
                            <Button type="button" onClick={() => handleRemoveReaction(index, reactionIndex)}>Remove Reaction</Button>
                        </div>
                    ))}
                    <Button type="button" onClick={() => handleAddReaction(index)}>Add Reaction</Button>
                    <Button type="button" onClick={() => handleRemoveAllergy(index)}>Remove Allergy</Button>
                </div>
            ))}
            <Button type="button" onClick={handleAddAllergy}>Add Allergy</Button>
        </div>
    );
};

AllergyForm.propTypes = {
    allergies: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValues: PropTypes.object.isRequired,
};

export default AllergyForm;
