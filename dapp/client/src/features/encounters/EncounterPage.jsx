import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";

const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00Z") return "Data Sconosciuta";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const EncounterPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { encounter, isPending: isLoading } = useGetEncounter(id);

    const renderEncounter = (encounter) => {
        const id = encounter.id || "Unknown ID";
        const status = encounter.status || "Unknown Status";
        const type = encounter.type?.map((type) => type.coding[0].display).join(", ") || "Unknown Type";
        const classType = encounter.class?.text || "Unknown Class";
        const subject = encounter.subject?.display || "Unknown Subject";
        const serviceProvider = encounter.serviceProvider?.display || "Unknown Service Provider";
        const reason = encounter.reasonCode?.map((reason) => reason.coding[0].display).join(", ") || "Unknown Reason";
        const location = encounter.location?.map((loc) => loc.location?.display).join(", ") || "Unknown Location";
        const diagnosis = encounter.diagnosis?.map((diag) => diag.condition?.display).join(", ") || "Unknown Diagnosis";

        let period = "Unknown Period";
        if (encounter.period?.start && encounter.period?.end) {
            period = `${formatDate(encounter.period.start)} to ${formatDate(encounter.period.end)}`;
        } else if (encounter.period?.start) {
            period = `From ${formatDate(encounter.period.start)}`;
        } else if (encounter.period?.end) {
            period = `Until ${formatDate(encounter.period.end)}`;
        }

        return (
            <div>
                <div><strong>ID:</strong> {id}</div>
                <div><strong>Status:</strong> {status}</div>
                <div><strong>Type:</strong> {type}</div>
                <div><strong>Class:</strong> {classType}</div>
                <div><strong>Subject:</strong> {subject}</div>
                <div><strong>Service Provider:</strong> {serviceProvider}</div>
                <div><strong>Reason:</strong> {reason}</div>
                <div><strong>Location:</strong> {location}</div>
                <div><strong>Diagnosis:</strong> {diagnosis}</div>
                <div><strong>Period:</strong> {period}</div>
            </div>
        );
    };

    if (isLoading || !encounter) return <Spinner />;

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="flex items-center mb-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
                <h1 className="ml-4 text-2xl font-bold">Encounter Details</h1>
            </div>
            <section className="mt-4 space-y-6">
                <div className="bg-white rounded shadow p-4">
                    {renderEncounter(encounter)}
                </div>
                <div className="flex space-x-4 mt-4">
                    <Link to={`/encounters/update/${id}`}>
                        <Button variant="secondary">Edit</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default EncounterPage;
