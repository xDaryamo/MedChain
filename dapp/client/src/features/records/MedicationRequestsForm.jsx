/* eslint-disable react/prop-types */
import { useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";

const quantityUnitOptions = [
  { value: "tablets", label: "Compresse" },
  { value: "capsules", label: "Capsule" },
  { value: "ml", label: "Millilitri" },
];

const durationUnitOptions = [
  { value: "days", label: "Giorni" },
  { value: "weeks", label: "Settimane" },
  { value: "months", label: "Mesi" },
];

const MedicationRequestsForm = ({ control, register, setValue, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prescriptions",
  });

  const [focusIndex, setFocusIndex] = useState(null);

  useEffect(() => {
    if (focusIndex !== null) {
      const element = document.getElementById(
        `prescriptions.${focusIndex}.medicationCodeableConcept.coding[0].code`,
      );
      if (element) {
        element.focus();
      }
    }
  }, [focusIndex]);

  const handleAddMedicationRequest = () => {
    append({});
    setFocusIndex(fields.length);
  };

  const handleDisplayChange = (index, value) => {
    setValue(
      `prescriptions.${index}.medicationCodeableConcept.coding[0].display`,
      value,
      { shouldValidate: true, shouldDirty: true },
    );
    setValue(`prescriptions.${index}.medicationCodeableConcept.text`, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const formatDate = (date) => {
    const isoString = new Date(date).toISOString();
    return isoString.split("T")[0]; // Return only the date part in YYYY-MM-DD format
  };

  return (
    <div>
      {fields.map((field, index) => (
        <div key={field.id} className="mb-2 space-y-2 border p-2">
          <h4 className="text-lg font-medium">
            Medication Request {index + 1}
          </h4>
          {/* Medication Codeable Concept */}

          <FormRow
            label="Codice del Medicinale"
            error={
              errors?.prescriptions?.[index]?.medicationCodeableConcept
                ?.coding?.[0]?.code?.message
            }
          >
            <FormInput
              {...register(
                `prescriptions.${index}.medicationCodeableConcept.coding[0].code`,
                {
                  required: "Il codice del medicinale è obbligatorio",
                },
              )}
              placeholder="80146002"
              id={`prescriptions.${index}.medicationCodeableConcept.coding[0].code`}
            />
          </FormRow>
          <FormRow
            label="Descrizione del Codice"
            error={
              errors?.prescriptions?.[index]?.medicationCodeableConcept
                ?.coding?.[0]?.display?.message
            }
          >
            <FormInput
              {...register(
                `prescriptions.${index}.medicationCodeableConcept.coding[0].display`,
                {
                  required: "La descrizione del codice è obbligatoria",
                  onChange: (e) => handleDisplayChange(index, e.target.value),
                },
              )}
              placeholder="Ibuprofen"
            />
          </FormRow>

          {/* Dosage Instruction */}
          <FormRow
            label="Istruzioni sul Dosaggio"
            error={
              errors?.prescriptions?.[index]?.dosageInstruction?.[0]?.text
                ?.message
            }
          >
            <FormInput
              {...register(`prescriptions.${index}.dosageInstruction[0].text`, {
                required: "Le istruzioni sul dosaggio sono obbligatorie",
              })}
              placeholder="Prendere 1 compressa due volte al giorno"
            />
          </FormRow>

          {/* Dispense Request */}
          <FormRow
            label="Quantità da Dispensare"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest?.quantity?.value
                ?.message
            }
          >
            <FormInput
              type="number"
              {...register(
                `prescriptions.${index}.dispenseRequest.quantity.value`,
                {
                  required: "La quantità da dispensare è obbligatoria",
                  valueAsNumber: true,
                },
              )}
              placeholder="30"
            />
          </FormRow>
          <FormRow
            label="Unità di Quantità"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest?.quantity?.unit
                ?.message
            }
          >
            <FormSelect
              {...register(
                `prescriptions.${index}.dispenseRequest.quantity.unit`,
                {
                  required: "L'unità di quantità è obbligatoria",
                },
              )}
              options={[
                { value: "", label: "Seleziona un'unità" },
                ...quantityUnitOptions,
              ]}
            />
          </FormRow>
          <FormRow
            label="Durata della Fornitura"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest
                ?.expectedSupplyDuration?.value?.message
            }
          >
            <FormInput
              type="number"
              {...register(
                `prescriptions.${index}.dispenseRequest.expectedSupplyDuration.value`,
                {
                  required: "La durata della fornitura è obbligatoria",
                  valueAsNumber: true,
                },
              )}
              placeholder="7"
            />
          </FormRow>
          <FormRow
            label="Unità di Durata"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest
                ?.expectedSupplyDuration?.unit?.message
            }
          >
            <FormSelect
              {...register(
                `prescriptions.${index}.dispenseRequest.expectedSupplyDuration.unit`,
                {
                  required: "L'unità di durata è obbligatoria",
                },
              )}
              options={[
                { value: "", label: "Seleziona un'unità" },
                ...durationUnitOptions,
              ]}
            />
          </FormRow>
          <FormRow
            label="Inizio del Periodo di Validità"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest?.validityPeriod
                ?.start?.message
            }
          >
            <FormInput
              type="date"
              {...register(
                `prescriptions.${index}.dispenseRequest.validityPeriod.start`,
                {
                  required: "L'inizio del periodo di validità è obbligatorio",
                  valueAsDate: true,
                  setValueAs: (value) => formatDate(value),
                },
              )}
            />
          </FormRow>
          <FormRow
            label="Fine del Periodo di Validità"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest?.validityPeriod
                ?.end?.message
            }
          >
            <FormInput
              type="date"
              {...register(
                `prescriptions.${index}.dispenseRequest.validityPeriod.end`,
                {
                  required: "La fine del periodo di validità è obbligatoria",
                  valueAsDate: true,
                  setValueAs: (value) => formatDate(value),
                },
              )}
            />
          </FormRow>
          <FormRow
            label="Numero di Ripetizioni Consentite"
            error={
              errors?.prescriptions?.[index]?.dispenseRequest
                ?.numberOfRepeatsAllowed?.message
            }
          >
            <FormInput
              type="number"
              {...register(
                `prescriptions.${index}.dispenseRequest.numberOfRepeatsAllowed`,
                {
                  required:
                    "Il numero di ripetizioni consentite è obbligatorio",
                  valueAsNumber: true,
                },
              )}
              placeholder="0"
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
          onClick={handleAddMedicationRequest}
          variant="secondary"
          size="small"
        >
          <FaPlus className="mr-1" /> Aggiungi Richiesta di Medicinale
        </Button>
      </div>
    </div>
  );
};

export default MedicationRequestsForm;
