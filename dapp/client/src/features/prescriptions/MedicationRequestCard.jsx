import React from "react";
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
        return "Data di Prescrizione Sconosciuta";
    }
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const renderSingleOrList = (title, list, renderItem) => {
    if (!list || list.length === 0) {
        return (
            <div>
                <span className="font-bold">{title}:</span> N/A
            </div>
        );
    }
    if (list.length === 1) {
        return (
            <div>
                <span className="font-bold">{title}:</span> {renderItem(list[0])}
            </div>
        );
    }
    return (
        <div>
            <h3 className="font-bold">{title}:</h3>
            <ul className="ml-4 list-disc">
                {list.map((item, index) => (
                    <li key={index} className="mb-1 ml-4">
                        {renderItem(item)}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const renderDosageInstruction = (dosageInstruction) =>
    dosageInstruction.text || "Istruzione di Dosaggio non disponibile";

const MedicationRequestCard = ({ item }) => {
    const requestID = item.identifier?.value || "ID non disponibile";
    const medication = item.medicationCodeableConcept
        ? item.medicationCodeableConcept.coding[0].display
        : "Medicazione Sconosciuta";
    const authoredOn = formatDate(item.authoredOn);
    const dosageInstructions = item.dosageInstruction || [];

    return (
        <Card>
            <Link to={`/prescriptions/${requestID}`} className="mb-4 block p-4">
                <div>
                    <strong>ID della Richiesta di Medicazione:</strong> {requestID}
                </div>
                <div>
                    <strong>Medicazione:</strong> {medication}
                </div>
                <div>
                    <strong>Data della Prescrizione:</strong> {authoredOn}
                </div>
                {renderSingleOrList(
                    "Istruzioni di Dosaggio",
                    dosageInstructions,
                    renderDosageInstruction
                )}
            </Link>
        </Card>
    );
};

export default MedicationRequestCard;
