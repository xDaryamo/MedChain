import { useSearchLabResults, useDeleteLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import { useUser } from "../authentication/useAuth";
import List from "../../ui/List";

const LabResultList = () => {
  const { labResults = [], isPending, error } = useSearchLabResults();
  const { deleteLabResult, isPending: isDeleting } = useDeleteLabResult();
  const { user, isPending: userLoading, error: userError } = useUser();

  if (isPending || userLoading) return <Spinner />;
  if (error || userError) return <p>Error loading lab results or user data</p>;

  const handleDelete = async (id) => {
    try {
      await deleteLabResult(id);
    } catch (error) {
      console.error("Delete lab result error", error);
    }
  };

  return (
    <List
      items={labResults}
      itemKey="id"
      itemLink="/labresults"
      itemText={(item) => `${item.code.text} - ${item.date}`}
      onDelete={handleDelete}
      isDeleting={isDeleting}
      user={user}
    />
  );
};

export default LabResultList;
