import { useMedicalRecords } from "./useMedicalRecords";
import { Link } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import { toast } from "react-hot-toast";
import MedicalRecordForm from "./MedicalRecordForm";
import Spinner from "../../Spinner";
import Button from "../../Button";

const MedicalRecordList = () => {
  const { records, recordsLoading, recordsError, addRecordMutation, removeRecordMutation } = useMedicalRecords();
  const { user, isPending: userLoading, error: userError } = useUser();

  if (recordsLoading || userLoading) return <Spinner />;
  if (recordsError || userError) return <div>Error loading medical records or user data</div>;

  const userRole = user.role;

  const handleAddRecord = async (record) => {
    try {
      await addRecordMutation.mutateAsync(record);
      toast.success("Medical record added successfully");
    } catch (error) {
      toast.error("Failed to add medical record");
      console.error("Add medical record error", error);
    }
  };

  const handleRemoveRecord = async (id) => {
    try {
      await removeRecordMutation.mutateAsync(id);
      toast.success("Medical record deleted successfully");
    } catch (error) {
      toast.error("Failed to delete medical record");
      console.error("Delete medical record error", error);
    }
  };

  return (
    <div>
      <h1>Medical Records</h1>
      {userRole === "practitioner" && <MedicalRecordForm onSubmit={handleAddRecord} />}
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <Link to={`/records/${record.id}`}>
              {record.type.text} - {record.date}
            </Link>
            {userRole === "practitioner" ? (
              <Button onClick={() => handleRemoveRecord(record.id)}>Delete</Button>
            ) : (
              user.id === record.patientId && <p>You can only view your own records</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecordList;
