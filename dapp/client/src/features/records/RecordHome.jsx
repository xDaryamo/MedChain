// src/pages/RecordHome.js
import { useMedicalRecords } from "./useMedicalRecords";
import MedicalRecordList from "./MedicalRecordList";

const RecordHome = () => {
  const { records, recordsLoading, recordsError } = useMedicalRecords();


  return (
    <div>
      <h1>Medical Records</h1>
      {recordsLoading && <p>Loading...</p>}
      {recordsError && <p>Error: {recordsError.message}</p>}

      <MedicalRecordList records={records || []} />
    </div>
  );
};

export default RecordHome;
