/* eslint-disable no-unused-vars */
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
  const { isPending, encounters, refetch } = useSearchEncounters(query);
  const { removeEncounter, isPending: isDeleting } = useRemoveEncounter();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(encounters);

  if (userError) return <p>Errore nel caricamento dei dati utente</p>;

  const handleRemoveEncounter = async (id) => {
    await removeEncounter(id);
    refetch();
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleModalSuccess = () => {
    setModalOpen(false);
    refetch();
  };

  const isPharmacyOrLab =
    user?.organization.toLowerCase().includes("pharmacy") ||
    user?.organization.toLowerCase().includes("farmacia") ||
    user?.organization.toLowerCase().includes("laboratory") ||
    user?.organization.toLowerCase().includes("laboratorio");

  if (isPending || userLoading) return <Spinner />;

  return (
    <div>
      <Heading>Lista delle visite</Heading>
      <List
        items={encounters}
        itemKey="identifier"
        ItemComponent={EncounterCard}
        onDelete={handleRemoveEncounter}
        isDeleting={isDeleting}
        user={user}
        onAddNew={() => setModalOpen(true)}
        hasAddBtn={user?.role === "practitioner" && !isPharmacyOrLab}
      />
      {user?.role === "practitioner" && !isPharmacyOrLab && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <AddEncounterForm
            onSubmitSuccess={handleModalSuccess}
            onCancel={handleModalClose}
          />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default EncounterList;
