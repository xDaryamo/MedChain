import { useState } from "react";
import { useSearchObservations, useRemoveObservation } from "./useObservations";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddObservationForm from "./AddObservationForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";

const ObservationList = () => {
    const { observations = [], isPending, error } = useSearchObservations();
    const { removeObservation, isPending: isDeleting } = useRemoveObservation();
    const { user, isPending: userLoading, error: userError } = useUser();
    const [isModalOpen, setModalOpen] = useState(false);

    if (isPending || userLoading) return <Spinner />;
    if (error || userError) return <p>Error loading observations or user data</p>;

    const handleRemoveObservation = async (id) => {
        await removeObservation(id);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const itemText = (observation) => {
        const id = observation.id || "Unknown ID";
        const status = observation.status?.text || "Unknown Status";
        const category = observation.category?.text || "Unknown Category";
        const subject = observation.subject?.display || "Unknown Subject";
        const performer = observation.performer?.map((perf) => perf.display).join(", ") || "Unknown Performer";
        const value = observation.valueQuantity?.value || "Unknown Value";
        const unit = observation.valueQuantity?.unit || "Unknown Unit";
        const effectiveDateTime = observation.effectiveDateTime || "Unknown Date";

        return `
            ID: ${id}
            Status: ${status}
            Category: ${category}
            Subject: ${subject}
            Performer: ${performer}
            Value: ${value} ${unit}
            Date: ${effectiveDateTime}
        `;
    };

    return (
        <div>
            <Heading>Observation List</Heading>
            <List
                items={observations}
                itemKey="id"
                itemText={itemText}
                onDelete={handleRemoveObservation}
                isDeleting={isDeleting}
                user={user}
                onAddNew={() => setModalOpen(true)}
            />
            {user.role === "practitioner" && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <AddObservationForm onSubmitSuccess={handleModalClose} />
                </Modal>
            )}
            <Toaster />
        </div>
    );
};

export default ObservationList;
