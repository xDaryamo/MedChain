import { useParams, useNavigate } from "react-router-dom";
import { useGetLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import { Link } from 'react-router-dom';
import Button from "../../ui/Button";

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const LabResultPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { labResult, isPending } = useGetLabResult(id);

    if (isPending || labResult === undefined) {
        return <Spinner />;
    }

    const renderLabResult = (labResult) => {
        return (
            <div>
                <div className="text-cyan-950">
                    <strong>ID:</strong> {labResult.identifier?.value || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Status:</strong> {labResult.status || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Category:</strong>{" "}
                    {labResult.category?.map((cat) => cat.text).join(", ") || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Code:</strong> {labResult.code?.text || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Subject:</strong> {labResult.subject?.reference || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Encounter:</strong> {labResult.encounter?.reference || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Effective Period:</strong>{" "}
                    {`${formatDate(labResult.effectivePeriod?.start)} to ${formatDate(
                        labResult.effectivePeriod?.end
                    )}`}
                </div>
                <div className="text-cyan-950">
                    <strong>Issued:</strong> {formatDate(labResult.issued)}
                </div>
                <div className="text-cyan-950">
                    <strong>Interpretation:</strong>{" "}
                    {labResult.interpretation?.map((interp) => interp.text).join(", ") || "N/A"}
                </div>
                <div className="text-cyan-950">
                    <strong>Note:</strong>{" "}
                    {labResult.note?.map((note) => note.text).join(", ") || "No Notes"}
                </div>
                <div className="text-cyan-950">
                    <strong>Components:</strong>{" "}
                    {labResult.components?.length > 0 ? (
                        labResult.components.map((component, index) => (
                            <div key={index}>
                                <p>Component {index + 1}</p>
                                <p>Code: {component.code?.text || "N/A"}</p>
                                <p>Value Quantity: {component.valueQuantity?.value || "N/A"}</p>
                                <p>Unit: {component.valueQuantity?.unit || "N/A"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No Components</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="flex items-center mb-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    Back
                </Button>
                <h1 className="ml-4 text-2xl font-bold">LabResult Details</h1>
            </div>
            <section className="mt-4 space-y-6">
                <div className="bg-white rounded shadow p-4">
                    <h2 className="text-xl font-bold mb-2">LabResult Information</h2>
                    {renderLabResult(labResult.labResult)}
                </div>
                <div className="flex space-x-4 mt-4">
                    <Link to={`/labresults/update/${id}`}>
                        <Button variant="secondary">Modifica</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LabResultPage;
