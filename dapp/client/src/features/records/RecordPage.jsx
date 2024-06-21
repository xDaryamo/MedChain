// src/pages/RecordPage.js
import { useParams } from "react-router-dom";
import { useMedicalRecords } from "./useMedicalRecords";
import MedicalRecordDetails from "./MedicalRecordDetails";
import MedicalRecordForm from "./MedicalRecordForm";

const RecordPage = () => {
  const { id } = useParams();
  const { useFetchRecord, modifyRecordMutation } = useMedicalRecords();
  const { data: record, isLoading, error } = useFetchRecord(id);

  const handleModifyRecord = async (data) => {
    await modifyRecordMutation.mutateAsync({ id, record: data });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <MedicalRecordDetails record={record} />
      <MedicalRecordForm onSubmit={handleModifyRecord} record={record} />
    </div>
  );
};

export default RecordPage;
