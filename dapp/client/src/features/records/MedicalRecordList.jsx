/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useSearchMedicalRecords, useRemoveRecord } from "./useMedicalRecords";
import { useUser } from "../authentication/useAuth";

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
  const { removeRecord, isPending: isDeleting } = useRemoveRecord();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  if (error || userError)
    return <p>Error loading medical records or user data</p>;

  const handleRemoveRecord = async (id) => {
    await removeRecord(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <div>
      <Heading>Medical Records List</Heading>

      {isPending ? (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <List
          items={records}
          itemKey="identifier"
          ItemComponent={MedicalRecordCard}
          onDelete={handleRemoveRecord}
          isDeleting={isDeleting}
          user={user}
          onAddNew={() => setModalOpen(true)}
          hasAddBtn={true}
        />
      )}

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
