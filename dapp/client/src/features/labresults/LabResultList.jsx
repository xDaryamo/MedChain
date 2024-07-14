/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSearchLabResults } from "./useLabResults";
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
  const { labResults, isPending, error } = useSearchLabResults(query);
  console.log(labResults);
  const {
    user,
    isPending: userLoading,
    error: userError,
    organization,
  } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  const isHospitalOrLab =
    organization?.toLowerCase().includes("hospital") ||
    organization?.toLowerCase().includes("ospedale") ||
    organization?.toLowerCase().includes("laboratory") ||
    organization?.toLowerCase().includes("laboratorio");

  if (isPending || userLoading) return <Spinner />;
  if (error || userError) return <p>Error loading lab results or user data</p>;

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Heading>Lista Risultati di Laboratorio</Heading>
      <List
        items={labResults}
        itemKey="identifier"
        ItemComponent={LabResultCard}
        user={user}
        onAddNew={() => setModalOpen(true)}
        hasAddBtn={user.role === "practitioner" && isHospitalOrLab}
      />
      {user.role === "practitioner" && isHospitalOrLab && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <AddLabResultForm onSubmitSuccess={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default LabResultList;
