import {
  useGetMedicalRecords,
  useAddRecord,
  useRemoveRecord,
} from "./useMedicalRecords";
import { Link } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import MedicalRecordForm from "./MedicalRecordForm";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";

const MedicalRecordList = () => {
  const {
    records = [], // Initialize records to an empty array if undefined
    isPending: recordsLoading,
    error: recordsError,
  } = useGetMedicalRecords();
  const { addRecord } = useAddRecord();
  const { removeRecord, isPending: removeRecordLoading } = useRemoveRecord();
  const { user, isPending: userLoading, error: userError } = useUser();

  if (recordsLoading || userLoading) return <Spinner />;
  if (recordsError || userError)
    return <div>Error loading medical records or user data</div>;

  const userRole = user.role;

  const handleAddRecord = async (record) => {
    try {
      await addRecord(record);
    } catch (error) {
      console.error("Add medical record error", error);
    }
  };

  const handleRemoveRecord = async (id) => {
    try {
      await removeRecord(id);
    } catch (error) {
      console.error("Delete medical record error", error);
    }
  };

  return (
    <div>
      <h1>Medical Records</h1>
      {userRole === "practitioner" && (
        <MedicalRecordForm onSubmit={handleAddRecord} />
      )}
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <Link to={`/records/${record.id}`}>
              {record.type.text} - {record.date}
            </Link>
            {userRole === "practitioner" ? (
              <Button
                onClick={() => handleRemoveRecord(record.id)}
                disabled={removeRecordLoading}
              >
                Delete
              </Button>
            ) : (
              user.id === record.patientId && (
                <p>You can only view your own records</p>
              )
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecordList;
