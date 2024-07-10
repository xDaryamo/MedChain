import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetPrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import UpdateMedicationRequestForm from "./UpdateMedicationRequestForm";

const MedicationRequestPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { medicationRequest, isPending: isLoading } = useGetPrescription(id);

    const handleUpdateMedicationRequest = async () => {
        navigate(`/prescription/${id}`);
    };

    const showUpdateForm =
        new URLSearchParams(location.search).get("edit") === "true";

    const handleShowUpdateForm = () => {
        navigate(`${location.pathname}?edit=true`);
    };

    const handleHideUpdateForm = () => {
        navigate(location.pathname);
    };

    const itemText = (item) => {
        const id = item.id;
        const medication = item.medicationCodeableConcept?.text || "Unknown Medication";
        const status = item.status?.text || "Unknown Status";
        const requester = item.requester?.display || "Unknown Requester";
        const authoredOn = item.authoredOn || "Unknown Date";
        return `ID: ${id} - Medication: ${medication} - Status: ${status} - Requester: ${requester} - Authored On: ${authoredOn}`;
    };

    if (isLoading) return <Spinner />;

    return (
        <div>
            <h1>Medication Request Details</h1>
            {medicationRequest ? (
                <div>
                    <p>{itemText(medicationRequest)}</p>
                    <Button onClick={handleShowUpdateForm}>Update Medication Request</Button>
                    {showUpdateForm && (
                        <UpdateMedicationRequestForm
                            medicationRequest={medicationRequest}
                            onUpdate={handleUpdateMedicationRequest}
                            onCancel={handleHideUpdateForm}
                        />
                    )}
                </div>
            ) : (
                <p>No medication request found for the current ID.</p>
            )}
        </div>
    );
};

export default MedicationRequestPage;
