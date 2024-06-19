import { useMedicalRecords } from "../hooks/useMedicalRecords";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Button from "../../ui/components/Button";

const MedicalRecordList = () => {
  const { records, recordsLoading, recordsError } = useMedicalRecords();
  const userRole = useSelector((state) => state.user.role); // Assume 'role' can be 'patient' or 'practitioner'

  if (recordsLoading) return <div>Loading...</div>;
  if (recordsError) return <div>Error loading medical records</div>;

  return (
    <div>
      <h1>Medical Records</h1>
      {userRole === "practitioner" && (
        <Link to="/medical-records/new">
          <Button type="primary">Add New Record</Button>
        </Link>
      )}
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            <Link to={`/medical-records/${record.id}`}>
              {record.type.text} - {record.date}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicalRecordList;
