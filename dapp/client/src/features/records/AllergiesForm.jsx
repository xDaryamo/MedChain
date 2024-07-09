/* eslint-disable react/prop-types */
import { useFieldArray, useWatch } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import { FaPlus, FaTrash } from "react-icons/fa";
import Button from "../../ui/Button";
import FormSelect from "../../ui/FormSelect";

const AllergiesForm = ({ control, register, errors, setValue }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "allergies",
  });

  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCriticality, setSelectedCriticality] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState([]);

  const allergies = useWatch({
    control,
    name: "allergies",
    defaultValue: [],
  });

  const prevAllergiesRef = useRef(allergies);

  useEffect(() => {
    allergies.forEach((allergy, index) => {
      const prevAllergy = prevAllergiesRef.current[index];
      if (
        allergy?.code?.coding?.[0]?.code &&
        (prevAllergy?.code?.coding?.[0]?.code !== allergy.code.coding[0].code ||
          prevAllergy?.code?.coding?.[0]?.display !==
            allergy.code.coding[0].display)
      ) {
        const codeValue = allergy.code.coding[0].code;
        const displayValue = allergy.code.coding[0].display;

        setValue(
          `allergies.${index}.reaction[0].substance.coding[0].code`,
          codeValue,
          { shouldValidate: true, shouldDirty: true },
        );
        setValue(
          `allergies.${index}.reaction[0].substance.coding[0].display`,
          displayValue,
          { shouldValidate: true, shouldDirty: true },
        );
        setValue(
          `allergies.${index}.reaction[0].substance.text`,
          displayValue,
          { shouldValidate: true, shouldDirty: true },
        );
        setValue(`allergies.${index}.code.text`, displayValue, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });
    prevAllergiesRef.current = allergies;
  }, [allergies, setValue]);

  const handleAddAllergy = () => {
    append({});
  };

  const handleTypeChange = (index, value) => {
    const newSelectedTypes = [...selectedTypes];
    newSelectedTypes[index] = value;
    setSelectedTypes(newSelectedTypes);
  };

  const handleCategoryChange = (index, value) => {
    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    setSelectedCategories(newSelectedCategories);
  };

  const handleCriticalityChange = (index, value) => {
    const newSelectedCriticality = [...selectedCriticality];
    newSelectedCriticality[index] = value;
    setSelectedCriticality(newSelectedCriticality);
  };

  const handleSeverityChange = (index, value) => {
    const newSelectedSeverity = [...selectedSeverity];
    newSelectedSeverity[index] = value;
    setSelectedSeverity(newSelectedSeverity);
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <h4 className="text-lg font-medium">Allergia {index + 1}</h4>

          <FormRow
            label="Tipo"
            error={errors?.allergies?.[index]?.type?.message}
          >
            <FormSelect
              id={`allergies.${index}.type`}
              {...register(`allergies.${index}.type`, {
                required: "Il tipo è obbligatorio",
                onChange: (e) => handleTypeChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona un tipo" },
                { value: "allergy", label: "Allergia" },
                { value: "intolerance", label: "Intolleranza" },
              ].filter(
                (option) =>
                  option.value !== "" || selectedTypes[index] === undefined,
              )}
            />
          </FormRow>
          <FormRow
            label="Categoria"
            error={errors?.allergies?.[index]?.category?.[0]?.message}
          >
            <FormSelect
              id={`allergies.${index}.category`}
              {...register(`allergies.${index}.category[0]`, {
                required: "La categoria è obbligatoria",
                onChange: (e) => handleCategoryChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona una categoria" },
                { value: "food", label: "Cibo" },
                { value: "medication", label: "Medicinale" },
                { value: "environment", label: "Ambientale" },
                { value: "biologic", label: "Biologica" },
              ].filter(
                (option) =>
                  option.value !== "" ||
                  selectedCategories[index] === undefined,
              )}
            />
          </FormRow>
          <FormRow
            label="Criticità"
            error={errors?.allergies?.[index]?.criticality?.message}
          >
            <FormSelect
              id={`allergies.${index}.criticality`}
              {...register(`allergies.${index}.criticality`, {
                required: "La criticità è obbligatoria",
                onChange: (e) => handleCriticalityChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona una criticità" },
                { value: "low", label: "Bassa" },
                { value: "high", label: "Alta" },
                { value: "unable-to-assess", label: "Non Valutabile" },
              ].filter(
                (option) =>
                  option.value !== "" ||
                  selectedCriticality[index] === undefined,
              )}
            />
          </FormRow>

          <FormRow
            label="Codice"
            error={errors?.allergies?.[index]?.code?.coding?.[0]?.code?.message}
          >
            <FormInput
              {...register(`allergies.${index}.code.coding[0].code`, {
                required: "Il codice è obbligatorio",
              })}
              placeholder="227493005"
            />
          </FormRow>
          <FormRow
            label="Descrizione del Codice"
            error={
              errors?.allergies?.[index]?.code?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(`allergies.${index}.code.coding[0].display`, {
                required: "La descrizione è obbligatoria",
              })}
              placeholder="Noci"
            />
          </FormRow>

          <FormRow
            label="Manifestazione della Reazione"
            error={
              errors?.allergies?.[index]?.reaction?.[0]?.manifestation?.[0]
                ?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(
                `allergies.${index}.reaction[0].manifestation[0].coding[0].display`,
                { required: "La manifestazione della reazione è obbligatoria" },
              )}
              placeholder="Reazione anafilattica"
            />
          </FormRow>

          <FormRow
            label="Gravità della Reazione"
            error={errors?.allergies?.[index]?.reaction?.[0]?.severity?.message}
          >
            <FormSelect
              id={`allergies.${index}.reaction[0].severity`}
              {...register(`allergies.${index}.reaction[0].severity`, {
                required: "La gravità della reazione è obbligatoria",
                onChange: (e) => handleSeverityChange(index, e.target.value),
              })}
              options={[
                { value: "", label: "Seleziona una gravità" },
                { value: "mild", label: "Lieve" },
                { value: "moderate", label: "Moderata" },
                { value: "severe", label: "Grave" },
              ].filter(
                (option) =>
                  option.value !== "" || selectedSeverity[index] === undefined,
              )}
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
          onClick={handleAddAllergy}
          variant="secondary"
          size="small"
        >
          <FaPlus className="mr-1" /> Aggiungi Allergia
        </Button>
      </div>
    </div>
  );
};

export default AllergiesForm;
