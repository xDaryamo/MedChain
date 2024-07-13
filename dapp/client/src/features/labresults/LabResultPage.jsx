import { useParams, useNavigate } from "react-router-dom";
import { useGetLabResult } from "./useLabResults";
import Spinner from "../../ui/Spinner";
import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import Heading from "../../ui/Heading";
import BackButton from "../../ui/BackButton";
import { useEffect } from "react";

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const LabResultPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    labResult,
    isPending: labResultLoading,
    error: labResultError,
    refetch: refetchLabResult,
  } = useGetLabResult(id);

  useEffect(() => {
    refetchLabResult();
  }, [id]);

  if (labResultLoading || labResult === undefined) {
    return <Spinner />;
  }
  if (labResultError) return <p>Error loading lab result</p>;

  const renderSingleOrList = (title, list, renderItem) => {
    if (!list || list.length === 0) {
      return (
        <div className="text-cyan-950">
          <span className="font-bold">{title}:</span> N/A
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

  const renderCategory = (category) => category.coding?.[0]?.display || "N/A";
  const renderInterpretation = (interpretation) =>
    interpretation.coding?.[0]?.display || "N/A";
  const renderNote = (note) => note.text || "N/A";
  const renderComponent = (component) =>
    `${component.code?.text || "N/A"}, ${component.valueQuantity?.value || "N/A"}, ${component.valueQuantity?.unit || "N/A"}`;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <Heading>Dettagli del Risultato di Laboratorio</Heading>
      <section className="mt-4 space-y-6">
        <div className="rounded bg-white p-4 shadow">
          <h2 className="mb-2 text-xl font-bold">
            Informazioni del Risultato di Laboratorio
          </h2>
          <div className="text-cyan-950">
            <strong>ID:</strong> {labResult.identifier?.value || "N/A"}
          </div>
          <div className="text-cyan-950">
            <strong>Status:</strong> {labResult.status || "N/A"}
          </div>
          {renderSingleOrList("Categoria", labResult.category, renderCategory)}
          <div className="text-cyan-950">
            <strong>Codice:</strong> {labResult.code?.text || "N/A"}
          </div>
          <div className="text-cyan-950">
            <strong>Periodo di Validità:</strong>{" "}
            {`${formatDate(labResult.effectivePeriod?.start)} to ${formatDate(
              labResult.effectivePeriod?.end,
            )}`}
          </div>
          <div className="text-cyan-950">
            <strong>Data di Emissione:</strong> {formatDate(labResult.issued)}
          </div>
          {renderSingleOrList(
            "Interpretazione",
            labResult.interpretation,
            renderInterpretation,
          )}
          {renderSingleOrList("Nota", labResult.note, renderNote)}
          {renderSingleOrList(
            "Componente",
            labResult.component,
            renderComponent,
          )}
        </div>
        <Link
          to={`/labresults/update/${id}`}
          className="mt-4 flex w-full justify-center space-x-4"
        >
          <Button variant="primary" size="large">
            Modifica
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default LabResultPage;
