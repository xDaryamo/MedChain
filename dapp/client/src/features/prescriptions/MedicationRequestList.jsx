import { useState } from "react";
import { useSearchPrescriptions, useRemovePrescription } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddMedicationRequestForm from "./AddMedicationRequestForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import MedicationRequestCard from "./MedicationRequestCard";
import { useParams } from "react-router-dom";

const MedicationRequestList = () => {
    const { id } = useParams();

    const defaultQuery = {
        query: {
            selector: {
                "subject.reference": `${id}`,
            },
        },
    };

    const [query, setQuery] = useState(defaultQuery);
    const { medicationRequests = [], isPending, error } = useSearchPrescriptions(query);

    const { removeMedicationRequest, isPending: isDeleting } = useRemovePrescription();
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

    return (
        <div>
            <Heading>Medication Requests List</Heading>
            <List
                items={medicationRequests}
                itemKey="id"
                ItemComponent={MedicationRequestCard}
                onDelete={handleRemoveMedicationRequest}
                isDeleting={isDeleting}
                user={user}
                onAddNew={() => setModalOpen(true)}
                hasAddBtn={true}
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
