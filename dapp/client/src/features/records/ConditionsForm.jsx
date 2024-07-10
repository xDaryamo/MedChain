/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import FormSelect from "../../ui/FormSelect";

const severityOptions = [
  {
    code: "24484000",
    system: "http://snomed.info/sct",
    display: "Severe",
    label: "Grave",
  },
  {
    code: "6736007",
    system: "http://snomed.info/sct",
    display: "Moderate",
    label: "Moderata",
  },
  {
    code: "255604002",
    system: "http://snomed.info/sct",
    display: "Mild",
    label: "Lieve",
  },
];

const ConditionsForm = ({ control, register, errors, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "conditions",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSeverities, setSelectedSeverities] = useState([]);
  const [focusIndex, setFocusIndex] = useState(null);

  useEffect(() => {
    if (focusIndex !== null) {
      const element = document.getElementById(
        `conditions.${focusIndex}.category`,
      );
      if (element) {
        element.focus();
      }
    }
  }, [focusIndex]);

  const handleAddCondition = () => {
    append({});
    setFocusIndex(0); // Focus sul primo elemento della lista
  };

  const handleCategoryChange = (index, value) => {
    const displayValue =
      value === "problem-list-item"
        ? "Problem List Item"
        : "Encounter Diagnosis";
    const textValue =
      value === "problem-list-item"
        ? "Problem List Item"
        : "Encounter Diagnosis";

    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    setSelectedCategories(newSelectedCategories);

    setValue(`conditions.${index}.category[0].coding[0].code`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(
      `conditions.${index}.category[0].coding[0].display`,
      displayValue,
      { shouldValidate: true, shouldDirty: true },
    );
    setValue(`conditions.${index}.category[0].text`, textValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSeverityChange = (index, value) => {
    const selectedOption = severityOptions.find(
      (option) => option.code === value,
    );

    const newSelectedSeverities = [...selectedSeverities];
    newSelectedSeverities[index] = value;
    setSelectedSeverities(newSelectedSeverities);

    setValue(
      `conditions.${index}.severity.coding[0].code`,
      selectedOption.code,
      { shouldValidate: true, shouldDirty: true },
    );
    setValue(
      `conditions.${index}.severity.coding[0].display`,
      selectedOption.display,
      { shouldValidate: true, shouldDirty: true },
    );
    setValue(
      `conditions.${index}.severity.coding[0].system`,
      selectedOption.system,
      { shouldValidate: true, shouldDirty: true },
    );
    setValue(`conditions.${index}.severity.text`, selectedOption.display, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCodeDescriptionChange = (index, value) => {
    setValue(`conditions.${index}.code.coding[0].display`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`conditions.${index}.code.text`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <h4 className="text-lg font-medium">Condizione {index + 1}</h4>

          {/* Category */}
          <FormRow
            label="Categoria"
            error={
              errors?.conditions?.[index]?.category?.[0]?.coding?.[0]?.code
                ?.message
            }
          >
            <FormSelect
              id={`conditions.${index}.category`}
              {...register(`conditions.${index}.category[0].coding[0].code`, {
                required: "La categoria è obbligatoria",
                onChange: (e) => handleCategoryChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona una categoria" },
                {
                  value: "problem-list-item",
                  label: "Elemento della lista dei problemi",
                },
                {
                  value: "encounter-diagnosis",
                  label: "Diagnosi dell'incontro",
                },
              ].filter(
                (option) =>
                  option.value !== "" ||
                  selectedCategories[index] === undefined,
              )}
            />
          </FormRow>

          {/* Severity */}
          <FormRow
            label="Gravità"
            error={
              errors?.conditions?.[index]?.severity?.coding?.[0]?.code?.message
            }
          >
            <FormSelect
              id={`conditions.${index}.severity`}
              {...register(`conditions.${index}.severity.coding[0].code`, {
                required: "La gravità è obbligatoria",
                onChange: (e) => handleSeverityChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona una gravità" },
                ...severityOptions.map((option) => ({
                  value: option.code,
                  label: option.label,
                })),
              ].filter(
                (option) =>
                  option.value !== "" ||
                  selectedSeverities[index] === undefined,
              )}
            />
          </FormRow>

          {/* Code */}
          <FormRow
            label="Codice"
            error={
              errors?.conditions?.[index]?.code?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(`conditions.${index}.code.coding.[0].code`, {
                required: "Il codice è obbligatorio",
              })}
              placeholder="44054006"
            />
          </FormRow>
          <FormRow
            label="Descrizione del codice"
            error={
              errors?.conditions?.[index]?.code?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(`conditions.${index}.code.coding.[0].display`, {
                required: "La descrizione del codice è obbligatoria",
                onChange: (e) =>
                  handleCodeDescriptionChange(index, e.target.value),
              })}
              placeholder="Diabete mellito di tipo 2"
            />
          </FormRow>

          {/* Onset DateTime */}
          <FormRow
            label="Data e ora di inizio"
            error={errors?.conditions?.[index]?.onsetDateTime?.message}
          >
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.onsetDateTime`, {
                required: "La data e ora di inizio è obbligatoria",
              })}
            />
          </FormRow>

          {/* Abatement DateTime */}
          <FormRow
            label="Data e ora di cessazione"
            error={errors?.conditions?.[index]?.abatementDateTime?.message}
          >
            <FormInput
              type="datetime-local"
              {...register(`conditions.${index}.abatementDateTime`, {
                required: "La data e ora di cessazione è obbligatoria",
              })}
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
        <Button
          type="button"
          onClick={handleAddCondition}
          variant="secondary"
          size="small"
        >
          <FaPlus className="mr-1" /> Aggiungi Condizione
        </Button>
      </div>
    </div>
  );
};

export default ConditionsForm;
