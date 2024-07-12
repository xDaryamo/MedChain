import React from "react";
import { Link } from "react-router-dom";
import { useGetPatient } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") {
        return "Data Sconosciuta";
    }

    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const EncounterCard = ({ item }) => {
    const { patient, isPending: patientIsPending, error: patientError } = useGetPatient(item.patientID);

    if (patientIsPending) return <Spinner />;
    if (patientError) return <div>Errore nel caricamento dei dati del paziente</div>;

    const patientName = patient ? `${patient.name?.text}` : "Paziente Sconosciuto";
    const patientDOB = patient ? formatDate(patient.date) : "Data di Nascita Sconosciuta";
    const patientGender = patient ? `${patient.gender.coding[0].display}` : "Sesso Sconosciuto";

    const encounterID = item.id?.value || "ID non disponibile";
    const encounterType = item.type ? item.type.map((type, index) => (
        <li key={index}>{type.coding[0].display}</li>
    )) : ["Tipo di Incontro Sconosciuto"];

    const encounterPeriod = item.period ? (
        <div>
            {formatDate(item.period.start)} - {formatDate(item.period.end)}
        </div>
    ) : "Periodo Sconosciuto";

    const encounterReason = item.reasonCode ? item.reasonCode.map((reason, index) => (
        <li key={index}>{reason.coding[0].display}</li>
    )) : ["Ragione dell'Incontro Sconosciuta"];

    const encounterStatus = item.status || "Stato Sconosciuto";

    return (
        <Card>
            <Link to={`/encounters/${encounterID}`} className="mb-4 flex-1">
                <div><strong>Numero dell'Incontro:</strong> {encounterID}</div>
                <div><strong>Nome del Paziente:</strong> {patientName}</div>
                <div><strong>Data di Nascita:</strong> {patientDOB}</div>
                <div><strong>Sesso:</strong> {patientGender}</div>
                <div><strong>Tipo di Incontro:</strong><ul>{encounterType}</ul></div>
                <div><strong>Periodo dell'Incontro:</strong> {encounterPeriod}</div>
                <div><strong>Ragione dell'Incontro:</strong><ul>{encounterReason}</ul></div>
                <div><strong>Stato dell'Incontro:</strong> {encounterStatus}</div>
            </Link>
        </Card>
    );
};

export default EncounterCard;
