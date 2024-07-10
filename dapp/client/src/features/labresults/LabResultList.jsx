import { useState } from "react";
import { useSearchLabResults, useDeleteLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import LabResultCard from "./LabResultCard";
import AddLabResultForm from "./AddLabResultForm";
import { useParams } from "react-router-dom";

const LabResultList = () => {

  const { id } = useParams();

  const defaultQuery = {
    query: {
      selector: {
        "subject.reference": `${id}`,
      },
    },
  };

  const [query, setQuery] = useState(defaultQuery);
  const { labResults = [], isPending, error } = useSearchLabResults(query);

  const { mutate: deleteLabResult, isPending: isDeleting } = useDeleteLabResult();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isPending || userLoading) return <Spinner />;
  if (error || userError) return <p>Error loading lab results or user data</p>;

  const handleDelete = async (id) => {
    try {
      await deleteLabResult(id);
    } catch (error) {
      console.error("Delete lab result error", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Heading>Lab Results List</Heading>
      <List
        items={labResults}
        itemKey="id"
        ItemComponent={LabResultCard}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        user={user}
        onAddNew={() => setModalOpen(true)}
        hasAddBtn={true}
      />
      {user.role === "practitioner" && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <AddLabResultForm onSubmitSuccess={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default LabResultList;
