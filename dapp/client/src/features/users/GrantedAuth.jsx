import { useRevokeAccess, useGetAccessRequests } from "../users/usePatients";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import { FaTrashAlt } from "react-icons/fa"; // Ensure you have react-icons installed

const GrantedAuth = () => {
  const { revokeAccess, isPending: isRevoking } = useRevokeAccess();
  const { grantedRequests, isPending, refetch } = useGetAccessRequests();

  if (isPending) return <Spinner />;

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
        {grantedRequests.map((request) => (
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
            <Button
              variant="delete"
              size="small"
              onClick={() => handleRevokeAccess(request.practitionerId)}
              disabled={isRevoking}
            >
              {isRevoking ? <Spinner /> : <FaTrashAlt />}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GrantedAuth;
