/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

const formatDate = (dateString) => {
  if (!dateString || dateString === "0001-01-01T00:00:00Z") {
    return "Data Sconosciuta";
  }
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

const renderSingleOrList = (title, list, renderItem) => {
  if (!list || list.length === 0) {
    return (
      <div>
        <span className="font-bold">{title}:</span> N/D
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

const renderReason = (reason) => reason?.reference || "N/D";

const EncounterCard = ({ item }) => {

  console.log(item)

  const encounterID = item.identifier?.value || "ID non disponibile";
  const encounterSubject = item.subject?.reference || "Paziente Sconosciuto";
  const encounterPeriod = item.period
    ? `${formatDate(item.period.start)} - ${formatDate(item.period.end)}`
    : "Periodo Sconosciuto";
  const encounterStatus = item.status?.coding?.[0]?.code || "Stato Sconosciuto";

  return (
    <Card>
      <Link to={`/encounters/${encounterID}`} className="mb-4 flex-1">
        <div>
          <strong>ID dell'incontro:</strong> {encounterID}
        </div>
        <div>
          <strong>Paziente:</strong> {encounterSubject}
        </div>
        <div>
          <strong>Periodo dell'Incontro:</strong> {encounterPeriod}
        </div>
        {renderSingleOrList(
          "Ragione dell'Incontro",
          item.reasonReference,
          renderReason
        )}
        <div>
          <strong>Stato dell'Incontro:</strong> {encounterStatus}
        </div>
      </Link>
    </Card>
  );
};

export default EncounterCard;
