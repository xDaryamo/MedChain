/* eslint-disable no-unused-vars */
import { useForm, useFieldArray } from "react-hook-form";
import { useEffect } from "react";
import FormRow from "../../ui/FormRow";
import FormInput from "../../ui/FormInput";
import FormSelect from "../../ui/FormSelect";
import Button from "../../ui/Button";
import { FaTrash, FaPlus } from "react-icons/fa";
import { useUpdateEncounter, useGetEncounter } from "./useEncounters";
import { useParams, useNavigate } from "react-router-dom";
import SmallSpinner from "../../ui/SmallSpinner";
import BackButton from "../../ui/BackButton";
import Spinner from "../../ui/Spinner";

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

const UpdateEncounterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isPending: encounterLoading, encounter } = useGetEncounter(id);
  const { updateEncounter, isPending: updatePending } = useUpdateEncounter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      type: [],
      diagnosis: [],
    },
  });

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

  const watchPeriodStart = watch("period.start");
  const watchPeriodEnd = watch("period.end");

  useEffect(() => {
    if (encounter) {
      const formattedData = {
        ...encounter,
        status: encounter.status?.coding?.[0]?.code,
        class: encounter.class?.code,
        type:
          encounter.type?.map((t) => ({
            coding: [{ code: t.coding[0].code }],
          })) || [],
        serviceType: encounter.serviceType?.coding?.[0]?.code || "",
        priority: encounter.priority?.coding?.[0]?.code || "",
        period: {
          start: encounter.period?.start?.slice(0, 16) || "",
          end: encounter.period?.end?.slice(0, 16) || "",
        },
        length: (encounter.length.value / 60).toFixed(2), // Convert seconds to minutes
        diagnosis:
          encounter.diagnosis?.map((d) => ({
            description: d.description || "",
          })) || [],
      };

      reset(formattedData);
    }
  }, [encounter, reset]);

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      period: {
        start: new Date(data.period.start).toISOString(),
        end: new Date(data.period.end).toISOString(),
      },
      identifier: {
        system: encounter.identifier.system,
        value: id,
      },
      subject: encounter.subject,
      length: {
        value: parseFloat(data.length) * 60, // Convert minutes to seconds
      },
      diagnosis: data.diagnosis.map((diag) => ({
        description: diag.description,
      })),
      type: data.type.map((type) => ({
        coding: [
          {
            system: "http://snomed.info/sct",
            code: type.coding[0].code,
            display: type.coding[0].code,
          },
        ],
      })),
      priority: {
        coding: [
          {
            system: "http://terminology.hl7.org/CodeSystem/v3-ActPriority",
            code: data.priority,
            display:
              priorityOptions.find((option) => option.value === data.priority)
                ?.label || "",
          },
        ],
      },
      class: {
        code: data.class,
        display:
          classOptions.find((option) => option.value === data.class)?.label ||
          "",
      },
      serviceType: {
        coding: [
          {
            system: "http://snomed.info/sct",
            code: data.serviceType,
            display: data.serviceType,
          },
        ],
      },
      status: {
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/v3-ActEncounterStatus",
            code: data.status,
            display:
              statusOptions.find((option) => option.value === data.status)
                ?.label || "",
          },
        ],
      },
    };

    try {
      await updateEncounter(
        { id, encounter: formattedData },
        {
          onSettled: () => {
            reset();
            navigate(-1);
          },
        },
      );
    } catch (err) {
      console.error("Error updating encounter:", err.message);
    }
  };

  if (encounterLoading) return <Spinner />;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div>
        <BackButton onClick={() => navigate(-1)}>Indietro</BackButton>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <h2 className="mb-6 text-center text-2xl font-bold text-cyan-950">
          Modifica Visita
        </h2>

        <FormRow label="Stato:" error={errors.status?.message}>
          <FormSelect
            id="status"
            {...register("status", { required: "Lo stato è obbligatorio" })}
            options={statusOptions}
          />
        </FormRow>

        <FormRow label="Classe:" error={errors.class?.message}>
          <FormSelect
            id="class"
            {...register("class", { required: "La classe è obbligatoria" })}
            options={classOptions}
          />
        </FormRow>

        <FormRow label="Tipo di servizio:" error={errors.serviceType?.message}>
          <FormInput
            id="serviceType"
            {...register("serviceType", {
              required: "Il tipo di servizio è obbligatorio",
            })}
            placeholder="assistenza primaria"
          />
        </FormRow>

        <FormRow label="Priorità:" error={errors.priority?.message}>
          <FormSelect
            id="priority"
            {...register("priority", {
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
          <FormInput
            {...register("length", {
              required: "La durata è obbligatoria",
            })}
            placeholder="60"
          />
        </FormRow>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">Tipi</h3>
          {typeFields.map((type, index) => (
            <div key={type.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`type[${index}].coding[0].code`, {
                  required: `Il codice del tipo ${index + 1} è obbligatorio`,
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
              onClick={() => appendType({ coding: [{ code: "" }] })}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Tipo
            </Button>
          </div>
        </div>

        <div className="mb-4 border-b pb-4">
          <h3 className="mb-4 text-xl font-semibold text-cyan-950">Diagnosi</h3>
          {diagnosisFields.map((diagnosis, index) => (
            <div key={diagnosis.id} className="mb-2 flex space-x-2">
              <FormInput
                {...register(`diagnosis[${index}].description`, {
                  required: `La descrizione della diagnosi ${index + 1} è obbligatoria`,
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
              onClick={() => appendDiagnosis({ description: "" })}
              variant="secondary"
              size="small"
            >
              <FaPlus className="mr-1" /> Aggiungi Diagnosi
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-center space-x-4">
          <Button
            type="submit"
            disabled={updatePending}
            variant="primary"
            size="large"
          >
            {updatePending ? <SmallSpinner /> : "Aggiorna"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEncounterForm;
