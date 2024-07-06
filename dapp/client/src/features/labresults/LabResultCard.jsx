import React from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../../ui/Spinner';
import Card from '../../ui/Card';
import { useGetPatient } from '../users/usePatients';

const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
        return "Data di Prescrizione Sconosciuta";
    }

    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const LabResultCard = ({ item }) => {
    const { patient, isPending, error } = useGetPatient(item.subject.reference);

    if (isPending) return <Spinner />;
    if (error) return <div>Error loading patient data</div>;

    const patientName = patient ? patient.name.text : 'Paziente Sconosciuto';
    const patientDOB = patient ? formatDate(patient.birthDate) : 'Data di Nascita Sconosciuta';
    const patientGender = patient ? patient.gender : 'Sesso Sconosciuto';

    const observationID = item.id;
    const codeDisplay = item.code.coding[0].display;
    const effectiveDate = formatDate(item.effectiveDateTime);
    const valueQuantity = item.valueQuantity ? `${item.valueQuantity.value} ${item.valueQuantity.unit}` : 'Valore non disponibile';
    const interpretation = item.interpretation ? item.interpretation.map(inter => inter.text).join(', ') : 'Interpretazione non disponibile';
    const status = item.status || 'Stato non disponibile';
    const categoryDisplay = item.category ? item.category.map(cat => cat.text).join(', ') : 'Categoria non disponibile';
    const performerName = item.performer ? item.performer.map(performer => performer.display).join(', ') : 'Esecutore non disponibile';
    const noteText = item.note ? item.note.map(note => note.text).join(', ') : 'Nessuna nota disponibile';

    const components = item.components || [];

    return (
        <Card item={item} itemKey="id">
            <Link to={`/labresults/${observationID}`} className="mb-4 flex-1">
                <div>
                    <strong>ID dell'Osservazione:</strong> {observationID}
                </div>
                <div>
                    <strong>Nome del Paziente:</strong> {patientName}
                </div>
                <div>
                    <strong>Data di Nascita:</strong> {patientDOB}
                </div>
                <div>
                    <strong>Sesso:</strong> {patientGender}
                </div>
                <div>
                    <strong>Codice dell'Osservazione:</strong> {codeDisplay}
                </div>
                <div>
                    <strong>Data dell'Osservazione:</strong> {effectiveDate}
                </div>
                <div>
                    <strong>Valore:</strong> {valueQuantity}
                </div>
                <div>
                    <strong>Interpretazione:</strong> {interpretation}
                </div>
                <div>
                    <strong>Stato:</strong> {status}
                </div>
                <div>
                    <strong>Categoria:</strong> {categoryDisplay}
                </div>
                <div>
                    <strong>Esecutore:</strong> {performerName}
                </div>
                <div>
                    <strong>Note:</strong> {noteText}
                </div>
                <div>
                    <strong>Componenti:</strong>
                    <ul>
                        {components.map((component, index) => (
                            <li key={index}>
                                {component.code.coding[0].display}: {renderComponentValue(component)}
                            </li>
                        ))}
                    </ul>
                </div>
            </Link>
        </Card>
    );
};

const renderComponentValue = (component) => {
    if (component.valueQuantity) {
        return `${component.valueQuantity.value} ${component.valueQuantity.unit}`;
    } else if (component.valueCodeableConcept) {
        return component.valueCodeableConcept.text;
    } else if (component.valueString) {
        return component.valueString;
    } else if (component.valueBoolean !== undefined) {
        return component.valueBoolean ? 'True' : 'False';
    } else if (component.valueInteger !== undefined) {
        return component.valueInteger.toString();
    } else if (component.valueRange) {
        return `Low: ${component.valueRange.low.value} ${component.valueRange.low.unit}, High: ${component.valueRange.high.value} ${component.valueRange.high.unit}`;
    } else if (component.valueRatio) {
        return `${component.valueRatio.numerator.value}/${component.valueRatio.denominator.value}`;
    } else {
        return 'Valore non disponibile';
    }
};

export default LabResultCard;
