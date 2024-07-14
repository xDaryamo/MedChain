/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useAddEncounter } from "./useEncounters";
import { useParams } from "react-router-dom";
import SmallSpinner from "../../ui/SmallSpinner";
import { useUser } from "../authentication/useAuth";

const statusOptions = [
  { value: "planned", label: "Pianificato" },
  { value: "arrived", label: "Arrivato" },
  { value: "in-progress", label: "In corso" },
  { value: "onleave", label: "In pausa" },
  { value: "finished", label: "Concluso" },
  { value: "cancelled", label: "Annullato" },
];

const classOptions = [
  { value: "IMP", label: "Ricovero" }, // Inpatient encounter
  { value: "AMB", label: "Ambulatoriale" }, // Ambulatory
  { value: "OBSENC", label: "Osservazione" }, // Observation encounter
  { value: "EMER", label: "Emergenza" }, // Emergency
  { value: "VR", label: "Virtuale" }, // Virtual
  { value: "HH", label: "Assistenza domiciliare" }, // Home health
];

const priorityOptions = [
  { value: "A", label: "Il prima possibile" },
  { value: "CR", label: "Contattare appena pronti i risultati" },
  { value: "EL", label: "Elettivo" },
  { value: "EM", label: "Emergenza" },
  { value: "P", label: "Pre-operatorio" },
  { value: "PRN", label: "Se necessario" },
  { value: "R", label: "Routine" },
  { value: "RR", label: "Rapportare rapidamente" },
  { value: "S", label: "Stat (immediato)" },
  { value: "T", label: "Critico" },
  { value: "UD", label: "Usare come diretto" },
  { value: "UR", label: "Urgente" },
];

const AddEncounterForm = ({ onSubmitSuccess }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm();
  const { addEncounter, isPending } = useAddEncounter();
  const { id } = useParams();
  const { user } = useUser();

  const {
    fields: typeFields,
    append: appendType,
    remove: removeType,
  } = useFieldArray({
    control,
    name: "type",
  });

  const {
    fields: diagnosisFields,
    append: appendDiagnosis,
    remove: removeDiagnosis,
  } = useFieldArray({
    control,
    name: "diagnosis",
  });

  const [focusIndex, setFocusIndex] = useState(null);

  useEffect(() => {
    if (focusIndex !== null) {
      const element = document.getElementById(
        `type.${focusIndex}.coding[0].code`,
      );
      if (element) {
        element.focus();
      }
    }
  }, [focusIndex]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      period: {
        start: new Date(data.period.start).toISOString(),
        end: new Date(data.period.end).toISOString(),
      },
      identifier: {
        system: "urn:ietf:rfc:3986",
      },
      subject: { reference: id },
      participant: [
        {
          individual: { reference: user.userId },
        },
      ],
      diagnosis: data.diagnosis.map((diag) => ({
        description: diag.description,
      })),
      length: {
        value: parseFloat(data.length) * 60, // Convert minutes to seconds
      },
    };

    await addEncounter(formattedData, {
      onSettled: () => {
        reset();
        onSubmitSuccess();
      },
    });
  };

  const watchPeriodStart = watch("period.start");
  const watchPeriodEnd = watch("period.end");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-cyan-950">
        Aggiungi Visita
      </h2>

      <FormRow label="Stato:" error={errors.status?.message}>
        <FormSelect
          {...register("status.coding.[0].code", {
            required: "Lo stato è obbligatorio",
          })}
          options={statusOptions}
        />
      </FormRow>

      <FormRow label="Classe:" error={errors.class?.code?.message}>
        <FormSelect
          {...register("class.code", { required: "La classe è obbligatoria" })}
          options={classOptions}
        />
      </FormRow>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">Tipi</h3>
        {typeFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              id={`type.${index}.coding[0].code`}
              {...register(`type.${index}.coding[0].code`, {
                required: "Il codice è obbligatorio",
              })}
              placeholder="consultazione"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeType(index)}
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
            onClick={() => {
              appendType({});
              setFocusIndex(typeFields.length);
            }}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Tipo
          </Button>
        </div>
      </div>

      <FormRow
        label="Tipo di servizio:"
        error={errors.serviceType?.coding?.[0]?.code?.message}
      >
        <FormInput
          {...register("serviceType.coding[0].code")}
          placeholder="assistenza primaria"
        />
      </FormRow>

      <FormRow
        label="Priorità:"
        error={errors.priority?.coding?.[0]?.code?.message}
      >
        <FormSelect
          {...register("priority.coding[0].code", {
            required: "La priorità è obbligatoria",
          })}
          options={priorityOptions}
        />
      </FormRow>

      <FormRow label="Inizio periodo:" error={errors.period?.start?.message}>
        <FormInput
          type="datetime-local"
          {...register("period.start", {
            required: "L'inizio del periodo è obbligatorio",
            validate: (value) =>
              !watchPeriodEnd ||
              new Date(value) <= new Date(watchPeriodEnd) ||
              "L'inizio del periodo non può essere più tardi della fine del periodo",
          })}
        />
      </FormRow>

      <FormRow label="Fine periodo:" error={errors.period?.end?.message}>
        <FormInput
          type="datetime-local"
          {...register("period.end", {
            required: "La fine del periodo è obbligatoria",
            validate: (value) =>
              !watchPeriodStart ||
              new Date(value) >= new Date(watchPeriodStart) ||
              "La fine del periodo non può essere prima dell'inizio del periodo",
          })}
        />
      </FormRow>

      <FormRow label="Durata (in minuti):" error={errors.length?.message}>
        <FormInput {...register("length")} placeholder="60" />
      </FormRow>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">Diagnosi</h3>
        {diagnosisFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              {...register(`diagnosis.${index}.description`, {
                required: "La descrizione è obbligatoria",
              })}
              placeholder="Descrizione diagnosi"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeDiagnosis(index)}
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
            onClick={() => {
              appendDiagnosis({});
              setFocusIndex(diagnosisFields.length);
            }}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Diagnosi
          </Button>
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={isPending}
        >
          {isPending ? <SmallSpinner /> : "Aggiungi Visita"}
        </Button>
      </div>
    </form>
  );
};

export default AddEncounterForm;
