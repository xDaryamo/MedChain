/* eslint-disable no-unused-vars */
import { useGetFollowedPatients } from "./usePractitioner";
import Spinner from "../../ui/Spinner";
import List from "../../ui/List";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import PatientCard from "./PatientCard";
import { useUser } from "../authentication/useAuth";

const FollowedPatientsList = () => {
  const { followedPatients = [], isPending, error } = useGetFollowedPatients();
  const { user, isPending: userLoading, error: userError } = useUser();

  if (isPending) return <Spinner />;
  if (error) return <p>Error loading followed patients data</p>;

  return (
    <div>
      <Heading>Followed Patients List</Heading>
      <List
        items={followedPatients}
        itemKey="id"
        ItemComponent={PatientCard}
        user={user}
        hasAddBtn={false}
      />
      <Toaster />
    </div>
  );
};

export default FollowedPatientsList;
