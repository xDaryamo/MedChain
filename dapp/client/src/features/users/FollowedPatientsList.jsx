/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useGetFollowedPatients } from "./usePractitioner";
import Spinner from "../../ui/Spinner";
import List from "../../ui/List";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import PatientCard from "./PatientCard";
import { useUser } from "../authentication/useAuth";
import AddPatientModal from "./AddPatientModal"; // Import the new modal
import Button from "../../ui/Button"; // Assicurati di importare il tuo componente Button

const FollowedPatientsList = () => {
  const { followedPatients = [], isPending, error } = useGetFollowedPatients();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isPending || userLoading) return <Spinner />;
  if (error || userError) return <p>Error loading followed patients data</p>;

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleAddNew = () => {
    setModalOpen(true);
  };

  return (
    <div>
      <Heading>Lista Pazienti</Heading>
      {followedPatients.length === 0 ? (
        <div className="flex justify-center">
          <Button onClick={handleAddNew} variant="add" size="add">
            +
          </Button>
        </div>
      ) : (
        <List
          items={followedPatients}
          itemKey="identifier.value"
          ItemComponent={PatientCard}
          user={user}
          hasAddBtn={true}
          onAddNew={handleAddNew}
        />
      )}
      <AddPatientModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        followedPatients={followedPatients}
      />
    </div>
  );
};

export default FollowedPatientsList;
