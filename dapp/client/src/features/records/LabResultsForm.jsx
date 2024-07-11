/* eslint-disable react/prop-types */
import { useFieldArray, useWatch } from "react-hook-form";
import { useSearchLabResults } from "../labresults/useLabResults";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import SmallSpinner from "../../ui/SmallSpinner";

const LabResultDetails = ({ labResult }) => {
  if (!labResult) return null;

  return (
    <div className="mt-2 p-2">
      <h4 className="mb-2 text-lg font-bold text-cyan-950">
        Dettagli aggiuntivi
      </h4>
      <p className="text-sm text-cyan-950">
        <strong>Categoria:</strong> {labResult.category[0]?.text || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Nome:</strong> {labResult.code?.text || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Stato:</strong> {labResult.status || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Performer:</strong> {labResult.performer?.[0]?.display || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Interpretazione:</strong>{" "}
        {labResult.interpretation?.[0]?.text || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Note:</strong> {labResult.note?.[0]?.text || "N/A"}
      </p>
    </div>
  );
};

const LabResultsForm = ({ patientID, control, register, errors, isUpdate }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "labResultsIDs",
  });

  const selectedLabResults =
    useWatch({
      control,
      name: "labResultsIDs",
    }) || [];

  const [selectedIds, setSelectedIds] = useState([]);

  const {
    labResults = [],
    isPending,
    error,
  } = useSearchLabResults({
    query: {
      selector: {
        "subject.reference": `${patientID}`,
      },
    },
  });

  useEffect(() => {
    if (error) {
      console.error("Failed to fetch lab results", error);
    }
  }, [error]);

  useEffect(() => {
    const newSelectedIds = selectedLabResults.map((lr) => lr.id);
    if (JSON.stringify(newSelectedIds) !== JSON.stringify(selectedIds)) {
      setSelectedIds(newSelectedIds);
    }
  }, [selectedLabResults, selectedIds]);

  const handleAddLabResult = () => {
    append({ id: "" });
  };

  const handleRemoveLabResult = (index) => {
    const newSelectedIds = [...selectedIds];
    newSelectedIds.splice(index, 1);
    setSelectedIds(newSelectedIds);
    remove(index);
  };

  const getFilteredOptions = (excludeIndex = -1) => {
    const excludeIds =
      excludeIndex >= 0
        ? selectedIds.filter((_, index) => index !== excludeIndex)
        : selectedIds;
    return labResults.filter(
      (result) => !excludeIds.includes(result.identifier?.value),
    );
  };

  const getSelectedLabResult = (id) =>
    labResults.find((result) => result.identifier?.value === id);

  return (
    <div>
      {isPending && <SmallSpinner />}
      {error && <p>Error loading lab results</p>}
      {!isPending && labResults.length === 0 && (
        <p>No lab results found for the selected patient.</p>
      )}
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <FormRow
            label={`Lab Result ${index + 1}`}
            error={errors?.labResultsIDs?.[index]?.id?.message}
          >
            <FormSelect
              id={`labResultsIDs.${index}.id`}
              {...register(`labResultsIDs.${index}.id`, {
                required: "Lab result ID is required",
                onChange: (e) => {
                  const value = e.target.value;
                  const newSelectedIds = [...selectedIds];
                  newSelectedIds[index] = value;
                  setSelectedIds(newSelectedIds);
                },
              })}
              defaultValue={field.id || ""}
              options={[
                ...(!isUpdate
                  ? [
                      {
                        value: "",
                        label: "Seleziona risultato",
                        disabled: true,
                      },
                    ]
                  : []),
                ...getFilteredOptions(index).map((result) => ({
                  value: result.identifier?.value,
                  label: result.code?.text,
                })),
              ]}
            />
          </FormRow>
          {getSelectedLabResult(selectedLabResults[index]?.id) && (
            <LabResultDetails
              labResult={getSelectedLabResult(selectedLabResults[index]?.id)}
            />
          )}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => handleRemoveLabResult(index)}
              variant="delete"
              size="small"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}
      {!isPending && getFilteredOptions().length > 0 && (
        <div className="flex justify-center">
          <Button
            type="button"
            onClick={handleAddLabResult}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Add Lab Result
          </Button>
        </div>
      )}
    </div>
  );
};

export default LabResultsForm;
