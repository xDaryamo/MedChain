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

const MedicationRequestCard = ({ item }) => {

    const requestID = item.identifier?.value || "ID non disponibile";
    const medication = item.medicationCodeableConcept
        ? item.medicationCodeableConcept.coding[0].display
        : "Medicazione Sconosciuta";
    const authoredOn = formatDate(item.authoredOn);
    const dosageInstructions = item.dosageInstruction
        ? item.dosageInstruction.map((instruction, index) => (
            <li key={index}>{instruction.text}</li>
        ))
        : ["Istruzioni di dosaggio non disponibili"];


    return (
        <Card>
            <Link to={`/prescriptions/${requestID}`} className="mb-4 flex-1">
                <div><strong>ID della Richiesta di Medicazione:</strong> {requestID}</div>
                <div><strong>Medicazione:</strong> {medication}</div>
                <div><strong>Data della Prescrizione:</strong> {authoredOn}</div>
                <div><strong>Istruzioni di Dosaggio:</strong><ul>{dosageInstructions}</ul></div>
            </Link>
        </Card>
    );
};

export default MedicationRequestCard;
