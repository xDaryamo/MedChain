import { useParams, Link, Outlet } from "react-router-dom";
import { useGetPatient } from "./usePatients";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Nascita Sconosciuta";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const FollowedPatientPage = () => {
  const { id } = useParams();
  const { patient, isPending, error } = useGetPatient(id);

  if (isPending) return <Spinner />;
  if (error) return <p>Error loading patient data</p>;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col bg-cyan-600 bg-opacity-50 p-4 text-white md:w-1/4">
        <h3 className="mt-2 text-xl font-bold text-cyan-800">Patient Menu</h3>
        <nav className="mt-4 flex flex-col space-y-4">
          <Link
            to={`/patients/${id}/records`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Medical Records
          </Link>
          <Link
            to={`lab-results`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Lab Results
          </Link>
          <Link
            to={`prescriptions`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Prescriptions
          </Link>
          <Link
            to={`allergies`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Allergies
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Heading>Patient Details</Heading>
        <div className="mt-4 space-y-2">
          <div>
            <strong>Name:</strong> {patient.name.text}
          </div>
          <div>
            <strong>Date of Birth:</strong> {formatDate(patient.date)}
          </div>
          <div>
            <strong>Gender:</strong> {patient.gender.coding[0].display}
          </div>
          <div>
            <strong>Marital Status:</strong> {patient.maritalstatus.text}
          </div>
          <div>
            <strong>Address:</strong> {patient.address[0].text}
          </div>
          <div>
            <strong>Contact:</strong> {patient.telecom[0].value}
          </div>
          <div>
            <strong>Language:</strong>{" "}
            {patient.communication[0].language.coding[0].display}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default FollowedPatientPage;
