// pages/UserProfile.jsx
import { Link, Outlet } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import { useGetPatient } from "../users/usePatients";
import { useGetPractitioner } from "../users/usePractitioner";
import SidebarMenu from "../../ui/SidebarMenu";
import Spinner from "../../ui/Spinner";
import Heading from "../../ui/Heading";
import PractitionerProfile from "./PractitionerProfile";
import PatientProfile from "./PatientProfile";

const UserProfile = () => {
  const { user, isPending: userLoading } = useUser();
  const id = user?.userId;

  const {
    patient,
    isPending: patientLoading,
    error: patientError,
  } = useGetPatient(user?.role === "patient" ? id : null);

  const {
    practitioner,
    isPending: practitionerLoading,
    error: practitionerError,
  } = useGetPractitioner(user?.role === "practitioner" ? id : null);

  const isLoading =
    userLoading ||
    (user?.role === "patient" && patientLoading) ||
    (user?.role === "practitioner" && practitionerLoading);
  const isError = patientError || practitionerError;

  if (isLoading) return <Spinner />;
  if (isError) return <p>Errore nel caricamento dei dati utente</p>;

  const profileData = user?.role === "patient" ? patient : practitioner;
  console.log(patient);

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <SidebarMenu userRole={user?.role} userId={id}>
        <Link
          to={`/profile`}
          className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
        >
          Informazioni Utente
        </Link>
        <Link
          to={`/profile/edit-credentials`}
          className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
        >
          Modifica Credenziali
        </Link>
        {user?.role === "patient" ? (
          <>
            <Link
              to={`/profile/patients/edit-details`}
              className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
            >
              Modifica Dettagli
            </Link>
            <Link
              to={`/patients/manage-auth`}
              className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
            >
              Gestisci Autorizzazioni
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/profile/practitioners/edit-details`}
              className="rounded p-2 text-stone-800 transition-all duration-300 hover:bg-gray-700 hover:text-white"
            >
              Modifica Dettagli
            </Link>
          </>
        )}
      </SidebarMenu>
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <Heading>Dettagli Utente</Heading>
        <div className="mt-4 space-y-2">
          <div className="text-cyan-950">
            <span className="font-bold">Nome Utente:</span> {user?.username}
          </div>
          <div className="text-cyan-950">
            <span className="font-bold">Email:</span> {user?.email}
          </div>

          {user?.role === "patient" ? (
            <PatientProfile patient={profileData} />
          ) : (
            <PractitionerProfile practitioner={profileData} />
          )}
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default UserProfile;
