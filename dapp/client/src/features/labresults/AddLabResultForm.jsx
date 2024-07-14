/* eslint-disable react/prop-types */
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateLabResult } from "./useLabResults";
import Button from "../../ui/Button";
import FormInput from "../../ui/FormInput";
import FormRow from "../../ui/FormRow";
import FormSelect from "../../ui/FormSelect";
import { FaPlus, FaTrash } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useUser } from "../authentication/useAuth";
import SmallSpinner from "../../ui/SmallSpinner";

const AddLabResultForm = ({ onSubmitSuccess }) => {
  const { id } = useParams();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const { createResult, isPending } = useCreateLabResult();

  const {
    fields: categoryFields,
    append: appendCategory,
    remove: removeCategory,
  } = useFieldArray({
    control,
    name: "category",
  });

  const {
    fields: interpretationFields,
    append: appendInterpretation,
    remove: removeInterpretation,
  } = useFieldArray({
    control,
    name: "interpretation",
  });

  const {
    fields: noteFields,
    append: appendNote,
    remove: removeNote,
  } = useFieldArray({
    control,
    name: "note",
  });

  const {
    fields: componentFields,
    append: appendComponent,
    remove: removeComponent,
  } = useFieldArray({
    control,
    name: "component",
  });

  const onSubmit = async (data) => {
    const labresult = {
      identifier: {
        system: "http://hospital.smarthealth.org",
      },
      status: data.status,
      category: data.category.map((cat) => ({
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/observation-category",
            code: cat.text,
            display: cat.text,
          },
        ],
        text: cat.text,
      })),
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: data.code.text,
            display: data.code.text,
          },
        ],
        text: data.code.text,
      },
      subject: {
        reference: id,
      },
      effectivePeriod: {
        start: new Date(data.effectivePeriod.start).toISOString(),
        end: new Date(data.effectivePeriod.end).toISOString(),
      },
      issued: new Date(data.issued).toISOString(),
      performer: [
        {
          reference: user.userId,
          display: user.username,
        },
      ],
      interpretation: data.interpretation.map((interp) => ({
        coding: [
          {
            system:
              "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
            code: interp.text,
            display: interp.text,
          },
        ],
        text: interp.text,
      })),
      note: data.note.map((n) => ({
        text: n.text,
        time: new Date(),
        authorString: "Author",
      })),
      component: data.component.map((comp) => ({
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: comp.code.text,
              display: comp.code.text,
            },
          ],
          text: comp.code.text,
        },
        valueQuantity: {
          value: parseFloat(comp.valueQuantity),
          unit: comp.unit,
          system: "http://unitsofmeasure.org",
        },
        interpretation: comp.interpretation
          ? [
              {
                coding: [
                  {
                    system:
                      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                    code: comp.interpretation,
                    display: comp.interpretation,
                  },
                ],
                text: comp.interpretation,
              },
            ]
          : [],
      })),
    };

    createResult(labresult, {
      onSettled: () => {
        reset();
        onSubmitSuccess();
      },
    });
  };

  const watchEffectiveStart = watch("effectivePeriod.start");
  const watchEffectiveEnd = watch("effectivePeriod.end");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-cyan-950">
        Aggiungi Risultato di Laboratorio
      </h2>

      <FormRow label="Status:" error={errors.status?.message}>
        <FormSelect
          id="status"
          {...register("status", { required: "Lo status è obbligatorio" })}
          options={[
            { value: "registered", label: "Registrato" },
            { value: "preliminary", label: "Preliminare" },
            { value: "final", label: "Finale" },
            { value: "amended", label: "Modificato" },
            { value: "corrected", label: "Corretto" },
            { value: "cancelled", label: "Annullato" },
            { value: "entered-in-error", label: "Inserito per errore" },
            { value: "unknown", label: "Sconosciuto" },
          ]}
        />
      </FormRow>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">Categoria</h3>
        {categoryFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              {...register(`category[${index}].text`, {
                required: "La categoria è obbligatoria",
              })}
              placeholder="laboratorio"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeCategory(index)}
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
            onClick={() => appendCategory({})}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Categoria
          </Button>
        </div>
      </div>

      <FormRow label="Codice:" error={errors.code?.text?.message}>
        <FormInput
          {...register("code.text", { required: "Il codice è obbligatorio" })}
          placeholder="segni vitali"
        />
      </FormRow>

      <FormRow
        label="Periodo di Validità Inizio:"
        error={errors.effectivePeriod?.start?.message}
      >
        <FormInput
          type="datetime-local"
          {...register("effectivePeriod.start", {
            required: "Il periodo di validità inizio è obbligatorio",
            validate: (value) =>
              !watchEffectiveEnd ||
              new Date(value) <= new Date(watchEffectiveEnd) ||
              "Il periodo di validità inizio non può essere più tardi del periodo di validità fine",
          })}
        />
      </FormRow>

      <FormRow
        label="Periodo di Validità Fine:"
        error={errors.effectivePeriod?.end?.message}
      >
        <FormInput
          type="datetime-local"
          {...register("effectivePeriod.end", {
            required: "Il periodo di validità fine è obbligatorio",
            validate: (value) =>
              !watchEffectiveStart ||
              new Date(value) >= new Date(watchEffectiveStart) ||
              "Il periodo di validità fine non può essere prima del periodo di validità inizio",
          })}
        />
      </FormRow>

      <FormRow label="Data di Emissione:" error={errors.issued?.message}>
        <FormInput
          type="datetime-local"
          {...register("issued", {
            required: "La data di emissione è obbligatoria",
            validate: (value) =>
              new Date(value) <= new Date() ||
              "La data di emissione non può essere nel futuro",
          })}
        />
      </FormRow>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">
          Interpretazione
        </h3>
        {interpretationFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              {...register(`interpretation[${index}].text`, {
                required: "L'interpretazione è obbligatoria",
              })}
              placeholder="descrizione"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeInterpretation(index)}
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
            onClick={() => appendInterpretation({})}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Interpretazione
          </Button>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">Note</h3>
        {noteFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              {...register(`note[${index}].text`, {
                required: "La nota è obbligatoria",
              })}
              placeholder="Nota"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeNote(index)}
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
            onClick={() => appendNote({})}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Nota
          </Button>
        </div>
      </div>

      <div className="mb-4 border-b pb-4">
        <h3 className="mb-4 text-xl font-semibold text-cyan-950">Componenti</h3>
        {componentFields.map((item, index) => (
          <div key={item.id} className="mb-2 flex space-x-2">
            <FormInput
              {...register(`component[${index}].code.text`, {
                required: `Il codice del componente ${index + 1} è obbligatorio`,
              })}
              placeholder="pressione sanguigna"
            />
            <FormInput
              type="number"
              {...register(`component[${index}].valueQuantity`, {
                required: `Il valore del componente ${index + 1} è obbligatorio`,
                valueAsNumber: true,
              })}
              placeholder="Valore"
            />
            <FormInput
              {...register(`component[${index}].unit`, {
                required: `L'unità del componente ${index + 1} è obbligatoria`,
              })}
              placeholder="Unità"
            />
            <div className="flex justify-end">
              <Button
                type="button"
                variant="delete"
                onClick={() => removeComponent(index)}
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
            onClick={() => appendComponent({})}
            variant="secondary"
            size="small"
          >
            <FaPlus className="mr-1" /> Aggiungi Componente
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
          {isPending ? <SmallSpinner /> : "Aggiungi risultato laboratorio"}
        </Button>
      </div>
    </form>
  );
};

export default AddLabResultForm;
