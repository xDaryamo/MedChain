/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { useAddPrescription } from "./usePrescriptions";
import { FaPlus, FaTrash } from "react-icons/fa";
import SmallSpinner from "../../ui/SmallSpinner";
import { useParams } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import { useGetPatient } from "../users/usePatients";

const quantityUnitOptions = [
  { value: "tablets", label: "Compresse" },
  { value: "capsules", label: "Capsule" },
  { value: "ml", label: "Millilitri" },
];

const durationUnitOptions = [
  { value: "days", label: "Giorni" },
  { value: "weeks", label: "Settimane" },
  { value: "months", label: "Mesi" },
  { value: "hours", label: "Ore" },
];

const statusOptions = [
  { value: "active", label: "Attivo" },
  { value: "on-hold", label: "Sospeso" },
  { value: "ended", label: "Terminato" },
  { value: "stopped", label: "Interrotto" },
  { value: "completed", label: "Completato" },
  { value: "cancelled", label: "Annullato" },
  { value: "entered-in-error", label: "Inserito per errore" },
  { value: "draft", label: "Bozza" },
  { value: "unknown", label: "Sconosciuto" },
];

const intentOptions = [
  { value: "proposal", label: "Proposta" },
  { value: "plan", label: "Piano" },
  { value: "order", label: "Ordine" },
  { value: "original-order", label: "Ordine originale" },
  { value: "reflex-order", label: "Ordine riflesso" },
  { value: "filler-order", label: "Ordine di riempimento" },
  { value: "instance-order", label: "Ordine di istanza" },
  { value: "option", label: "Opzione" },
];

const AddMedicationRequestForm = ({ onSubmitSuccess }) => {
  const { id } = useParams();
  const { user } = useUser();
  const { patient } = useGetPatient(id);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const { addPrescription, isPending } = useAddPrescription();

  const {
    fields: dosageInstructionFields,
    append: appendDosageInstruction,
    remove: removeDosageInstruction,
  } = useFieldArray({
    control,
    name: "dosageInstruction",
  });

  const watchValidityStart = watch("dispenseRequest.validityPeriod.start");

  const onSubmit = async (data) => {
    const prescription = {
      ...data,
      identifier: {
        system: "urn:ietf:rfc:3986",
      },
      authoredOn: new Date(data.authoredOn).toISOString(),
      dispenseRequest: {
        quantity: {
          value: data.dispenseRequest.quantity.value,
          unit: data.dispenseRequest.quantity.unit,
        },
        expectedSupplyDuration: {
          value: data.dispenseRequest.expectedSupplyDuration.value,
          unit: data.dispenseRequest.expectedSupplyDuration.unit,
        },
        validityPeriod: {
          start: new Date(
            data.dispenseRequest.validityPeriod.start,
          ).toISOString(),
          end: new Date(data.dispenseRequest.validityPeriod.end).toISOString(),
        },
      },
      medicationCodeableConcept: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: "80146002",
            display: data.medicationCodeableConcept.coding[0].display,
          },
        ],
        text: data.medicationCodeableConcept.coding[0].display,
      },
      subject: {
        reference: id,
        display: patient?.name.text,
      },
      requester: {
        reference: user.userId,
        display: user.username,
      },
      dosageInstruction: data.dosageInstruction.map((dosage) => ({
        ...dosage,
        doseQuantity: {
          value: dosage.doseQuantity.value,
          unit: dosage.doseQuantity.unit,
        },
        timing: {
          repeat: {
            frequency: dosage.timing.repeat.frequency,
            period: dosage.timing.repeat.period,
            periodUnit: dosage.timing.repeat.periodUnit,
          },
        },
        route: {
          text: dosage.route.text,
        },
      })),
      status: {
        coding: [
          {
            code: data.status.coding[0].code,
            display: statusOptions.find(
              (option) => option.value === data.status.coding[0].code,
            ).label,
          },
        ],
        text: statusOptions.find(
          (option) => option.value === data.status.coding[0].code,
        ).label,
      },
      intent: {
        coding: [
          {
            code: data.intent.coding[0].code,
            display: intentOptions.find(
              (option) => option.value === data.intent.coding[0].code,
            ).label,
          },
        ],
        text: intentOptions.find(
          (option) => option.value === data.intent.coding[0].code,
        ).label,
      },
    };

    addPrescription(prescription, {
      onSettled: () => {
        reset();
        onSubmitSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-cyan-950">
        Aggiungi una Nuova Prescrizione
      </h2>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">
          Dettagli Prescrizione
        </h3>

        {/* Medication Codeable Concept */}
        <FormRow
          label="Descrizione del Codice Medicinale:"
          error={
            errors?.medicationCodeableConcept?.coding?.[0]?.display?.message
          }
        >
          <FormInput
            {...register("medicationCodeableConcept.coding[0].display", {
              required: "La descrizione del codice medicinale è obbligatoria",
            })}
            placeholder="Ibuprofene"
          />
        </FormRow>

        {/* Authored On */}
        <FormRow
          label="Data di Prescrizione:"
          error={errors?.authoredOn?.message}
        >
          <FormInput
            type="datetime-local"
            {...register("authoredOn", {
              required: "La data di prescrizione è obbligatoria",
              validate: (value) =>
                new Date(value) <= new Date() ||
                "La data di prescrizione non può essere nel futuro",
            })}
          />
        </FormRow>

        {/* Dosage Instruction */}
        {dosageInstructionFields.map((item, index) => (
          <div key={item.id} className="mb-4 border p-4">
            <h4 className="mb-2 text-lg font-medium text-cyan-950">
              Istruzioni di Dosaggio {index + 1}
            </h4>
            <FormRow
              label="Testo delle Istruzioni di Dosaggio:"
              error={errors?.dosageInstruction?.[index]?.text?.message}
            >
              <FormInput
                {...register(`dosageInstruction[${index}].text`, {
                  required: `Il testo delle istruzioni di dosaggio ${index + 1} è obbligatorio`,
                })}
                placeholder="Assumere 1 compressa due volte al giorno"
              />
            </FormRow>
            <FormRow
              label="Frequenza (quante volte al giorno):"
              error={
                errors?.dosageInstruction?.[index]?.timing?.repeat?.frequency
                  ?.message
              }
            >
              <FormInput
                type="number"
                {...register(
                  `dosageInstruction[${index}].timing.repeat.frequency`,
                  {
                    required: `La frequenza temporale delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                    valueAsNumber: true,
                  },
                )}
                placeholder="2"
              />
            </FormRow>
            <FormRow
              label="Periodo (ogni quanti giorni):"
              error={
                errors?.dosageInstruction?.[index]?.timing?.repeat?.period
                  ?.message
              }
            >
              <FormInput
                type="number"
                {...register(
                  `dosageInstruction[${index}].timing.repeat.period`,
                  {
                    required: `Il periodo temporale delle istruzioni di dosaggio ${index + 1} è obbligatorio`,
                    valueAsNumber: true,
                  },
                )}
                placeholder="1"
              />
            </FormRow>
            <FormRow
              label="Unità del Periodo:"
              error={
                errors?.dosageInstruction?.[index]?.timing?.repeat?.periodUnit
                  ?.message
              }
            >
              <FormSelect
                {...register(
                  `dosageInstruction[${index}].timing.repeat.periodUnit`,
                  {
                    required: `L'unità del periodo delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                  },
                )}
                options={[
                  { value: "", label: "Seleziona un'unità" },
                  ...durationUnitOptions,
                ]}
              />
            </FormRow>
            <FormRow
              label="Via di Somministrazione:"
              error={errors?.dosageInstruction?.[index]?.route?.text?.message}
            >
              <FormInput
                {...register(`dosageInstruction[${index}].route.text`, {
                  required: `La via di somministrazione delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                })}
                placeholder="Orale"
              />
            </FormRow>
            <FormRow
              label="Quantità della Dose:"
              error={
                errors?.dosageInstruction?.[index]?.doseQuantity?.value?.message
              }
            >
              <FormInput
                type="number"
                {...register(`dosageInstruction[${index}].doseQuantity.value`, {
                  required: `La quantità della dose delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                  valueAsNumber: true,
                })}
                placeholder="1"
              />
            </FormRow>
            <FormRow
              label="Unità della Dose:"
              error={
                errors?.dosageInstruction?.[index]?.doseQuantity?.unit?.message
              }
            >
              <FormSelect
                {...register(`dosageInstruction[${index}].doseQuantity.unit`, {
                  required: `L'unità della dose delle istruzioni di dosaggio ${index + 1} è obbligatoria`,
                })}
                options={[
                  { value: "", label: "Seleziona un'unità" },
                  ...quantityUnitOptions,
                ]}
              />
            </FormRow>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeDosageInstruction(index)}
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
            onClick={() => appendDosageInstruction({})}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Istruzione di Dosaggio
          </Button>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">
          Richiesta di Dispensa
        </h3>
        <FormRow
          label="Quantità da Dispensare:"
          error={errors?.dispenseRequest?.quantity?.value?.message}
        >
          <FormInput
            type="number"
            {...register(`dispenseRequest.quantity.value`, {
              required: "La quantità da dispensare è obbligatoria",
              valueAsNumber: true,
            })}
            placeholder="30"
          />
        </FormRow>
        <FormRow
          label="Unità della Quantità da Dispensare:"
          error={errors?.dispenseRequest?.quantity?.unit?.message}
        >
          <FormSelect
            {...register("dispenseRequest.quantity.unit", {
              required: "L'unità della quantità da dispensare è obbligatoria",
            })}
            options={[
              { value: "", label: "Seleziona un'unità" },
              ...quantityUnitOptions,
            ]}
          />
        </FormRow>
        <FormRow
          label="Durata Prevista della Scorta:"
          error={
            errors?.dispenseRequest?.expectedSupplyDuration?.value?.message
          }
        >
          <FormInput
            type="number"
            {...register(`dispenseRequest.expectedSupplyDuration.value`, {
              required: "La durata prevista della scorta è obbligatoria",
              valueAsNumber: true,
            })}
            placeholder="7"
          />
        </FormRow>
        <FormRow
          label="Unità della Durata Prevista della Scorta:"
          error={errors?.dispenseRequest?.expectedSupplyDuration?.unit?.message}
        >
          <FormSelect
            {...register("dispenseRequest.expectedSupplyDuration.unit", {
              required:
                "L'unità della durata prevista della scorta è obbligatoria",
            })}
            options={[
              { value: "", label: "Seleziona un'unità" },
              ...durationUnitOptions,
            ]}
          />
        </FormRow>

        <FormRow
          label="Periodo di Validità Inizio:"
          error={errors?.dispenseRequest?.validityPeriod?.start?.message}
        >
          <FormInput
            type="datetime-local"
            {...register(`dispenseRequest.validityPeriod.start`, {
              required: "Il periodo di validità inizio è obbligatorio",
            })}
          />
        </FormRow>
        <FormRow
          label="Periodo di Validità Fine:"
          error={errors?.dispenseRequest?.validityPeriod?.end?.message}
        >
          <FormInput
            type="datetime-local"
            {...register(`dispenseRequest.validityPeriod.end`, {
              required: "Il periodo di validità fine è obbligatorio",
              validate: (value) =>
                new Date(value) > new Date(watchValidityStart) ||
                "La data di fine validità deve essere successiva alla data di inizio validità",
            })}
          />
        </FormRow>
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">
          Stato e Intento
        </h3>
        <FormRow
          label="Codice di Stato:"
          error={errors?.status?.coding?.[0]?.code?.message}
        >
          <FormSelect
            {...register("status.coding[0].code", {
              required: "Il codice di stato è obbligatorio",
            })}
            options={statusOptions}
          />
        </FormRow>
        <FormRow
          label="Codice dell'Intento:"
          error={errors?.intent?.coding?.[0]?.code?.message}
        >
          <FormSelect
            {...register("intent.coding[0].code", {
              required: "Il codice dell'intento è obbligatorio",
            })}
            options={intentOptions}
          />
        </FormRow>
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isPending}
        >
          {isPending ? <SmallSpinner /> : "Invia"}
        </Button>
      </div>
    </form>
  );
};

export default AddMedicationRequestForm;
