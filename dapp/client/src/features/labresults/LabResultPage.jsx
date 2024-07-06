import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useGetLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import UpdateLabResultForm from "./UpdateLabResultForm";

const LabResultPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const { LabResult, isPending: isLoading } = useGetLabResult(id);

    const handleUpdateLabResult = async () => {
        navigate(`/labresults/${id}`);
    };

    const showUpdateForm =
        new URLSearchParams(location.search).get("edit") === "true";

    const handleShowUpdateForm = () => {
        navigate(`${location.pathname}?edit=true`);
    };

    const handleHideUpdateForm = () => {
        navigate(location.pathname);
    };

    const itemText = (LabResult) => {
        const id = LabResult.id || "Unknown ID";
        const status = LabResult.status || "Unknown Status";
        const category = LabResult.category?.map((cat) => cat.text).join(", ") || "Unknown Category";
        const code = LabResult.code?.text || "Unknown Code";
        const subject = LabResult.subject?.reference || "Unknown Subject";
        const encounter = LabResult.encounter?.reference || "Unknown Encounter";
        const effectivePeriodStart = LabResult.effectivePeriod?.start || "Unknown Start Date";
        const effectivePeriodEnd = LabResult.effectivePeriod?.end || "Unknown End Date";
        const issued = LabResult.issued || "Unknown Issued Date";
        const interpretation = LabResult.interpretation?.map((interp) => interp.text).join(", ") || "Unknown Interpretation";
        const notes = LabResult.note?.map((note) => note.text).join(", ") || "No Notes";
        const components = LabResult.component?.map((comp) => comp.code?.text).join(", ") || "No Components";

        return `ID: ${id} - Status: ${status} - Category: ${category} - Code: ${code} - Subject: ${subject} - Encounter: ${encounter} - Effective Period: ${effectivePeriodStart} to ${effectivePeriodEnd} - Issued: ${issued} - Interpretation: ${interpretation} - Notes: ${notes} - Components: ${components}`;
    };

    if (isLoading) return <Spinner />;

    return (
        <div>
            <h1>LabResult Details</h1>
            {LabResult ? (
                <div>
                    <p>{itemText(LabResult)}</p>
                    <Button onClick={handleShowUpdateForm}>Update LabResult</Button>
                    {showUpdateForm && (
                        <UpdateLabResultForm
                            LabResult={LabResult}
                            onUpdate={handleUpdateLabResult}
                            onCancel={handleHideUpdateForm}
                        />
                    )}
                </div>
            ) : (
                <p>No LabResult found for the current ID.</p>
            )}
        </div>
    );
};

export default LabResultPage;
