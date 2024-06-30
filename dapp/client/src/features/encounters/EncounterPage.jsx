import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import UpdateEncounterForm from "./UpdateEncounterForm";

const EncounterPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { encounter, isPending: isLoading } = useGetEncounter(id);

    const handleUpdateEncounter = async () => {
        navigate(`/encounter/${id}`);
    };

    const showUpdateForm =
        new URLSearchParams(location.search).get("edit") === "true";

    const handleShowUpdateForm = () => {
        navigate(`${location.pathname}?edit=true`);
    };

    const handleHideUpdateForm = () => {
        navigate(location.pathname);
    };

    const itemText = (encounter) => {
        const id = encounter.id || "Unknown ID";
        const status = encounter.status?.text || "Unknown Status";
        const type = encounter.type?.map((type) => type.text).join(", ") || "Unknown Type";
        const classType = encounter.class?.text || "Unknown Class";
        const subject = encounter.subject?.display || "Unknown Subject";
        const serviceProvider = encounter.serviceProvider?.display || "Unknown Service Provider";
        const reason = encounter.reasonCode?.text || "Unknown Reason";
        const location = encounter.location?.map((loc) => loc.name).join(", ") || "Unknown Location";
        const diagnosis = encounter.diagnosis?.map((diag) => diag.condition?.display).join(", ") || "Unknown Diagnosis";

        // Format period start and end if available
        let period = "Unknown Period";
        if (encounter.period?.start && encounter.period?.end) {
            period = `${encounter.period.start} to ${encounter.period.end}`;
        } else if (encounter.period?.start) {
            period = `From ${encounter.period.start}`;
        } else if (encounter.period?.end) {
            period = `Until ${encounter.period.end}`;
        }

        return `
            ID: ${id}
            Status: ${status}
            Type: ${type}
            Class: ${classType}
            Subject: ${subject}
            Service Provider: ${serviceProvider}
            Reason: ${reason}
            Location: ${location}
            Diagnosis: ${diagnosis}
            Period: ${period}
        `;
    };


    if (isLoading) return <Spinner />;

    return (
        <div>
            <h1>Encounter Details</h1>
            {encounter ? (
                <div>
                    <p>{itemText(encounter)}</p>
                    <Button onClick={handleShowUpdateForm}>Update Encounter</Button>
                    {showUpdateForm && (
                        <UpdateEncounterForm
                            encounter={encounter}
                            onUpdate={handleUpdateEncounter}
                            onCancel={handleHideUpdateForm}
                        />
                    )}
                </div>
            ) : (
                <p>No encounter found for the current ID.</p>
            )}
        </div>
    );
};

export default EncounterPage;
