/* eslint-disable react/prop-types */
import { useFieldArray, useWatch } from "react-hook-form";
import { useEffect, useState, useMemo } from "react";
import { useSearchLabResults } from "../labresults/useLabResults";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { FaPlus, FaTrash } from "react-icons/fa";

const LabResultsForm = ({ control, register, errors, patientID }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "labResultsIDs",
  });

  const [query, setQuery] = useState(null);
  const { labResults = [], isPending, error } = useSearchLabResults(query);
  const [availableResults, setAvailableResults] = useState([]);

  const selectedLabResultsIDs =
    useWatch({
      control,
      name: "labResultsIDs",
    }) || [];

  // Memoize selectedLabResultsIDs to avoid unnecessary re-renders
  const memoizedSelectedLabResultsIDs = useMemo(
    () => selectedLabResultsIDs,
    [selectedLabResultsIDs],
  );

  useEffect(() => {
    if (patientID) {
      setQuery({
        query: {
          selector: {
            "subject.reference": `${patientID}`,
          },
        },
      });
    }
  }, [patientID]);

  useEffect(() => {
    if (Array.isArray(labResults)) {
      const selectedIDs = memoizedSelectedLabResultsIDs.map(
        (result) => result.id,
      );
      const filteredResults = labResults.filter(
        (result) => !selectedIDs.includes(result.id),
      );

      // Aggiorna availableResults solo se ci sono cambiamenti
      if (
        JSON.stringify(filteredResults) !== JSON.stringify(availableResults)
      ) {
        setAvailableResults(filteredResults);
      }
    }
  }, [labResults, memoizedSelectedLabResultsIDs, availableResults]);

  const handleAddLabResult = (resultID) => {
    append({ id: resultID });
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <FormRow
            label={`Lab Result ID ${index + 1}`}
            error={errors?.labResultsIDs?.[index]?.id?.message}
          >
            <FormInput
              {...register(`labResultsIDs.${index}.id`, {
                required: "Lab Result ID is required",
              })}
              readOnly
            />
          </FormRow>
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => remove(index)}
              variant="delete"
              size="small"
            >
              <FaTrash />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center">
        {isPending ? (
          <div>Loading lab results...</div>
        ) : error ? (
          <div>Error loading lab results</div>
        ) : (
          <div>
            {availableResults.length > 0 ? (
              availableResults.map((result) => (
                <div key={result.id} className="mb-2 flex items-center">
                  <span className="flex-1">{result.id}</span>
                  <Button
                    type="button"
                    onClick={() => handleAddLabResult(result.id)}
                    variant="secondary"
                    size="small"
                  >
                    <FaPlus className="mr-1" /> Add
                  </Button>
                </div>
              ))
            ) : (
              <div>No lab results available for this patient</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LabResultsForm;
