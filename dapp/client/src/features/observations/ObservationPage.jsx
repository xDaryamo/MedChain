import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetObservation } from "./useObservations";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import UpdateObservationForm from "./UpdateObservationForm";

const ObservationPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { observation, isPending: isLoading } = useGetObservation(id);

    const handleUpdateObservation = () => {
        navigate(`/observation/${id}?edit=true`);
    };

    const showUpdateForm = new URLSearchParams(location.search).get("edit") === "true";

    const handleShowUpdateForm = () => {
        navigate(`${location.pathname}?edit=true`);
    };

    const handleHideUpdateForm = () => {
        navigate(location.pathname);
    };

    const itemText = (observation) => {
        const id = observation.id || "Unknown ID";
        const status = observation.status?.text || "Unknown Status";
        const category = observation.category?.text || "Unknown Category";
        const subject = observation.subject?.display || "Unknown Subject";
        const performer = observation.performer?.map((perf) => perf.display).join(", ") || "Unknown Performer";
        const value = observation.valueQuantity?.value || "Unknown Value";
        const unit = observation.valueQuantity?.unit || "Unknown Unit";
        const effectiveDateTime = observation.effectiveDateTime || "Unknown Date";

        return `
            ID: ${id}
            Status: ${status}
            Category: ${category}
            Subject: ${subject}
            Performer: ${performer}
            Value: ${value} ${unit}
            Date: ${effectiveDateTime}
        `;
    };

    if (isLoading) return <Spinner />;

    return (
        <div>
            <h1>Observation Details</h1>
            {observation ? (
                <div>
                    <p>{itemText(observation)}</p>
                    <Button onClick={handleShowUpdateForm}>Update Observation</Button>
                    {showUpdateForm && (
                        <UpdateObservationForm
                            observation={observation}
                            onUpdate={handleUpdateObservation}
                            onCancel={handleHideUpdateForm}
                        />
                    )}
                </div>
            ) : (
                <p>No observation found for the current ID.</p>
            )}
        </div>
    );
};

export default ObservationPage;
