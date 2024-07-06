/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
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
    const { patient, isPending, error } = useGetPatient(item.patientID);

    if (isPending) return <Spinner />;
    if (error) return <div>Errore nel caricamento dei dati del paziente</div>;

    const patientName = patient
        ? `${patient.name?.text}`
        : "Paziente Sconosciuto";
    const patientDOB = patient
        ? formatDate(patient.date)
        : "Data di Nascita Sconosciuta";
    const patientGender = patient
        ? `${patient.gender.coding[0].display}`
        : "Sesso Sconosciuto";

    const requestID = item.identifier;
    const medication = item.medicationCodeableConcept
        ? item.medicationCodeableConcept.coding[0].display
        : "Medicazione Sconosciuta";
    const authoredOn = formatDate(item.authoredOn);
    const dosageInstructions = item.dosageInstruction
        ? item.dosageInstruction.map((instruction, index) => (
            <li key={index}>{instruction.text}</li>
        ))
        : ["Istruzioni di dosaggio non disponibili"];
    const reasonCode = item.reasonCode
        ? item.reasonCode.map((reason, index) => (
            <li key={index}>{reason.coding[0].display}</li>
        ))
        : ["Motivo non disponibile"];
    const note = item.note ? item.note.map((note, index) => (
        <li key={index}>{note.text}</li>
    )) : ["Nessuna nota disponibile"];

    return (
        <Card item={item} itemKey="identifier">
            <Link to={`/medicationRequests/${requestID}`} className="mb-4 flex-1">
                <div>
                    <strong>Numero della Richiesta di Medicazione:</strong> {requestID}
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
                    <strong>Medicazione:</strong> {medication}
                </div>
                <div>
                    <strong>Data della Prescrizione:</strong> {authoredOn}
                </div>
                <div>
                    <strong>Istruzioni di Dosaggio:</strong>
                    <ul>{dosageInstructions}</ul>
                </div>
                <div>
                    <strong>Motivo della Prescrizione:</strong>
                    <ul>{reasonCode}</ul>
                </div>
                <div>
                    <strong>Note:</strong>
                    <ul>{note}</ul>
                </div>
            </Link>
        </Card>
    );
};

export default MedicationRequestCard;
