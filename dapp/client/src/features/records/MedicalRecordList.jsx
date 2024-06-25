import { useSearchMedicalRecords, useRemoveRecord } from "./useMedicalRecords";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";
import AddMedicalRecordForm from "./AddMedicalRecordForm";

const MedicalRecordList = () => {
  const { records = [], isPending, error } = useSearchMedicalRecords();
  const { removeRecord, isPending: isDeleting } = useRemoveRecord();
  const { user, isPending: userLoading, error: userError } = useUser();

  if (isPending || userLoading) return <Spinner />;
  if (error || userError)
    return <p>Error loading medical records or user data</p>;

  const handleRemoveRecord = async (id) => {
    await removeRecord(id);
  };

  return (
    <div>
      <h1>Medical Records List</h1>
      {user.role === "practitioner" && <AddMedicalRecordForm />}
      <List
        items={records}
        itemKey="id"
        itemLink="/records"
        itemText={(item) => `${item.type.text} - ${item.date}`}
        onDelete={handleRemoveRecord}
        isDeleting={isDeleting}
        user={user}
      />
    </div>
  );
};

export default MedicalRecordList;
