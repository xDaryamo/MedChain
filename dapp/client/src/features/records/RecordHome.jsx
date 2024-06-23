import { useMedicalRecords } from "./useMedicalRecords";
import MedicalRecordList from "./MedicalRecordList";
import Spinner from "../../Spinner";

const RecordHome = () => {
  const { records, recordsLoading, recordsError } = useMedicalRecords();

  return (
    <div>
      <h1>Medical Records</h1>
      {recordsLoading && <Spinner />}
      {recordsError && <p>Error: {recordsError.message}</p>}

      <MedicalRecordList records={records || []} />
    </div>
  );
};

export default RecordHome;
