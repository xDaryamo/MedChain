import { useState } from "react";
import { useSearchEncounters, useRemoveEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddEncounterForm from "./AddEncounterForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";

const EncounterList = () => {
    const { encounters = [], isPending, error } = useSearchEncounters();
    const { removeEncounter, isPending: isDeleting } = useRemoveEncounter();
    const { user, isPending: userLoading, error: userError } = useUser();
    const [isModalOpen, setModalOpen] = useState(false);

    if (isPending || userLoading) return <Spinner />;
    if (error || userError)
        return <p>Error loading encounters or user data</p>;

    const handleRemoveEncounter = async (id) => {
        await removeEncounter(id);
    };

    const handleModalClose = () => {
        setModalOpen(false);
    };

    const itemText = (encounter) => {
        const id = encounter.id || "Unknown ID";
        const status = encounter.status?.text || "Unknown Status";
        const type = encounter.type?.map((type) => type.text).join(", ") || "Unknown Type";
        const classType = encounter.class?.text || "Unknown Class";
        const subject = encounter.subject?.display || "Unknown Subject";
        const serviceProvider = encounter.serviceProvider?.display || "Unknown Service Provider";
        const reason = encounter.reasonCode?.text || "Unknown Reason";
        const location = encounter.location?.map((loc) => loc.name).join(", ") || "Unknown Location";
        const diagnosis = encounter.diagnosis?.map((diag) => diag.condition?.display).join(", ") || "Unknown Diagnosis";

        // Format period start and end if available
        let period = "Unknown Period";
        if (encounter.period?.start && encounter.period?.end) {
            period = `${encounter.period.start} to ${encounter.period.end}`;
        } else if (encounter.period?.start) {
            period = `From ${encounter.period.start}`;
        } else if (encounter.period?.end) {
            period = `Until ${encounter.period.end}`;
        }

        return `
            ID: ${id}
            Status: ${status}
            Type: ${type}
            Class: ${classType}
            Subject: ${subject}
            Service Provider: ${serviceProvider}
            Reason: ${reason}
            Location: ${location}
            Diagnosis: ${diagnosis}
            Period: ${period}
        `;
    };


    return (
        <div>
            <Heading>Encounter List</Heading>
            <List
                items={encounters}
                itemKey="id"
                itemText={itemText}
                onDelete={handleRemoveEncounter}
                isDeleting={isDeleting}
                user={user}
                onAddNew={() => setModalOpen(true)}
            />
            {user.role === "practitioner" && (
                <Modal isOpen={isModalOpen} onClose={handleModalClose}>
                    <AddEncounterForm onSubmitSuccess={handleModalClose} />
                </Modal>
            )}
            <Toaster />
        </div>
    );
};

export default EncounterList;
