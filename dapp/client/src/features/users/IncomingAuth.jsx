import {
  useGetAccessRequests,
  useGrantAccess,
  useRevokeAccess,
} from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import { FaCheck, FaTrashAlt } from "react-icons/fa"; // Ensure you have react-icons installed
import toast from "react-hot-toast";

const IncomingAuth = () => {
  const { grantAccess, isPending: isGranting } = useGrantAccess();
  const { revokeAccess, isPending: isRevoking } = useRevokeAccess();
  const { pendingRequests, isPending, refetch } = useGetAccessRequests();

  if (isPending) return <Spinner />;

  const handleGrantAccess = (practitionerId) => {
    grantAccess(practitionerId, {
      onSuccess: () => {
        toast.success("Access granted successfully");
        refetch();
      },
    });
  };

  const handleRevokeAccess = (practitionerId) => {
    revokeAccess(practitionerId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {pendingRequests.map((request) => (
          <li
            key={request.practitionerId}
            className="flex items-center justify-between rounded-md border p-2 shadow-sm"
          >
            <div>
              <h3 className="text-lg font-semibold">
                {request.details.name[0].text}
              </h3>
              <p className="text-sm text-gray-600">
                ID: {request.practitionerId}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="small"
                onClick={() => handleGrantAccess(request.practitionerId)}
                disabled={isGranting}
              >
                {isGranting ? <Spinner /> : <FaCheck />}
              </Button>
              <Button
                variant="delete"
                size="small"
                onClick={() => handleRevokeAccess(request.practitionerId)}
                disabled={isRevoking}
              >
                {isRevoking ? <Spinner /> : <FaTrashAlt />}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncomingAuth;
