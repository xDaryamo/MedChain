import { useParams, useNavigate } from "react-router-dom";
import { useGetPrescription, useRemovePrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import { Link } from 'react-router-dom';

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const MedicationRequestPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { removePrescription, deletePending } = useRemovePrescription();
    const { isPending, prescription } = useGetPrescription(id);

    const handleDeleteMedicationRequest = () => {
        if (window.confirm("Are you sure you want to delete this prescription?")) {
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
                    <strong>ID:</strong> {prescription.identifier?.value || "N/A"}
                </div>
                <div>
                    <strong>Status:</strong> {prescription.status?.coding[0].code || "Status Unknown"}
                </div>
                <div>
                    <strong>Intent:</strong> {prescription.intent?.coding[0].code || "Intent Unknown"}
                </div>
                <div>
                    <strong>Medication:</strong> {prescription.medicationCodeableConcept?.text || "Medication Unknown"}
                </div>
                <div>
                    <strong>Patient:</strong> {prescription.subject?.display || "Patient Unknown"}
                </div>
                <div>
                    <strong>Authored On:</strong> {formatDate(prescription.authoredOn)}
                </div>
                <div>
                    <strong>Requester:</strong> {prescription.requester?.display || "Requester Unknown"}
                </div>
                <div>
                    <strong>Dosage Instructions:</strong>
                    <ul>
                        {prescription.dosageInstruction?.map((instruction, index) => (
                            <li key={index}>
                                <strong>Dosage {index + 1}:</strong>
                                <div>Text: {instruction.text || "N/A"}</div>
                                <div>Route: {instruction.route?.text || "N/A"}</div>
                            </li>
                        ))}
                    </ul>
                </div>
                {prescription.dispenseRequest && (
                    <div>
                        <strong>Dispense Request:</strong>
                        <div>
                            <strong>Quantity:</strong> {prescription.dispenseRequest.quantity.value} {prescription.dispenseRequest.quantity.unit}
                        </div>
                        <div>
                            <strong>Expected Supply Duration:</strong> {prescription.dispenseRequest.expectedSupplyDuration.value} {prescription.dispenseRequest.expectedSupplyDuration.unit}
                        </div>
                        <div>
                            <strong>Validity start:</strong> {prescription.dispenseRequest.validityPeriod?.start}
                        </div>
                        <div>
                            <strong>Validity end:</strong> {prescription.dispenseRequest.validityPeriod?.end}
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
                    Back
                </Button>
                <h1 className="ml-4 text-2xl font-bold">Prescription Details</h1>
            </div>
            <section className="mt-4 space-y-6">
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold mb-2">Prescription Information</h2>
                    {renderPrescription(prescription.prescription)}
                </div>
                <div className="flex space-x-4 mt-4">
                    <Link to={`/prescriptions/update/${id}`}>
                        <Button variant="secondary">Edit</Button>
                    </Link>
                    <Button
                        variant="danger"
                        onClick={handleDeleteMedicationRequest}
                        disabled={deletePending}
                    >
                        {deletePending ? <Spinner /> : "Delete"}
                    </Button>
                </div>
            </section>
        </div>
    );
};

export default MedicationRequestPage;
