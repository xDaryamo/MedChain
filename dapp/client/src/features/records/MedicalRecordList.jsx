import { useState } from "react";
import { useSearchMedicalRecords, useRemoveRecord } from "./useMedicalRecords";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddMedicalRecordForm from "./AddMedicalRecordForm";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

const MedicalRecordList = () => {
  const { records = [], isPending, error } = useSearchMedicalRecords();
  const { removeRecord, isPending: isDeleting } = useRemoveRecord();
  const { user, isPending: userLoading, error: userError } = useUser();
  const [isModalOpen, setModalOpen] = useState(false);

  if (isPending || userLoading) return <Spinner />;
  if (error || userError)
    return <p>Error loading medical records or user data</p>;

  const handleRemoveRecord = async (id) => {
    await removeRecord(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const itemText = (item) => {
    const id = item.identifier;
    const patientID = item.patientID || "Unknown Patient ID";
    const conditions = item.conditions?.length || "No Conditions";
    const procedures = item.procedures?.length || "No Procedures";
    return `ID: ${id} - Patient ID: ${patientID} - Conditions: ${conditions} - Procedures: ${procedures}`;
  };

  return (
    <div>
      <h1>Medical Records List</h1>
      <List
        items={records}
        itemKey="identifier"
        itemLink="/records"
        itemText={itemText}
        onDelete={handleRemoveRecord}
        isDeleting={isDeleting}
        user={user}
      />
      {user.role === "practitioner" && (
        <>
          <Button onClick={() => setModalOpen(true)}>Add New Record</Button>
          <Modal isOpen={isModalOpen} onClose={handleModalClose}>
            <AddMedicalRecordForm onSubmitSuccess={handleModalClose} />
          </Modal>
        </>
      )}
    </div>
  );
};

export default MedicalRecordList;
