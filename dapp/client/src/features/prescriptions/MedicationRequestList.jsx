import { useState } from "react";
import { useSearchMedicationRequests, useRemoveMedicationRequest } from "./useMedicationRequests";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddMedicationRequestForm from "./AddMedicationRequestForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";

const MedicationRequestList = () => {
    const { medicationRequests = [], isPending, error } = useSearchMedicationRequests();
    const { removeMedicationRequest, isPending: isDeleting } = useRemoveMedicationRequest();
    const { user, isPending: userLoading, error: userError } = useUser();
    const [isModalOpen, setModalOpen] = useState(false);

    if (isPending || userLoading) return <Spinner />;
    if (error || userError)
        return <p>Error loading medication requests or user data</p>;

    const handleRemoveMedicationRequest = async (id) => {
        await removeMedicationRequest(id);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const itemText = (item) => {
        const id = item.id;
        const medication = item.medicationCodeableConcept?.text || "Unknown Medication";
        const status = item.status?.text || "Unknown Status";
        const requester = item.requester?.display || "Unknown Requester";
        return `ID: ${id} - Medication: ${medication} - Status: ${status} - Requester: ${requester}`;
    };

    return (
        <div>
            <Heading>Medication Requests List</Heading>
            <List
                items={medicationRequests}
                itemKey="id"
                itemText={itemText}
                onDelete={handleRemoveMedicationRequest}
                isDeleting={isDeleting}
                user={user}
                onAddNew={() => setModalOpen(true)}
            />
            {user.role === "practitioner" && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <AddMedicationRequestForm onSubmitSuccess={handleModalClose} />
                </Modal>
            )}
            <Toaster />
        </div>
    );
};

export default MedicationRequestList;