/* eslint-disable no-unused-vars */
import { useGetFollowedPatients } from "./usePractitioner";
import Spinner from "../../ui/Spinner";
import List from "../../ui/List";
import Heading from "../../ui/Heading";
import { Toaster } from "react-hot-toast";
import PatientCard from "./PatientCard";

const FollowedPatientsList = () => {
  const { followedPatients = [], isPending, error } = useGetFollowedPatients();

  if (isPending) return <Spinner />;
  if (error) return <p>Error loading followed patients data</p>;

  return (
    <div>
      <Heading>Followed Patients List</Heading>
      {/* <List items={followedPatients} itemKey="id" ItemComponent={PatientCard} />
      <Toaster /> */}
    </div>
  );
};

export default FollowedPatientsList;
