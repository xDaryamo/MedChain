/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import SmallSpinner from "../../ui/SmallSpinner";
import { useSearchEncounters } from "../encounters/useEncounters";
import { format } from "date-fns";

const categoryOptions = [
  {
    code: "24642003",
    display: "Psychiatry procedure or service",
    label: "Procedura psichiatrica o servizio",
  },
  { code: "409063005", display: "Counselling", label: "Consulenza" },
  { code: "409073007", display: "Education", label: "Educazione" },
  {
    code: "387713003",
    display: "Surgical procedure (procedure)",
    label: "Procedura chirurgica",
  },
  {
    code: "15220000",
    display: "Laboratory test",
    label: "Test di laboratorio",
  },
  { code: "363679005", display: "Imaging (procedure)", label: "Imaging" },
  { code: "122869004", display: "Measurement", label: "Misurazione" },
  {
    code: "46947000",
    display: "Chiropractic manipulation",
    label: "Manipolazione chiropratica",
  },
  {
    code: "410606002",
    display: "Social service procedure (procedure)",
    label: "Procedura di servizio sociale",
  },
];

const EncounterDetails = ({ encounter }) => {
  if (!encounter) return null;

  const formatDate = (date) => format(new Date(date), "dd/MM/yyyy HH:mm");

  return (
    <div className="mt-2 p-2">
      <h4 className="mb-2 text-lg font-bold text-cyan-950">
        Dettagli dell&apos;incontro
      </h4>
      <p className="text-sm text-cyan-950">
        <strong>ID:</strong> {encounter.identifier?.value || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Stato:</strong> {encounter.status?.coding[0]?.display || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Classe:</strong> {encounter.class?.display || "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Periodo:</strong>{" "}
        {encounter.period
          ? `${formatDate(encounter.period.start)} - ${formatDate(
              encounter.period.end,
            )}`
          : "N/A"}
      </p>
      <p className="text-sm text-cyan-950">
        <strong>Luogo:</strong>{" "}
        {encounter.location?.[0]?.location?.display || "N/A"}
      </p>
    </div>
  );
};

const ProceduresForm = ({ control, register, errors, setValue, patientID }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "procedures",
  });

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedEncounters, setSelectedEncounters] = useState({});
  const [focusIndex, setFocusIndex] = useState(null);

  const { encounters = [], isPending: isPendingEncounters } =
    useSearchEncounters({
      query: {
        selector: {
          "subject.reference": `${patientID}`,
        },
      },
    });

  useEffect(() => {
    if (focusIndex !== null) {
      const element = document.getElementById(`procedures.${focusIndex}.code`);
      if (element) {
        element.focus();
      }
    }
  }, [focusIndex]);

  const handleAddProcedure = () => {
    append({});
    setFocusIndex(fields.length);
  };

  const handleCategoryChange = (index, value) => {
    const selectedOption = categoryOptions.find(
      (option) => option.code === value,
    );

    const newSelectedCategories = [...selectedCategories];
    newSelectedCategories[index] = value;
    setSelectedCategories(newSelectedCategories);

    setValue(
      `procedures.${index}.category.coding[0].code`,
      selectedOption.code,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
    setValue(
      `procedures.${index}.category.coding[0].display`,
      selectedOption.display,
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
    setValue(`procedures.${index}.category.text`, selectedOption.display, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCodeDescriptionChange = (index, value) => {
    setValue(`procedures.${index}.code.coding[0].display`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`procedures.${index}.code.text`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleEncounterChange = (index, value) => {
    const selectedEncounter = encounters.find(
      (encounter) => encounter.identifier.value === value,
    );

    if (selectedEncounter) {
      setValue(
        `procedures.${index}.encounter.reference`,
        selectedEncounter.identifier.value,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
      setValue(
        `procedures.${index}.encounter.display`,
        selectedEncounter.class?.display || "N/A",
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );

      setSelectedEncounters((prev) => ({
        ...prev,
        [index]: selectedEncounter,
      }));
    }
  };

  return (
    <div>
      {isPendingEncounters ? (
        <div className="flex justify-center">
          <SmallSpinner />
        </div>
      ) : encounters.length === 0 ? (
        <p className="text-sm italic text-red-500">
          Non ci sono visite disponibili e il riferimento alle visite è
          obbligatorio.
        </p>
      ) : (
        <>
          {fields.map((field, index) => (
            <div key={field.id} className="mb-2 space-y-2 border p-2">
              <h4 className="text-lg font-medium">Procedura {index + 1}</h4>

              {/* Code */}
              <FormRow
                label="Codice"
                error={
                  errors?.procedures?.[index]?.code?.coding?.[0]?.code?.message
                }
              >
                <FormInput
                  {...register(`procedures.${index}.code.coding.[0].code`, {
                    required: "Il codice è obbligatorio",
                  })}
                  placeholder="80146002"
                  id={`procedures.${index}.code`}
                />
              </FormRow>
              <FormRow
                label="Descrizione del codice"
                error={
                  errors?.procedures?.[index]?.code?.coding?.[0]?.display
                    ?.message
                }
              >
                <FormInput
                  {...register(`procedures.${index}.code.coding.[0].display`, {
                    required: "La descrizione del codice è obbligatoria",
                    onChange: (e) =>
                      handleCodeDescriptionChange(index, e.target.value),
                  })}
                  placeholder="Appendectomy"
                />
              </FormRow>

              {/* Category */}
              <FormRow
                label="Categoria"
                error={
                  errors?.procedures?.[index]?.category?.coding?.[0]?.code
                    ?.message
                }
              >
                <FormSelect
                  id={`procedures.${index}.category`}
                  {...register(`procedures.${index}.category.coding[0].code`, {
                    required: "La categoria è obbligatoria",
                    onChange: (e) =>
                      handleCategoryChange(index, e.target.value),
                  })}
                  options={[
                    { value: "", label: "Seleziona una categoria" },
                    ...categoryOptions.map((option) => ({
                      value: option.code,
                      label: option.label,
                    })),
                  ].filter(
                    (option) =>
                      option.value !== "" ||
                      selectedCategories[index] === undefined,
                  )}
                />
              </FormRow>

              {/* Encounter */}
              <FormRow
                label="Riferimento all'incontro"
                error={
                  errors?.procedures?.[index]?.encounter?.reference?.message
                }
              >
                <FormSelect
                  id={`procedures.${index}.encounter`}
                  {...register(`procedures.${index}.encounter.reference`, {
                    required: "Il riferimento all'incontro è obbligatorio",
                    onChange: (e) =>
                      handleEncounterChange(index, e.target.value),
                  })}
                  options={[
                    {
                      value: "",
                      label: "Seleziona un incontro",
                    },
                    ...encounters.map((encounter) => ({
                      value: encounter.identifier.value,
                      label:
                        encounter.class?.display || encounter.identifier.value,
                    })),
                  ]}
                />
              </FormRow>
              {!isPendingEncounters && encounters.length === 0 && (
                <p className="text-sm italic text-red-500">
                  Non ci sono incontri disponibili.
                </p>
              )}
              {selectedEncounters[index] && (
                <EncounterDetails encounter={selectedEncounters[index]} />
              )}

              {/* Note */}
              <FormRow
                label="Nota"
                error={errors?.procedures?.[index]?.note?.[0]?.text?.message}
              >
                <FormInput
                  {...register(`procedures.${index}.note.[0].text`, {
                    required: "Il testo della nota è obbligatorio",
                  })}
                  placeholder="Procedure was successful with no complications."
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
              onClick={handleAddProcedure}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Procedura
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProceduresForm;
