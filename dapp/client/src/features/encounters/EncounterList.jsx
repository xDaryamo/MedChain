import { useState } from "react";
import { useSearchEncounters, useRemoveEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddEncounterForm from "./AddEncounterForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import EncounterCard from "./EncounterCard";
import { useParams } from "react-router-dom";

const EncounterList = () => {

    const { id } = useParams();

    const defaultQuery = {
        query: {
            selector: {
                reference: `${id}`,
            },
        },
    };

    const [query, setQuery] = useState(defaultQuery);
    const { encounters = [], isPending, error } = useSearchEncounters(query);
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

    return (
        <div>
            <Heading>Encounter List</Heading>
            <List
                items={encounters}
                itemKey="id"
                ItemComponent={EncounterCard}
                onDelete={handleRemoveEncounter}
                isDeleting={isDeleting}
                user={user}
                onAddNew={() => setModalOpen(true)}
                hasAddBtn={true}
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
