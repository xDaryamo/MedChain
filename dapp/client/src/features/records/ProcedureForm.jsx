import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../ui/Button';
import FormRow from '../../ui/FormRow';
import FormInput from '../../ui/FormInput';

const ProcedureForm = ({ procedures, onChange, defaultValues = {} }) => {
    const [proceduresData, setProceduresData] = useState(procedures);

    const handleAddProcedure = () => {
        setProceduresData([...proceduresData, { ...defaultValues }]);
    };

    const handleProcedureChange = (index, field, value) => {
        const updatedProcedures = proceduresData.map((procedure, i) =>
            i === index ? { ...procedure, [field]: value } : procedure
        );
        setProceduresData(updatedProcedures);
        onChange(updatedProcedures);
    };

    const handleRemoveProcedure = (index) => {
        const updatedProcedures = proceduresData.filter((procedure, i) => i !== index);
        setProceduresData(updatedProcedures);
        onChange(updatedProcedures);
    };

    return (
        <div>
            <h2>Procedures:</h2>
            {proceduresData.map((procedure, index) => (
                <div key={index}>
                    <FormRow label="Status:">
                        <FormInput
                            type="text"
                            value={procedure.Status}
                            onChange={(e) => handleProcedureChange(index, 'Status', e.target.value)}
                        />
                    </FormRow>
                    <FormRow label="Category:">
                        <FormInput
                            type="text"
                            value={procedure.Category ? procedure.Category.Text : ''}
                            onChange={(e) => handleProcedureChange(index, 'Category', { ...procedure.Category, Text: e.target.value })}
                        />
                    </FormRow>
                    <FormRow label="Encounter Reference:">
                        <FormInput
                            type="text"
                            value={procedure.Encounter ? procedure.Encounter.Reference : ''}
                            onChange={(e) => handleProcedureChange(index, 'Encounter', { ...procedure.Encounter, Reference: e.target.value })}
                        />
                    </FormRow>
                    <Button type="button" onClick={() => handleRemoveProcedure(index)}>Remove Procedure</Button>
                </div>
            ))}
            <Button type="button" onClick={handleAddProcedure}>Add Procedure</Button>
        </div>
    );
};

ProcedureForm.propTypes = {
    procedures: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    defaultValues: PropTypes.object,
};

export default ProcedureForm;
