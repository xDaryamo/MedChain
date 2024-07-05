/* eslint-disable react/prop-types */
import { useFieldArray, useWatch } from "react-hook-form";
import { useSearchLabResults } from "../labresults/useLabResults";
import { useEffect } from "react";
import FormRow from "../../ui/FormRow";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import SmallSpinner from "../../ui/SmallSpinner";

const LabResultsForm = ({ patientID, control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "labResultsIDs",
  });

  const selectedLabResults =
    useWatch({
      control,
      name: "labResultsIDs",
    }) || [];

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

  const handleAddLabResult = () => {
    append({ id: "" });
  };

  const getFilteredOptions = (excludeIndex = -1) => {
    const excludeIds =
      excludeIndex >= 0
        ? selectedLabResults
            .filter((_, index) => index !== excludeIndex)
            .map((lr) => lr.id)
        : selectedLabResults.map((lr) => lr.id);
    return labResults.filter(
      (result) => !excludeIds.includes(result.identifier?.value),
    );
  };

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
              })}
              options={[
                ...(selectedLabResults[index]?.id
                  ? []
                  : [{ value: "", label: "Select lab result" }]),
                ...getFilteredOptions(index).map((result) => ({
                  value: result.identifier?.value,
                  label: result.code?.text,
                })),
              ]}
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
