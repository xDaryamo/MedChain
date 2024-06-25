import { useSearchMedicalRecords } from "./useMedicalRecords";
import MedicalRecordList from "./MedicalRecordList";
import Spinner from "../../ui/Spinner";

const RecordHome = () => {
  const { isPending, records } = useSearchMedicalRecords();
  if (isPending) return <Spinner />;

  return (
    <div>
      <MedicalRecordList records={records || []} />
    </div>
  );
};

export default RecordHome;
