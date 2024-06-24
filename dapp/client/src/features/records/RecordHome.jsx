import { useGetMedicalRecords } from "./useMedicalRecords";
import MedicalRecordList from "./MedicalRecordList";
import Spinner from "../../ui/Spinner";

const RecordHome = () => {
  const { records, recordsLoading, recordsError } = useGetMedicalRecords();

  return (
    <div>
      {recordsLoading && <Spinner />}
      {recordsError && <p>Error: {recordsError.message}</p>}

      <MedicalRecordList records={records || []} />
    </div>
  );
};

export default RecordHome;
