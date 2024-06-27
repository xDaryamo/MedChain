import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetMedicalRecord } from "./useMedicalRecords";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import UpdateMedicalRecordForm from "./UpdateMedicalRecordForm";

const RecordPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { record, isPending: isLoading } = useGetMedicalRecord(id);

  const handleUpdateRecord = async () => {
    navigate(`/records/${id}`);
  };

  const showUpdateForm =
    new URLSearchParams(location.search).get("edit") === "true";

  const handleShowUpdateForm = () => {
    navigate(`${location.pathname}?edit=true`);
  };

  const handleHideUpdateForm = () => {
    navigate(location.pathname);
  };

  const itemText = (item) => {
    console.log(item);
    const id = item.identifier;
    const patientID = item.patientID || "Unknown Patient ID";
    const conditions = item.conditions?.length || "No Conditions";
    const procedures = item.procedures?.length || "No Procedures";
    return `ID: ${id} - Patient ID: ${patientID} - Conditions: ${conditions} - Procedures: ${procedures}`;
  };

  if (isLoading) return <Spinner />;

  return (
    <div>
      <h1>Medical Record Details</h1>
      {record ? (
        <div>
          <p>{itemText(record)}</p>
          <Button onClick={handleShowUpdateForm}>Update Record</Button>
          {showUpdateForm && (
            <UpdateMedicalRecordForm
              record={record}
              onUpdate={handleUpdateRecord}
              onCancel={handleHideUpdateForm}
            />
          )}
        </div>
      ) : (
        <p>No record found for current user.</p>
      )}
    </div>
  );
};

export default RecordPage;
