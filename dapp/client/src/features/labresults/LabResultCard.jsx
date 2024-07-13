import React from "react";
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data di Prescrizione Sconosciuta";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const renderSingleOrList = (title, list, renderItem) => {
  if (!list || list.length === 0) {
    return (
      <div>
        <span className="font-bold">{title}:</span> N/A
      </div>
    );
  }
  if (list.length === 1) {
    return (
      <div>
        <span className="font-bold">{title}:</span> {renderItem(list[0])}
      </div>
    );
  }
  return (
    <div>
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

const LabResultCard = ({ item }) => {
  const observationID = item.identifier?.value || "ID non disponibile";
  const codeDisplay = item.code?.text || "Codice non disponibile";
  const issuedDate = formatDate(item.issued);
  const status = item.status || "Stato non disponibile";
  const categoryDisplay = item.category
    ? item.category.map((cat) => cat.text).join(", ")
    : "Categoria non disponibile";
  const performerNames = item.performer
    ? item.performer.map((performer) => performer.display).join(", ")
    : "Esecutore non disponibile";
  const interpretation = item.interpretation
    ? item.interpretation.map((inter) => inter.text).join(", ")
    : "Interpretazione non disponibile";

  return (
    <Card>
      <Link to={`/labresults/${observationID}`} className="mb-4 flex-1">
        <div>
          <strong>ID dell'Osservazione:</strong> {observationID}
        </div>
        <div>
          <strong>Codice dell'Osservazione:</strong> {codeDisplay}
        </div>
        <div>
          <strong>Data di Emissione:</strong> {issuedDate}
        </div>
        <div>
          <strong>Stato:</strong> {status}
        </div>
        {renderSingleOrList("Categoria", item.category, renderCategory)}
        {renderSingleOrList(
          "Interpretazione",
          item.interpretation,
          renderInterpretation,
        )}
      </Link>
    </Card>
  );
};

export default LabResultCard;
