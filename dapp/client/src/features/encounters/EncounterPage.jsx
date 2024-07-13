import { useParams, useNavigate } from "react-router-dom";
import { useGetEncounter, useRemoveEncounter } from "./useEncounters";
import Spinner from "../../ui/Spinner";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { FaTrash } from "react-icons/fa";

const formatDate = (dateString) => {
    if (!dateString) return "N/D";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
};

const EncounterPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { isPending, encounter, error, refetch } = useGetEncounter(id);

    const { removeEncounter, isPending: deletePending } = useRemoveEncounter();

    useEffect(() => {
        refetch();
    }, [id]);

    const handleDeleteEncounter = () => {
        if (window.confirm("Sei sicuro di voler eliminare questo incontro?")) {
            removeEncounter(id, {
                onSuccess: () => {
                    navigate(-2);
                },
            });
        }
    };

    const renderSingleOrList = (title, list, renderItem) => {
        if (!list || list.length === 0) {
            return (
                <div className="text-cyan-950">
                    <span className="font-bold">{title}:</span> N/D
                </div>
            );
        }
        if (list.length === 1) {
            return (
                <div className="text-cyan-950">
                    <span className="font-bold">{title}:</span> {renderItem(list[0])}
                </div>
            );
        }
        return (
            <div className="text-cyan-950">
                <h3 className="font-bold">{title}:</h3>
                <ul className="ml-4 list-disc">
                    {list.map((item, index) => (
                        <li key={index} className="mb-1 ml-4">
                            {renderItem(item)}
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderReason = (reason) => reason.reasonReference?.reference || "N/D";

    const renderDiagnosis = (diag) => diag.condition?.reference || "N/D";

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div>
                <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
            </div>
            <Heading>Dettagli dell'Incontro</Heading>
            {isPending || !encounter ? (
                <Spinner />
            ) : error ? (
                <p>Errore durante il caricamento dell'incontro</p>
            ) : (
                <section className="mt-4 space-y-6">
                    <div className="rounded bg-white p-4 shadow">
                        <h2 className="mb-2 text-xl font-bold">Informazioni dell'Incontro</h2>
                        <div className="text-cyan-950">
                            <strong>ID:</strong> {encounter.encounter.identifier?.value || "N/D"}
                        </div>
                        <div className="text-cyan-950">
                            <strong>Stato:</strong> {encounter.encounter.status?.coding?.[0]?.code || "N/D"}
                        </div>
                        {renderSingleOrList("Motivo", encounter.encounter.reasonReference, renderReason)}
                        <div className="text-cyan-950">
                            <strong>Soggetto:</strong> {encounter.encounter.subject?.reference || "N/D"}
                        </div>
                        <div className="text-cyan-950">
                            <strong>Periodo:</strong>{" "}
                            {`${formatDate(encounter.encounter.period?.start)} - ${formatDate(encounter.encounter.period?.end)}`}
                        </div>
                        <div className="text-cyan-950">
                            <strong>Lista delle Diagnosi:</strong>{" "}
                            {renderSingleOrList("Diagnosi", encounter.encounter.diagnosis, renderDiagnosis)}
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-4">
                        <Link to={`/encounters/update/${id}`} className="mt-4 flex w-full justify-center space-x-4">
                            <Button variant="secondary">Modifica</Button>
                        </Link>
                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="delete"
                                onClick={() => handleDeleteEncounter()}
                                size="small"
                            >
                                <FaTrash />
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default EncounterPage;
