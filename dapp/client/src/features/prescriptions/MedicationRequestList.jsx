import { useState } from "react";
import { useSearchPrescriptions } from "./usePrescriptions";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import MedicationRequestCard from "./MedicationRequestCard";
import AddMedicationRequestForm from "./AddMedicationRequestForm";
import { useParams } from "react-router-dom";

const MedicationRequestList = () => {
    const { id } = useParams();

    const defaultQuery = {

        selector: {
            "subject.reference": `${id}`,
        },

    };

    const [query, setQuery] = useState(defaultQuery);
    const { isPending, prescriptions } = useSearchPrescriptions(query);

    const { user, isPending: userLoading } = useUser();
    const [isModalOpen, setModalOpen] = useState(false);

    if (isPending || userLoading) return <Spinner />;

    const handleModalClose = () => {
        setModalOpen(false);
    };

    return (
        <div>
            <Heading>Lista delle Ricette</Heading>
            <List
                items={prescriptions}
                itemKey="identifier"
                ItemComponent={MedicationRequestCard}
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
