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
        "subject.reference": `${id}`,
      },
    },
  };

  const [query, setQuery] = useState(defaultQuery);
  const { isPending, encounters } = useSearchEncounters(query);
  const { removeEncounter, isPending: isDeleting } = useRemoveEncounter();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(encounters);

  if (userError) return <p>Error loading user data</p>;

  const handleRemoveEncounter = async (id) => {
    removeEncounter(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  if (isPending || userLoading) return <Spinner />;

  return (
    <div>
      <Heading>Encounter List</Heading>
      <List
        items={encounters}
        itemKey="identifier"
        ItemComponent={EncounterCard}
        onDelete={handleRemoveEncounter}
        isDeleting={isDeleting}
        user={user}
        onAddNew={() => setModalOpen(true)}
        hasAddBtn={user?.role === "practitioner"}
      />
      {user?.role === "practitioner" && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <AddEncounterForm onSubmitSuccess={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default EncounterList;
