import { useParams, useNavigate } from "react-router-dom";
import { useGetPrescription, useRemovePrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString("it-IT", options);
};

const MedicationRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { removePrescription, deletePending } = useRemovePrescription();
    const { isPending, prescription } = useGetPrescription(id);

    const handleDeleteMedicationRequest = () => {
        if (window.confirm("Sei sicuro di voler eliminare questa prescrizione?")) {
            removePrescription(id, {
                onSuccess: () => {
                    navigate(-2);
                },
            });
        }
    };

    const renderPrescription = (prescription) => {
        return (
            <div>
                <div>
                    <strong>ID:</strong> {prescription.identifier?.value || "N/D"}
                </div>
                <div>
                    <strong>Stato:</strong> {prescription.status?.coding[0].code || "Stato sconosciuto"}
                </div>
                <div>
                    <strong>Intento:</strong> {prescription.intent?.coding[0].code || "Intento sconosciuto"}
                </div>
                <div>
                    <strong>Farmaco:</strong> {prescription.medicationCodeableConcept?.text || "Farmaco sconosciuto"}
                </div>
                <div>
                    <strong>Paziente:</strong> {prescription.subject?.display || "Paziente sconosciuto"}
                </div>
                <div>
                    <strong>Data di Autorizzazione:</strong> {formatDate(prescription.authoredOn)}
                </div>
                <div>
                    <strong>Richiedente:</strong> {prescription.requester?.display || "Richiedente sconosciuto"}
                </div>
                <div>
                    <strong>Istruzioni di Dosaggio:</strong>
                    <ul>
                        {prescription.dosageInstruction?.map((instruction, index) => (
                            <li key={index}>
                                <strong>Dosaggio {index + 1}:</strong>
                                <div>Testo: {instruction.text || "N/D"}</div>
                                <div>Via: {instruction.route?.text || "N/D"}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                {prescription.dispenseRequest && (
                    <div>
                        <strong>Richiesta di Dispensa:</strong>
                        <div>
                            <strong>Quantità:</strong> {prescription.dispenseRequest.quantity.value} {prescription.dispenseRequest.quantity.unit}
                        </div>
                        <div>
                            <strong>Durata di Fornitura Prevista:</strong> {prescription.dispenseRequest.expectedSupplyDuration.value} {prescription.dispenseRequest.expectedSupplyDuration.unit}
                        </div>
                        <div>
                            <strong>Inizio Validità:</strong> {prescription.dispenseRequest.validityPeriod?.start}
                        </div>
                        <div>
                            <strong>Fine Validità:</strong> {prescription.dispenseRequest.validityPeriod?.end}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (isPending || prescription === undefined || deletePending) {
        return <Spinner />;
    }

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="flex items-center mb-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Indietro
                </Button>
                <h1 className="ml-4 text-2xl font-bold">Dettagli Prescrizione</h1>
            </div>
            <section className="mt-4 space-y-6">
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold mb-2">Informazioni Prescrizione</h2>
                    {renderPrescription(prescription.prescription)}
                </div>
                <div className="flex space-x-4 mt-4">
                    <Link
                        to={`/prescriptions/update/${id}`}
                        className="mt-4 flex w-full justify-center space-x-4"
                    >
                        <Button variant="primary" size="large">
                            Modifica
                        </Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDeleteMedicationRequest}
                        disabled={deletePending}
                    >
                        {deletePending ? <Spinner /> : "Elimina"}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default MedicationRequestPage;
