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
            to={`/patients/${id}/labresults`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Lab Results
          </Link>
          <Link
            to={`/patients/${id}/prescriptions`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Prescriptions
          </Link>
          <Link
            to={`/patients/${id}/allergies`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Allergies
          </Link>
          <Link
            to={`/patients/${id}/encounters`}
            className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
          >
            Encounters
          </Link>

        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Heading>Patient Details</Heading>
        <div className="mt-4 space-y-2">
          <div className="text-cyan-950">
            <span className="font-bold">Name:</span> {patient.name.text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Date of Birth:</span>{" "}
            {formatDate(patient.date)}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Gender:</span>{" "}
            {patient.gender.coding[0].display}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Marital Status:</span>{" "}
            {patient.maritalstatus.text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Address:</span>{" "}
            {patient.address[0].text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Contact:</span>{" "}
            {patient.telecom[0].value}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Language:</span>{" "}
            {patient.communication[0].language.coding[0].display}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default FollowedPatientPage;
