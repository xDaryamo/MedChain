/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSearchMedicalRecords, useRemoveRecord } from "./useMedicalRecords";
import { useUser } from "../authentication/useAuth";
import { useGetPatient } from "../users/usePatients"; // Importa il hook per ottenere i dettagli del paziente

import Spinner from "../../ui/Spinner";
import List from "../../ui/List";
import AddMedicalRecordForm from "./AddMedicalRecordForm";
import Modal from "../../ui/Modal";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import MedicalRecordCard from "./MedicalRecordCard";
import { useParams } from "react-router-dom";

const MedicalRecordList = () => {
  const { id } = useParams();

  const defaultQuery = {
    query: {
      selector: {
        patientID: `${id}`,
      },
    },
  };

  const [query, setQuery] = useState(defaultQuery);

  const { records = [], isPending, error } = useSearchMedicalRecords(query);
  const { user, isPending: userLoading, error: userError } = useUser();
  const {
    patient,
    isPending: patientLoading,
    error: patientError,
  } = useGetPatient(id);

  const [isModalOpen, setModalOpen] = useState(false);

  if (error || userError || patientError)
    return <p>Error loading medical records or user data</p>;

  if (isPending || userLoading || patientLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Heading>Lista Cartelle Cliniche</Heading>

      <List
        items={records}
        itemKey="identifier"
        ItemComponent={MedicalRecordCard}
        user={user}
        patient={patient}
        onAddNew={() => setModalOpen(true)}
        hasAddBtn={true}
      />

      {user.role === "practitioner" && (
        <Modal isOpen={isModalOpen} onClose={handleModalClose}>
          <AddMedicalRecordForm onSubmitSuccess={handleModalClose} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default MedicalRecordList;
