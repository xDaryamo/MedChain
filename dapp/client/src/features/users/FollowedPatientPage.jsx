import { useParams, Link, Outlet } from "react-router-dom";
import { useGetPatient } from "./usePatients";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import { useUser } from "../authentication/useAuth";

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
  const { organization } = useUser();

  if (isPending) return <Spinner />;
  if (error) return <p>Errore nel caricamento dei dati del paziente</p>;

  const isPharmacy =
    organization?.toLowerCase().includes("pharmacy") ||
    organization?.toLowerCase().includes("farmacia");
  const isLab =
    organization?.toLowerCase().includes("laboratory") ||
    organization?.toLowerCase().includes("laboratorio");
  console.log(organization);
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <aside className="flex w-full flex-col bg-cyan-600 bg-opacity-50 p-4 text-white md:w-1/4">
        <h3 className="mt-2 text-xl font-bold text-cyan-800">Menu Paziente</h3>
        <nav className="mt-4 flex flex-col space-y-4">
          {!isPharmacy && !isLab && (
            <>
              <Link
                to={`/patients/${id}/records`}
                className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
              >
                Cartelle Cliniche
              </Link>
              <Link
                to={`/patients/${id}/labresults`}
                className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
              >
                Risultati Analisi
              </Link>
              <Link
                to={`/patients/${id}/encounters`}
                className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
              >
                Visite
              </Link>
              <Link
                to={`/patients/${id}/prescriptions`}
                className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
              >
                Prescrizioni
              </Link>
            </>
          )}
          {isPharmacy && (
            <Link
              to={`/patients/${id}/prescriptions`}
              className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
            >
              Prescrizioni
            </Link>
          )}
          {isLab && (
            <Link
              to={`/patients/${id}/labresults`}
              className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
            >
              Risultati Analisi
            </Link>
          )}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Heading>Dettagli del Paziente</Heading>
        <div className="mt-4 space-y-2">
          <div className="text-cyan-950">
            <span className="font-bold">Nome:</span> {patient.name.text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Data di Nascita:</span>{" "}
            {formatDate(patient.date)}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Genere:</span>{" "}
            {patient.gender.coding[0].display}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Stato Civile:</span>{" "}
            {patient.maritalstatus.text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Indirizzo:</span>{" "}
            {patient.address[0].text}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Contatto:</span>{" "}
            {patient.telecom[0].value}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Lingua:</span>{" "}
            {patient.communication[0].language.coding[0].display}
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default FollowedPatientPage;
